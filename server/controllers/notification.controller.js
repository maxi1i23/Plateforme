const Notification = require('../models/notification.model');
const UserNotif = require('../models/userNotif.model');
const User = require('../models/user.model')

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
            // La notification est destiner à un utilisateur
            if(result.idutilisateurdestinataire){
                await UserNotif.add(idUtilisateurDestinataire, result.idnotification)
            }else{
                // La notification est destinée à toutes les utilisateurs
                const user = await User.getAll();
                user.forEach(async(u)=>{
                    await UserNotif.add(u.idutilisateur, result.idnotification)
                })
            }
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

module.exports.getNotificationByUser = async(req, res)=>{
    try {
        const id = req.params.id
        const result = await UserNotif.query(id)
        return res.json(result)
    } catch (error) {
        return res.status(500).json({message : "Erreur serveur"})
    }
}

module.exports.deleteNotifUser = async (req, res)=>{
    try {
        const id = req.params.id
        const result = await UserNotif.delete(id)
        if(result) return res.json({message : "notification supprimé avec succès"});
        return res.status(401).json({message:"Erreur lors de la suppression"})
    } catch (error) {
        return res.status(500).json({message : "Une erreur serveur"})
    }
}