const router = require('express').Router();
const activiterController = require('../controllers/activiter.controller');

const authMiddleware = require('../middlewares/auth'); // pour récupérer req.user
router.use(authMiddleware); // toutes les routes nécessitent login

router.post('/add', activiterController.createActiviter);
router.get('/activites', activiterController.getActiviterByAgent);
router.get('/performances', activiterController.getPerformanceByAgent);
router.put('/:id', activiterController.updateActiviter);
router.delete('/:id', activiterController.deleteActiviter);

module.exports = router;
