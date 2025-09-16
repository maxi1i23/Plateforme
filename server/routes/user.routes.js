const userController = require('../controllers/user.controller');
const router = require('express').Router();
const auth = require('../middleware/auth.middleware')
const authorizeRole = require('../middleware/authorizeRole.middleware')

//router.use(auth)
//router.use(authorizeRole('Admin'))

router.get('/', userController.getAllUsers)
router.put('/update/:id', userController.updateUser )
router.delete('/delete/:id', userController.deleteUser )

module.exports = router;