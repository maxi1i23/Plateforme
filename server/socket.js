// socket.js
const { Server } = require("socket.io");

let onlineUsers = new Map();
let socketToUser = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Nouvelle connexion Socket.IO:", socket.id)

    // ---------- UTILISATEUR ----------
    socket.on("joinRoom", (userIdRaw) => {
      const userId = String(userIdRaw);

      // Eviter les doublons de socket
      if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
      const userSockets = onlineUsers.get(userId);
      if (!userSockets.has(socket.id)) {
        userSockets.add(socket.id);
      }

      socketToUser.set(socket.id, userId);
      socket.join(userId);

      console.log(`Utilisateur ${userId} connecté (${socket.id}). Sockets:`, Array.from(userSockets));
      io.emit("OnLineUser", Array.from(onlineUsers.keys()));
    });

    socket.on("GetOnLineUser", (userIdRaw) => {
      const userId = String(userIdRaw);
      io.emit("OnLineUser", Array.from(onlineUsers.keys()));
    });



    // -------Rejoindre une groupe -------
    socket.on("joinGroup", (idGroupe) => {
      socket.join(idGroupe.toString());
    });

    // ---------- GROUPE ----------
    socket.on("joinGroup", (idGroupe) => {
      socket.join(`groupe_${idGroupe}`);
      console.log(`Socket ${socket.id} a rejoint le groupe ${idGroupe}`);
    });

    // ---------- NOTIFICATIONS ----------
    socket.on('emettreNotification', (notificationData) => {
      io.emit('NouvelleNotification', notificationData)
    })

    // ---------- DEMANDES ----------
    socket.on('Demande', (data) => {
      io.to(data.idutilisateurdestinataire.toString()).emit('NouvelleDemande', data);
    })

    // ---------- PUBLICATIONS ----------
    socket.on('Publication', (data) => {
      io.emit('NouvellePublication', data);
    })

    // ---------- MESSAGE PRIVÉ ----------
    socket.on('NouveauxMessage', (data) => {
      io.to(data.idutilisateurrecepteur?.toString() || data.idgroupe?.toString()).emit('NouveauxMessage', data);
      io.to(data.idutilisateurexpediteur?.toString()).emit("NouveauxMessage", data);
    })

    // ---------- MESSAGE DE GROUPE ----------
    socket.on("sendGroupMessage", (msg) => {
      // msg doit contenir { idGroupe, idUtilisateurExpediteur, contenumessage, fichiers? }
      io.to(`groupe_${msg.idGroupe}`).emit("receiveGroupMessage", msg);
    });

    // ---------- MESSAGE PRIVÉ SI EN LIGNE  ----------
    socket.on("sendMessage", (msg) => {

      const idUtilisateurRecepteur = msg.idUtilisateurRecepteur || msg.idutilisateurrecepteur
      const idUtilisateurExpediteur = msg.idUtilisateurExpediteur || msg.idutilisateurexpediteur
      const idGroupe = msg.idGroupe || msg.idgroupe;

      io.to(idUtilisateurRecepteur?.toString() || msg.idgroupe.toString()).emit("receiveMessage", msg)
      io.to(idUtilisateurExpediteur.toString()).emit("receiveMessage", msg)
      if (idGroupe) {
        io.to(`groupe_${idGroupe}`).emit("receiveMessage", msg);
      }
    })

    // ---------- DÉCONNEXION ----------
    socket.on("disconnect", () => {
      const userId = socketToUser.get(socket.id);
      if (userId && onlineUsers.has(userId)) {
        const sockets = onlineUsers.get(userId);
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          console.log(`Utilisateur ${userId} est maintenant OFFLINE`);
        } else {
          console.log(`Utilisateur ${userId} reste en ligne, sockets restants:`, Array.from(sockets));
        }
        socketToUser.delete(socket.id);
        io.emit("OnLineUser", Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
}

module.exports = setupSocket;
