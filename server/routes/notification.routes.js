const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');


router.get('/',notificationController.getAllNotifications);
router.get('/:id',notificationController.getNotificationById);
router.post('/add',notificationController.createNotification);
router.put('/update/:id',notificationController.updateNotification);
router.delete('/delete/:id',notificationController.deleteNotification);

module.exports = router;