const Avis = require('../models/avis.model');

exports.getAvis = async (req, res) => {
    try {
        const result = await Avis.getAvis();
        const avis = result.map(row=> ({
            idBriefing: row.idbriefing,
            idUtilisateurAvis: row.idutilisateuravis,
            commentaire: row.commentaire,
            dateAvis: row.dateavis,
            id: row.idavis
        }));

        return res.json(avis);
    } catch (error) {
        console.error("Error fetching avis:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAvisByBriefing = async (req, res) => {
    try {
        const { idBriefing } = req.params;
        const result = await Avis.getAvisByBriefing(idBriefing);
        const avis = result.map(row => ({
            idBriefing: row.idbriefing,
            idUtilisateurAvis: row.idutilisateuravis,
            commentaire: row.commentaire,
            dateAvis: row.dateavis,
            nomUtilisateur: row.nomutilisateur,
            id: row.idavis
        }));

        return res.json(avis);
    } catch (error) {
        console.error("Error fetching avis by briefing:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.createAvis = async (req, res) => {
    console.log(req.body);
    try {
        const { idBriefing, commentaire } = req.body;
        const idUtilisateurAvis = req.user.id; 
        const result = await Avis.createAvis(idBriefing, idUtilisateurAvis, commentaire);
        const avis = {
            idBriefing: result.idbriefing,
            idUtilisateurAvis: result.idutilisateuravis,
            commentaire: result.commentaire,
            dateAvis: result.dateavis
        }
        return res.status(201).json(avis);
    } catch (error) {
        console.error("Error creating avis:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateAvis = async (req, res) => {
    try {
        const { idBriefing, commentaire } = req.body;
        const idUtilisateurAvis = req.user.id;
        const result = await Avis.updateAvis(idBriefing, idUtilisateurAvis, commentaire);
        return res.json(result);
    } catch (error) {
        console.error("Error updating avis:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteAvis = async (req, res) => {
    try {
        const { idBriefing, idUtilisateurAvis } = req.body;
        await Avis.deleteAvis(idBriefing, idUtilisateurAvis);
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting avis:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};