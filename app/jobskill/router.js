const router = require("express").Router();
const multer = require('multer')

const jobSkillController = require("./controller");

router.get("/job-skills", multer().none(), jobSkillController.index);
router.post("/job-skills", multer().none(), jobSkillController.store);
router.put("/job-skills/:id", multer().none(), jobSkillController.update);
router.delete("/job-skills/:id", multer().none(), jobSkillController.destroy);

module.exports = router;