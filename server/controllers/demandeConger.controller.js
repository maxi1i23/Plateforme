const DemandeConger = require('../models/demandeConger.model');

// Récupérer toutes les demandes
exports.getAllDemandesCongers = async (req, res) => {
    try {
        const result = await DemandeConger.getDemandeConger();
        if (result && result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).send('Aucune demande de congé trouvée !');
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

// Récupérer une demande par ID
exports.getDemandeCongerById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await DemandeConger.getDemandeCongerbyId(id);
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).send("Demande de congé introuvable !");
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

// Créer une nouvelle demande
exports.createDemandeConger = async (req, res) => {
    try {
        const { typeConger, dateDebutConger, dateFinConger, idAgentDemander, idManagerTraiter } = req.body;
        // Récupérer l'id de l'agent depuis le token
        // const idAgentDemander = req.user.id;  // req.user défini par middleware auth
        const result = await DemandeConger.creerDemandeConger(typeConger, dateDebutConger, dateFinConger, idAgentDemander, idManagerTraiter);
        
        return res.status(201).json({
            message: "Demande créée avec succès",
            demande: result
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};

// Modifier une demande
exports.updateDemandeConger = async (req, res) => {
    try {
        const id = req.params.id;
        const { typeConger, dateDebutConger, dateFinConger, idManagerTraiter } = req.body;
        const result = await DemandeConger.updateDemandeConger(id, typeConger, dateDebutConger, dateFinConger, idManagerTraiter);
        
        if (result) {
            return res.status(200).json({
                message: 'Demande modifiée avec succès',
                demande: result
            });
        } else {
            return res.status(404).send("Demande de congé introuvable");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

// Supprimer une demande
exports.deleteDemandeConger = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await DemandeConger.deleteDemandeConger(id);
        if (result) {
            return res.status(200).json({ message: 'Demande supprimée avec succès' });
        } else {
            return res.status(404).send("Demande de congé introuvable");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

// Traiter une demande (accepter/refuser)
exports.traiterDemandeConger = async (req, res) => {
    try {
        const id = req.params.id;
        const { statutConger } = req.body;
        const result = await DemandeConger.traiterDemandeConger(id, statutConger);
        
        if (result) {
            return res.status(200).json({
                message: `La demande a été traitée avec succès`,
                statut: statutConger,
                demande: result
            });
        } else {
            return res.status(404).send("Demande de congé introuvable");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};
