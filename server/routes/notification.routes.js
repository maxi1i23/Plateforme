const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');


router.get('/', notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotificationByUser);
router.get('/count/:id', notificationController.count)
router.post('/add', notificationController.createNotification);
router.put('/update/:id', notificationController.updateNotification);
router.put('/updateStatut/:id', notificationController.updateStatut);
router.delete('/delete/:id', notificationController.deleteNotification);
router.delete('/deleteNotifUser/:id', notificationController.deleteNotifUser);

module.exports = router;