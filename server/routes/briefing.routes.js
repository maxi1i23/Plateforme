const briefingController = require('../controllers/briefing.controller');
const router = require('express').Router();

router.get('/:id', briefingController.getOneBriefing);
router.get('/', briefingController.getAllBriefings);
router.post('/create', briefingController.createBriefing);
router.put('/update/:id', briefingController.updateBriefing);
router.delete('/delete/:id', briefingController.deleteBriefing);

module.exports = router
