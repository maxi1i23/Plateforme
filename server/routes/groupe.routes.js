const express = require("express");
const router = express.Router();
const groupeController = require("../controllers/groupe.controller");
const auth = require('../middleware/auth.middleware')

router.use(auth)

// Créer un groupe
router.post("/", groupeController.creerGroupe);
router.get("/", groupeController.getGroupeList);

// Ajouter un membre dans un groupe
router.post("/:idGroupe/membres", groupeController.ajouterMembre);

// Lister les membres d’un groupe
router.get("/:idGroupe/membres", groupeController.listerMembres);

// Lister les groupes d’un utilisateur
router.get("/utilisateur/:idUtilisateur", groupeController.listerGroupesUtilisateur);

// Quitter la groupe
router.delete("/quitter/:idGroupe", groupeController.quitterGroupe)

module.exports = router;
