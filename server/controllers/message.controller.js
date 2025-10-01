const Message = require('../models/message.model');
let io; // Socket.IO instance

// Permet de passer l'instance io depuis index.js
exports.setIO = (socketIO) => {
  io = socketIO;
};

// Création d'un message
exports.createMessage = async (req, res) => {
  try {
    const { contenuMessage, idUtilisateurExpediteur, idUtilisateurRecepteur, idGroupe, nomUtilisateur } = req.body;

    // Créer le message en base
    const message = await Message.createMessage(
      contenuMessage,
      idUtilisateurExpediteur,
      idUtilisateurRecepteur || null,
      idGroupe || null
    );

    // Ajouter les fichiers si présents
    let fichiers = [];
    if (req.files && req.files.length > 0) {
      fichiers = await Message.FichierMessage.addFiles(message.idmessage, req.files);
    }


    // Préparer l'objet normalisé pour le frontend
    const messageWithFiles = {
      idmessage: message.idmessage,
      contenumessage: message.contenumessage,
      datemessage: message.datemessage ? new Date(message.datemessage).toISOString() : new Date().toISOString(),
      idutilisateurexpediteur: message.idutilisateurexpediteur,
      idutilisateurrecepteur: message.idutilisateurrecepteur,
      idgroupe: message.idgroupe,
      nomutilisateur: nomUtilisateur,
      fichiers
    };

    console.log(message);

    // L'emissions se fais dans index js
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
      nomutilisateur: msg.nomutilisateur,
      fichiers: msg.fichiers || []
    }));

    res.status(200).json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};
exports.getMessageGroupe = async (req, res) => {
  try {
    const currentUserId = req.user.id; // connecté
    const idGroupe = parseInt(req.params.idGroupe);

    const messages = await Message.getMessagesGroup(currentUserId, idGroupe);

    // Normalisation pour React
    const normalized = messages.map(msg => ({
      idmessage: msg.idmessage,
      contenumessage: msg.contenumessage,
      datemessage: msg.dateMessage ? new Date(msg.datemessage).toISOString() : new Date().toISOString(),
      idutilisateurexpediteur: msg.idutilisateurexpediteur,
      nomutilisateur: msg.nomutilisateur,
      idgroupe: msg.idgroupe,
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

// SOFT DELETE
exports.suppressionMessage = async (req, res) => {
  try {
    const idUtilisateur = req.user.id;
    const idMessage = req.params.idMessage;
    const result = await Message.suppressionMessage(idMessage, idUtilisateur);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}

exports.suppressionAllMessage = async (req,res) => {
  try {
    const idUser = req.user.id;
    const {idGroupe, idUtilisateur} = req.body;
    let message;

    if (idGroupe) {
      message = await Message.getMessagesGroup(idUser, idGroupe)
      await Promise.all(
        message.map(msg => Message.suppressionMessage(msg.idmessage, idUser))
      );
      // Maintenant toutes les suppressions sont terminées
      const messagesRestants = await Message.getMessagesGroup(idUser, idGroupe)
      return res.status(200).json(messagesRestants);
    } else {
      message = await Message.getMessagesBetweenUsers(idUser, idUtilisateur )
      await Promise.all(
        message.map(msg => Message.suppressionMessage(msg.idmessage, idUser))
      );
      const messagesRestants = await Message.getMessagesBetweenUsers(idUser, idUtilisateur)
      return res.status(200).json(messagesRestants);
    }
    

  } catch (error) {
    return res.status(500).json(error);
  }
}
