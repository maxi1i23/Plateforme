const Notification = require('../models/notification.model');

module.exports.getAllNotifications = async (req, res) => {
    try {
        const result = await Notification.getAllNotifications();
        if(result){
            return res.json(result)
        }
        else{
            return res.status(401).json({message:"Aucune notification"})
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.getNotificationById = async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Notification.getAllNotifications(id);
        if(result.rowCount > 0){
            return res.json({
                notification : result,
                message : "notification trouvé"
            })
        }
        else{
            return res.status(401).json({message:"Aucune notification"})
        }
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports.createNotification = async(req,res)=>{
    try {
        const {contenu, raisonNotification, idUtilisateurDestinataire} = req.body;
        const result = await Notification.createNotification(contenu, raisonNotification, idUtilisateurDestinataire);
        if(result){
            return res.json(result)
        }
        else{
            return res.status(401).json({message:"Erreur lors de l'ajout"})
        }
    }catch(error){
        res.status(500).json(error.message);
    }
}
module.exports.updateNotification = async(req,res)=>{
    try {
        const id = req.params.id;
        const {contenu, raisonNotification, idUtilisateurDestinataire} = req.body;
        const result = await Notification.updateNotification(id, contenu, raisonNotification, idUtilisateurDestinataire);
        if(result){
            return res.json({
                notification : result,
                message : "notification modifié avec succès"
            })
        }
        else{
            return res.status(401).json({message:"Erreur lors de la modification"})
        }
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports.deleteNotification = async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Notification.deleteNotification(id);
        if(result){
            return res.json({
                message : "notification supprimé avec succès"
            })
        }
        else{
            return res.status(401).json({message:"Erreur lors de la suppression"})
        }
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}