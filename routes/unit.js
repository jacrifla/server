const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit');
const authMiddleware = require('../middleware/authMiddleware');

router.post("/", authMiddleware, unitController.createUnit);
router.get("/", unitController.findAll);
router.put("/:id", authMiddleware, unitController.updateUnit);
router.delete("/:id", authMiddleware, unitController.deleteUnit);

module.exports = router;