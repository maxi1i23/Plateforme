const userController = require('../controllers/user.controller');
const router = require('express').Router();
const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')

router.use(auth)


router.get('/', userController.getAllUsers)
router.put('/update/:id',authorizeRole('Admin'), userController.updateUser )
router.delete('/delete/:id',authorizeRole('Admin'), userController.deleteUser )

module.exports = router;