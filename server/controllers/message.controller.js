const Message = require('../models/message.model');
let io; // Socket.IO instance

// Permet de passer l'instance io depuis index.js
exports.setIO = (socketIO) => {
  io = socketIO;
};

// Création d'un message
exports.createMessage = async (req, res) => {
  try {
    const { contenuMessage, idUtilisateurExpediteur, idUtilisateurRecepteur } = req.body;

    // 1️⃣ Créer le message en base
    const message = await Message.createMessage(
      contenuMessage,
      idUtilisateurExpediteur,
      idUtilisateurRecepteur
    );

    // 2️⃣ Ajouter les fichiers si présents
    let fichiers = [];
    if (req.files && req.files.length > 0) {
      fichiers = await Message.FichierMessage.addFiles(message.idmessage, req.files);
    }

    // 3️⃣ Préparer l'objet normalisé pour le frontend
    const messageWithFiles = {
      idmessage: message.idmessage,
      contenumessage: message.contenumessage,
      datemessage: message.dateMessage ? new Date(message.dateMessage).toISOString() : new Date().toISOString(),
      idutilisateurexpediteur: idUtilisateurExpediteur,
      idutilisateurrecepteur: idUtilisateurRecepteur,
      fichiers
    };


    // Émission temps réel via Socket.IO
    /*
    if (io) {
      console.log(messageWithFiles)
      io.to(idUtilisateurRecepteur).emit('receiveMessage', messageWithFiles);
      io.to(idUtilisateurExpediteur).emit('receiveMessage', messageWithFiles);
    }*/

    return res.status(201).json({
      message: "Message envoyé avec succès",
      data: messageWithFiles
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer les messages entre deux utilisateurs
exports.getMessageByID = async (req, res) => {
  try {
    const currentUserId = req.user.id; // connecté
    const otherUserId = parseInt(req.params.id);

    const messages = await Message.getMessagesBetweenUsers(currentUserId, otherUserId);

    // Normalisation pour React
    const normalized = messages.map(msg => ({
      idmessage: msg.idmessage,
      contenumessage: msg.contenumessage,
      datemessage: msg.dateMessage ? new Date(msg.datemessage).toISOString() : new Date().toISOString(),
      idutilisateurexpediteur: msg.idutilisateurexpediteur,
      idutilisateurrecepteur: msg.idutilisateurrecepteur,
      fichiers: msg.fichiers || []
    }));

    res.status(200).json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// Récupérer tous les messages
exports.getAllMessages = async (req, res) => {
  try {
    const result = await Message.getAllMessages();
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Aucun message trouvé" });
    }

    // Normalisation
    const normalized = result.map(msg => ({
      idmessage: msg.idmessage,
      contenumessage: msg.contenuMessage,
      datemessage: msg.dateMessage ? new Date(msg.dateMessage).toISOString() : new Date().toISOString(),
      idutilisateurexpediteur: msg.idUtilisateurExpediteur,
      idutilisateurrecepteur: msg.idUtilisateurRecepteur,
      fichiers: msg.fichiers || []
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// Modifier un message
exports.updateMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const { contenuMessage } = req.body;

    const result = await Message.updateMessage(id, contenuMessage);

    if (!result) {
      return res.status(404).json({ message: "Aucune modification n'a été effectuée" });
    }

    return res.status(200).json({ message: "Le message a bien été modifié" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Message.deleteMessage(id);

    if (!result) {
      return res.status(404).json({ message: "Aucune suppression n'a été effectuée" });
    }

    return res.status(200).json({ message: "Le message a bien été supprimé" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", error: err });
  }
};
