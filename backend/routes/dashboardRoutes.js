const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { protect } = require("../middleware/auth");
const { getDashboard } = require("../controllers/dashboardController");

router.get("/", protect, asyncHandler(getDashboard));

module.exports = router;
