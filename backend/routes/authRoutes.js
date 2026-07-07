const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { protect } = require("../middleware/auth");
const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  updateNotificationSettings,
} = require("../controllers/authController");

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", protect, asyncHandler(logout));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password/:token", asyncHandler(resetPassword));
router.get("/me", protect, asyncHandler(getMe));
router.put("/me", protect, asyncHandler(updateMe));
router.put("/notification-settings", protect, asyncHandler(updateNotificationSettings));

module.exports = router;
