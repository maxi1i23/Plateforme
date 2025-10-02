const Activiter = require('../models/activiter.model');

// 🔹 Créer une activité
exports.createActiviter = async (req, res) => {
  try {
    const { nbAppelle, pauses, dureeAppelle } = req.body;
    const idAgent = req.user.id; // récup via middleware JWT

    const activite = await Activiter.createActiviter(nbAppelle, pauses, dureeAppelle, idAgent);

    return res.status(201).json({ message: "Activité créée avec succès", activite });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// 🔹 Récupérer toutes les activités d’un agent
exports.getActiviterByAgent = async (req, res) => {
  try {
    const idAgent = req.user.id;
    const activites = await Activiter.getActiviterByAgent();
    return res.status(200).json(activites);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// 🔹 Récupérer les performances d’un agent
exports.getPerformanceByAgent = async (req, res) => {
  try {
    const idAgent = req.user.id;
    const performances = await Activiter.getPerformanceByAgent();
    return res.status(200).json(performances);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// 🔹 Modifier une activité
exports.updateActiviter = async (req, res) => {
  try {
    const { id } = req.params;
    const { nbAppelle, pauses, dureeAppelle, dateActiviter } = req.body;

    const updatedActivite = await Activiter.updateActiviter(id, nbAppelle, pauses, dureeAppelle, dateActiviter);

    if (!updatedActivite) {
      return res.status(404).json({ message: "Activité non trouvée" });
    }

    return res.status(200).json({ message: "Activité mise à jour avec succès", activite: updatedActivite });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// 🔹 Supprimer une activité
exports.deleteActiviter = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Activiter.deleteActiviter(id);

    if (!deleted) {
      return res.status(404).json({ message: "Activité non trouvée" });
    }

    return res.status(200).json({ message: "Activité supprimée avec succès" });
  } catch (error) {
    return res.status(500).send(error);
  }
};
