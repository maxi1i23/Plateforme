const router = require('express').Router();
const autreDemandeController = require('../controllers/autreDemande.controller');


// Agent peut créer et voir ses demandes
router.post('/add', autreDemandeController.createAutreDemande);
router.get('/', autreDemandeController.getAutreDemandes);
router.get('/:id', autreDemandeController.getAutreDemandeById);

// Manager peut traiter les demandes
router.put('/traiter/:id', autreDemandeController.updateAutreDemande);

// Mise à jour et suppression réservées à l'agent ou admin
router.put('/update/:id', autreDemandeController.updateAutreDemande);
router.delete('/delete/:id', autreDemandeController.deleteAutreDemande);

module.exports = router;
