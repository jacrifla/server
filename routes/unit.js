const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit');
const authMiddleware = require('../middleware/authMiddleware');

router.post("/", authMiddleware, unitController.create);
router.get("/", unitController.findAll);
router.get("/:unitId", unitController.findById);
router.put("/:unitId", authMiddleware, unitController.update);
router.delete("/:unitId", authMiddleware, unitController.delete);

module.exports = router;