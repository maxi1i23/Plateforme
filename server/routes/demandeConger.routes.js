const router = require('express').Router();
const demandeCongerController = require('../controllers/demandeConger.controller');

router.get('/',demandeCongerController.getAllDemandesCongers);
router.get('/:id',demandeCongerController.getDemandeCongerById);
router.post('/add',demandeCongerController.createDemandeConger);
router.put('/traiter/:id',demandeCongerController.traiterDemandeConger);
router.put('/update/:id',demandeCongerController.updateDemandeConger);
router.delete('/delete/:id',demandeCongerController.deleteDemandeConger);

module.exports = router;