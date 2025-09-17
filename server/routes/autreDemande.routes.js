const router = require('express').Router();
const autreDemandeController = require('../controllers/autreDemande.controller');
const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')

router.use(auth) // Middleware d'authentification pour toutes les routes de ce fichier


// Agent peut créer et voir ses demandes
router.post('/add', authorizeRole('Agent', 'Admin'), autreDemandeController.createAutreDemande);
router.get('/', autreDemandeController.getAutreDemandes);
router.get('/:id', autreDemandeController.getAutreDemandeById);
router.put('/update/:id', authorizeRole('Agent', 'Admin'), autreDemandeController.updateAutreDemande);

// Manager peut traiter les demandes
router.put('/traiter/:id', authorizeRole('Manager') , autreDemandeController.updateAutreDemande);

// Mise à jour et suppression réservées à l'agent ou admin
router.delete('/delete/:id',authorizeRole('Admin'), autreDemandeController.deleteAutreDemande);

module.exports = router;
