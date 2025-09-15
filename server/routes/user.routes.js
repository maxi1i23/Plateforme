const userController = require('../controllers/user.controller');

const router = require('express').Router();

router.get('/', userController.getAllUsers)
router.put('/update/:id', userController.updateUser )
router.delete('/delete/:id', userController.deleteUser )

module.exports = router;