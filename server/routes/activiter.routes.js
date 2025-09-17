const router = require('express').Router();
const activiterController = require('../controllers/activiter.controller');

const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')

router.use(auth) // Middleware d'authentification pour toutes les routes de ce fichier

router.post('/add', authorizeRole('Agent', 'Admin'), activiterController.createActiviter);
router.get('/activites', activiterController.getActiviterByAgent);
router.get('/performances', activiterController.getPerformanceByAgent);
router.put('/:id', activiterController.updateActiviter);
router.delete('/:id', activiterController.deleteActiviter);

module.exports = router;
