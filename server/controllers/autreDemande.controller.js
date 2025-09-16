const AutreDemande = require('../models/autreDemande.model');

exports.createAutreDemande = async (req, res) => {
    try {
        const { nomAutreDemande, descriptionAutreDemande, dateAutreDemande, statutAutreDemande, idAgentAutreDemande, idManagerTraiterAutreDemande } = req.body

        // Récupérer l'id de l'agent depuis le token
        // const idAgentAutreDemande = req.user.id;  // req.user défini par middleware auth

        const result = await AutreDemande.createAutreDemande(nomAutreDemande, descriptionAutreDemande, dateAutreDemande, idAgentAutreDemande, idManagerTraiterAutreDemande)

        if(result){
            return res.json({
                message : "Votre demande a été envoyé avec succès",
            })
        }
        else{
            return res.json({
                message : "Erreur lors de l'envoi de la demande",
            })
        }
    } catch (error) {
        return res.json({
            message : error,
            status : 500
        })
    }
}

exports.getAutreDemandeById = async(req,res)=>{
    try{
        const id = req.params.id;
        console.log(id)
        const autreDemande= await AutreDemande.getAutreDemandeById(id);
        if(autreDemande){
            return res.status(201).json({autreDemande});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send("Server Error");
    }
}
exports.getAutreDemandes = async(req,res)=>{
    try{
        const result=await AutreDemande.getAutreDemande();
        return res.status(201).json({result});
    }catch(err){
        console.log(err);
        return res.status(500).send("Server Error");
    }
}

exports.deleteAutreDemande = async (req,res)=>{
    try{
        const id=req.params.id;
        const result = await AutreDemande.deleteAutreDemande(id);
        if(result){
            return res.status(201).json({message:'La demande a bien été supprimé'})
        }else{
            return res.status(404).json({message:'Une erreur est survenue'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send("Erreur serveur");
    }
}

exports.updateAutreDemande = async (req,res)=>{
    try{
        const id=req.params.id;
        const {nomAutreDemande,descriptionAutreDemande,dateAutreDemande,statutAutreDemande,idAgentAutreDemande,idManagerTraiterAutreDemande}=req.body;
        const result = await AutreDemande.updateAutreDemande(id,nomAutreDemande,descriptionAutreDemande,dateAutreDemande,statutAutreDemande,idAgentAutreDemande,idManagerTraiterAutreDemande);
        if(result){
            return res.status(201).json({message:'La demande a bien été modifié'})
        }else{
            return res.status(404).json({message:'Une erreur est survenue'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send("Erreur serveur");
    }
}
