const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const authorizeRole = require('../middleware/authorizeRole.middleware');

router.post('/login', authController.login);
router.get('/me', authController.me);
router.post('/register',auth, authorizeRole('Admin'), authController.register);
router.post('/logout',auth, authController.logout);

module.exports = router;