const express = require("express")
const app = express()
require("dotenv").config()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const http = require("http")
const { Server } = require("socket.io")

// ---------------------
// Import des routes API
// ---------------------
const authRouter = require("./routes/auth.routes")
const userRouter = require("./routes/user.routes")
const formationRouter = require("./routes/formation.routes")
const briefingRouter = require("./routes/briefing.routes")
const notificationRouter = require("./routes/notification.routes")
const autreDemandeRouter = require("./routes/autreDemande.routes")
const demandeCongerRouter = require("./routes/demandeConger.routes")
const messageRouter = require("./routes/message.routes")
const activiterRouter = require("./routes/activiter.routes")
const groupeRouter = require("./routes/groupe.routes")

// Fonction création admin par défaut
const createDefaultAdmin = require("./function/createAdmin")

// Controller message (pour brancher io)
const messageController = require("./controllers/message.controller")

// ---------------------
// Middleware
// ---------------------
app.use(bodyParser.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173", // ton frontend (Vite/React)
    credentials: true,
  })
)

// Servir les fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// ---------------------
// Routes
// ---------------------
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/formation", formationRouter)
app.use("/api/briefing", briefingRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/autreDemande", autreDemandeRouter)
app.use("/api/demandeConger", demandeCongerRouter)
app.use("/api/message", messageRouter)
app.use("/api/activiter", activiterRouter)
app.use("/api/groupe", groupeRouter)

// ---------------------
// Serveur HTTP + Socket.IO
// ---------------------
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})

// ---------------------
// Gestion des utilisateurs en ligne
// ---------------------
const onlineUsers = new Map() // key: userId, value: Set(socketId)

io.on("connection", (socket) => {
  console.log("Nouvelle connexion Socket.IO:", socket.id)

  // ---------- UTILISATEUR ----------
  socket.on("joinRoom", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set())
    }
    onlineUsers.get(userId).add(socket.id)
    socket.join(userId)
    console.log(`Utilisateur ${userId} connecté avec socket ${socket.id}`)
  })

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
    console.log(notificationData);
    io.emit('NouvelleNotification', notificationData)
  })

  // ---------- DEMANDES ----------
  socket.on('Demande', (data) => {
    console.log(data);
    io.to(data.idutilisateurdestinataire.toString()).emit('NouvelleDemande', data);
  })

  // ---------- PUBLICATIONS ----------
  socket.on('Publication', (data) => {
    console.log(data);
    io.emit('NouvellePublication', data);
  })

  // ---------- MESSAGE PRIVÉ ----------
  socket.on('SendNouveauMessage', (data) => {
    console.log(data);
    io.to(data.idUtilisateurRecepteur?.toString() || data.idgroupe.toString()).emit('NouveauxMessage', data);
    io.to(data.idUtilisateurExpediteur.toString()).emit("NouveauxMessage", data);
  })

  // ---------- MESSAGE DE GROUPE ----------
  socket.on("sendGroupMessage", (msg) => {
    // msg doit contenir { idGroupe, idUtilisateurExpediteur, contenumessage, fichiers? }
    console.log("Message de groupe :", msg);
    io.to(`groupe_${msg.idGroupe}`).emit("receiveGroupMessage", msg);
  });

  // ---------- MESSAGE PRIVÉ SI EN LIGNE  ----------
  socket.on("sendMessage", (msg) => {

    const idUtilisateurRecepteur = msg.idUtilisateurRecepteur || msg.idutilisateurrecepteur
    const idUtilisateurExpediteur = msg.idUtilisateurExpediteur || msg.idutilisateurexpediteur
    const idGroupe = msg.idGroupe || msg.idgroupe;

    console.log(msg);

    io.to(idUtilisateurRecepteur?.toString() || msg.idgroupe.toString()).emit("receiveMessage", msg)
    io.to(idUtilisateurExpediteur.toString()).emit("receiveMessage", msg)
    if (idGroupe) {
      io.to(`groupe_${idGroupe}`).emit("receiveMessage", msg);
    }
  })

  // ---------- DÉCONNEXION ----------
  socket.on("disconnect", () => {
    console.log("Socket déconnecté:", socket.id)
    for (let [userId, sockets] of onlineUsers.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id)
        if (sockets.size === 0) {
          onlineUsers.delete(userId)
        }
        break
      }
    }
  })
})

// ---------------------
// Export io (pour controllers)
// ---------------------
module.exports.io = io

// ---------------------
// Démarrage du serveur
// ---------------------
server.listen(8000, async () => {
  createDefaultAdmin()
})
