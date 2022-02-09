const router = require('express').Router();
const multer = require('multer')
const os = require('os');
const announcementController = require('./controller');

router.get('/announcements', announcementController.index);
router.get('/announcements/:id', announcementController.show);
router.post('/announcements', multer({ dest: os.tmpdir() }).single('image'), announcementController.store);
router.put('/announcements/:id', multer({ dest: os.tmpdir() }).single('image'), announcementController.update);
router.delete('/announcements/:id', announcementController.destroy);

module.exports = router;