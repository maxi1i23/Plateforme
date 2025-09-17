const router = require('express').Router();
const demandeCongerController = require('../controllers/demandeConger.controller');
const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')

router.use(auth) // Middleware d'authentification pour toutes les routes de ce fichier

router.get('/', demandeCongerController.getAllDemandesCongers);
router.get('/:id',demandeCongerController.getDemandeCongerById);
router.post('/add', authorizeRole('Agent'), demandeCongerController.createDemandeConger);
router.put('/traiter/:id', authorizeRole('Manager'), demandeCongerController.traiterDemandeConger);
router.put('/update/:id', authorizeRole('Admin', 'Agent'), demandeCongerController.updateDemandeConger);
router.delete('/delete/:id', authorizeRole('Admin'), demandeCongerController.deleteDemandeConger);

module.exports = router;