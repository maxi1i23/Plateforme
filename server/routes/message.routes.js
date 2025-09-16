const router = require('express').Router();
const messageController = require('../controllers/message.controller');

router.get('/', messageController.getAllMessages)
router.post('/add', messageController.createMessage)
router.delete('/delete/:id', messageController.deleteMessage)
router.put('/update/:id', messageController.updateMessage)

module.exports = router;