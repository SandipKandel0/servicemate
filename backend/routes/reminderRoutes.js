const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { protect } = require("../middleware/auth");
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");

router.use(protect);
router.route("/").get(asyncHandler(getReminders)).post(asyncHandler(createReminder));
router.route("/:id").put(asyncHandler(updateReminder)).delete(asyncHandler(deleteReminder));

module.exports = router;
