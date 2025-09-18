const router = require('express').Router();
const activiterController = require('../controllers/activiter.controller');

const auth = require('../middleware/auth.middleware');
const authorizeRole = require('../middleware/authorizeRole.middleware');

// 🔹 Toutes les routes nécessitent une authentification
router.use(auth);

// Créer une activité
router.post('/', authorizeRole('Agent', 'Admin'), activiterController.createActiviter);

// Récupérer toutes les activités d’un agent
router.get('/', activiterController.getActiviterByAgent);

// Récupérer les performances d’un agent
router.get('/performance', activiterController.getPerformanceByAgent);

// Modifier une activité
router.put('/:id', activiterController.updateActiviter);

// Supprimer une activité
router.delete('/delete/:id', activiterController.deleteActiviter);

module.exports = router;
