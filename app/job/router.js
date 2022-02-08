const router = require('express').Router();
const multer = require('multer')
const jobController = require('./controller');

router.get('/jobs', jobController.index);
router.post('/jobs', multer().none(), jobController.store);
router.put('/jobs/:id', multer().none(), jobController.update);
router.delete('/jobs/:id', jobController.destroy);

module.exports = router;