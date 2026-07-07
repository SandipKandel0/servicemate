const crypto = require("crypto");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");

// POST /api/auth/register
const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Full name, email, and password are required" });
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }
  const user = await User.create({ fullName, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push(refreshToken);
  await user.save();

  res.status(201).json({ user: user.toSafeObject(), accessToken, refreshToken });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push(refreshToken);
  await user.save();

  res.json({ user: user.toSafeObject(), accessToken, refreshToken });
};

// POST /api/auth/refresh
const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

  const jwt = require("jsonwebtoken");
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: "Refresh token invalid" });
    }
    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token invalid or expired" });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken && req.user) {
    req.user.refreshTokens = req.user.refreshTokens.filter((t) => t !== refreshToken);
    await req.user.save();
  }
  res.json({ message: "Logged out successfully" });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: (email || "").toLowerCase() });
  // Always respond the same way whether or not the user exists, to avoid leaking account info
  if (!user) {
    return res.json({ message: "If that email is registered, a reset link has been sent." });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  // In production, email this link instead of logging it.
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  console.log(`Password reset link for ${user.email}: ${resetUrl}`);

  res.json({ message: "If that email is registered, a reset link has been sent." });
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: "Reset link is invalid or has expired" });
  }
  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.refreshTokens = [];
  await user.save();

  res.json({ message: "Password has been reset successfully" });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

// PUT /api/auth/me
const updateMe = async (req, res) => {
  const { fullName, phone, avatar } = req.body;
  if (fullName !== undefined) req.user.fullName = fullName;
  if (phone !== undefined) req.user.phone = phone;
  if (avatar !== undefined) req.user.avatar = avatar;
  await req.user.save();
  res.json({ user: req.user.toSafeObject() });
};

// PUT /api/auth/notification-settings
const updateNotificationSettings = async (req, res) => {
  const { pushNotifications, emailReminders } = req.body;
  if (pushNotifications !== undefined) req.user.notificationSettings.pushNotifications = pushNotifications;
  if (emailReminders !== undefined) req.user.notificationSettings.emailReminders = emailReminders;
  await req.user.save();
  res.json({ user: req.user.toSafeObject() });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  updateNotificationSettings,
};
