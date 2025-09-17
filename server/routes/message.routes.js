const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')

router.use(auth) // Middleware d'authentification pour toutes les routes de ce fichier

router.get('/', messageController.getAllMessages)
router.post('/add', messageController.createMessage)
router.delete('/delete/:id',authorizeRole('Admin'), messageController.deleteMessage)
router.put('/update/:id', authorizeRole('Admin'), messageController.updateMessage)

module.exports = router;