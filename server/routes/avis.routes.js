const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const avisController = require('../controllers/avis.controller');

router.use(auth);

router.get('/', avisController.getAvis);
router.get('/:idBriefing', avisController.getAvisByBriefing);
router.post('/', avisController.createAvis);
router.put('/', avisController.updateAvis);
router.delete('/:id', avisController.deleteAvis);

module.exports = router;