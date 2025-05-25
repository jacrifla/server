const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit');

router.post("/", unitController.create);
router.get("/", unitController.findAll);
router.get("/:unitId", unitController.findById);
router.put("/:unitId", unitController.update);
router.delete("/:unitId", unitController.delete);

module.exports = router;