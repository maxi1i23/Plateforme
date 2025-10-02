const Briefing = require('../models/briefing.model');


exports.getAllBriefings = async (req, res) => {
    try {
        const result = await Briefing.getAllBriefing();
        if(result){
            return res.status(200).json(result);
        }
        else{
            return res.status(404).send('Aucun briefing trouvé');
        }
    } catch(err){
        return res.status(500).send('Une erreur est survenue');
    }
}

exports.getOneBriefing = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Briefing.getOneById(id);
        if(result){
            return res.status(200).json(result);
        }else{
            return res.status(404).send('Briefing non trouvé');
        }
        
    } catch(err){
        return res.status(500).send('Une erreur est survenue');
    }
}
exports.createBriefing = async (req, res) => {
    try {
        const { nomBriefing, contenuBriefing, idManager } = req.body;
        const result = await Briefing.createBriefing(nomBriefing, contenuBriefing, idManager);
        if(result){
            return res.status(201).json({message: 'Briefing crée avec succes', briefing: result});
        } else{
            return res.status(409).send('Erreur lors de la création');
        }
    } catch(err){
        return res.status(500).send('Error while creating the briefing');
    }
}

exports.updateBriefing = async(req,res)=>{
    try{
        const id = req.params.id;
        const {nomBriefing, contenuBriefing} = req.body;
        const result = await Briefing.updateBriefing(id, nomBriefing, contenuBriefing);
        if(result){
            return res.status(201).json({message:'Briefing modifié avec succès'});
        }else{
            return res.status(409).send("Erreur lors de la modification");
        }

    }catch(err){
        return res.status(500).send("Une erreur est survenue");
    }
}

exports.deleteBriefing = async(req,res)=>{
    try{
        const id = req.params.id;
        const result = await Briefing.deleteBriefing(id);
        if(result){
            return res.status(201).json({message:"Briefing supprimé avec succès"});
        }else{
            return res.status(409).send("Erreur lors de la suppression");
        }
    }catch(err){
        return res.status(500).send("Une erreur est survenue");
    }
}