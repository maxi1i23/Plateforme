const router = require('express').Router();
const formationController = require('../controllers/formation.controller');

router.get('/', formationController.getAllFormations);
router.get('/:id', formationController.getFormation);
router.post('/add', formationController.createFormation);
router.put('/update/:id', formationController.updateFormation)
router.delete('/delete/:id', formationController.deleteFormation)

module.exports = router;