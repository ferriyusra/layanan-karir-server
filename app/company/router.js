const router = require('express').Router();
const multer = require('multer')
const os = require('os');
const companyController = require('./controller');

router.get('/companies', companyController.index);
router.get('/companies/:id', companyController.show);
router.post('/companies', multer({ dest: os.tmpdir() }).single('image'), companyController.store);
router.put('/companies/:id', multer({ dest: os.tmpdir() }).single('image'), companyController.update);
router.delete('/companies/:id', companyController.destroy);

module.exports = router;