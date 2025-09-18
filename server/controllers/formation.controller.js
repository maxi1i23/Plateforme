// formation controller
const Formation = require('../models/formation.model');


exports.getAllFormations = async(req,res)=>{
    try {
        const formations = await Formation.getAll();
        return res.status(200).json(formations);
    }catch(err){
        console.log(err);
        return res.status(500).send("Une erreur est survenue");
    }
}

exports.getFormation = async(req,res)=>{
    try {
        const id = req.params.id;
        const formations = await Formation.findById(id);
        return res.status(200).json(formations);
    }catch(err){
        console.log(err);
        return res.status(500).send("Une erreur est survenue");
    }
}

exports.createFormation = async(req, res) => {
    try {
        const {nomFormation, descriptionFormation, idUtilisateurManager} = req.body;

        const result = await Formation.createFormation(nomFormation, descriptionFormation, idUtilisateurManager);
        if(result){
            return res.status(201).send({ message: "Formation créée avec succès", formation: result });
        }else{
            return res.status(409).send({message:"Erreur lors de la création"})
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

exports.deleteFormation = async(req, res) => {
    try {
        const id = req.params.id;
        const result = await Formation.deleteFormation(id);
        if(result){
            return res.status(200).send({ message: "Formation supprimée avec succès" });
        }else{
            return res.status(409).send({message:"Erreur lors de la suppression"})
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
exports.updateFormation = async (req, res) => {
    try {
      const id = req.params.id;
      const { nomFormation, descriptionFormation,dateFormation,idUtilisateurManager } = req.body;
      const result = await Formation.updateFormation(id, nomFormation, descriptionFormation, dateFormation, idUtilisateurManager);
      if(result){
        return res.status(200).send({ message: "Formation modifiée avec succès" });
      }else{
          return res.status(409).send({message:"Erreur lors de la modification"})
      }
    }catch(err){
        console.log(err);
        return res.status(500).send("Une erreur est survenue");
    }
};