const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorizeRole.middleware');

router.post('/login', authController.login);
router.post('/register',authorize('Admin'), authController.register);
router.post('/logout',authMiddleware, authController.logout);

module.exports = router;