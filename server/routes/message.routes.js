const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')
const upload = require("../middleware/upload");

router.use(auth) // Middleware d'authentification pour toutes les routes de ce fichier

router.get('/', messageController.getAllMessages)
router.get('/:id', messageController.getMessageByID)
router.get('/groupe/:idGroupe', messageController.getMessageGroupe)
router.post('/add',upload.array("fichiers", 5), messageController.createMessage)
router.delete('/delete/:id',authorizeRole('Admin'), messageController.deleteMessage)
router.put('/update/:id', authorizeRole('Admin'), messageController.updateMessage)

router.delete('/supprimer/:idMessage', messageController.suppressionMessage) // SOFT DELETE
router.post('/supprimer/tout', messageController.suppressionAllMessage)

module.exports = router;