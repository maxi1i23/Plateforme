const Message = require('../models/message.model');

exports.createMessage = async (req, res) => {
    try {
        const { contenuMessage, idUtilisateurExpediteur, idUtilisateurRecepteur } = req.body;
        console.log(req.user.id)
        const result = await Message.createMessage(contenuMessage, idUtilisateurExpediteur, idUtilisateurRecepteur);
        if(result){
            return res.status(201).json({message: "Le message a été envoyé avec succès"}, result);
        }else{
            return res.status(409).json({message: "Une erreur est survenue lors de l'envoi du message"});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

exports.getMessageByID = async(req,res)=>{
    const id = req.params.id;
    try {
        const result = await Message.getMessageById(id);
        if(result){
            return res.status(200).json(result)
        }else{
            return res.status(404).json({message:"Aucun message trouvé "});
        }
    }catch(err){
        return res.status(500).json(err);
    }
}

exports.getAllMessages = async(req,res)=>{
    try {
        const result = await Message.getAllMessages();
        if(result){
            return res.status(200).json(result)
        }else{
            return res.status(404).json({message:"Aucun message trouvé "});
        }
    }catch(err){
        return res.status(500).json(err);
    }
}

exports.updateMessage = async(req,res)=>{
    try {
        const id = req.params.id;
        const {contenuMessage}=req.body
        const result=await Message.updateMessage(id, contenuMessage,);
        if(result){
            return res.status(200).json({message:'le message à bien été modifié'});
        }else{
            return res.status(404).json({message:'aucune modification n\'a été effectuée'});
        }}catch(err){
        return res.status(500).json(err);}
}

exports.deleteMessage = async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Message.deleteMessage(id);
        if(result){
            return res.status(200).json({message:'Le message à bien été supprimé'});
        }else{
            return res.status(404).json({message:'Aucune suppression n\'a été effectuée'});
        }}catch(err){
        return res.status(500).json(err);}
}