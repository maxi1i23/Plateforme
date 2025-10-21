const router = require('express').Router();
const formationController = require('../controllers/formation.controller');
const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')

router.use(auth) // Middleware d'authentification pour toutes les routes de ce fichier

router.get('/', formationController.getAllFormations);
router.get('/:id', formationController.getFormation); // Récupérer une formation par ID du Manager
router.post('/add', authorizeRole('Manager', 'Admin'), formationController.createFormation);
router.put('/update/:id',authorizeRole('Admin', 'Manager'), formationController.updateFormation)
router.delete('/delete/:id',authorizeRole('Admin', 'Manager'), formationController.deleteFormation)

module.exports = router;