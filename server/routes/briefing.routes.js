const briefingController = require('../controllers/briefing.controller');
const router = require('express').Router();
const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')

router.use(auth) // Middleware d'authentification pour toutes les routes de ce fichier

router.get('/:id', briefingController.getOneBriefing);
router.get('/', briefingController.getAllBriefings);
router.post('/add', authorizeRole('Manager', 'Admin'), briefingController.createBriefing);
router.put('/update/:id', authorizeRole('Manager', 'Admin'),  briefingController.updateBriefing);
router.delete('/delete/:id', authorizeRole('Admin', 'Manager'), briefingController.deleteBriefing);

module.exports = router
