const router = require("express").Router();
const multer = require('multer')

const industryController = require("./controller");

router.get("/industries", multer().none(), industryController.index);
router.post("/industries", multer().none(), industryController.store);
router.put("/industries/:id", multer().none(), industryController.update);
router.delete("/industries/:id", multer().none(), industryController.destroy);

module.exports = router;