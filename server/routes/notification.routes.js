const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');


router.get('/',notificationController.getAllNotifications);
router.get('/:id',notificationController.getNotificationByUser);
router.post('/add',notificationController.createNotification);
router.put('/update/:id',notificationController.updateNotification);
router.delete('/delete/:id',notificationController.deleteNotification);
router.delete('/deleteNotifUser/:id', notificationController.deleteNotifUser);

module.exports = router;