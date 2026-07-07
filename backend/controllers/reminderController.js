const Reminder = require("../models/Reminder");

// GET /api/reminders
const getReminders = async (req, res) => {
  const { status } = req.query;
  const filter = { owner: req.user._id };
  if (status) filter.status = status;
  const reminders = await Reminder.find(filter)
    .populate("vehicle", "make model registrationNumber")
    .sort({ dueDate: 1 });
  res.json({ reminders });
};

// POST /api/reminders
const createReminder = async (req, res) => {
  const { vehicle, category, title, dueDate, priority, notes, pushNotification, emailReminder } = req.body;
  if (!vehicle || !title || !dueDate) {
    return res.status(400).json({ message: "Vehicle, title, and due date are required" });
  }
  const reminder = await Reminder.create({
    owner: req.user._id,
    vehicle,
    category,
    title,
    dueDate,
    priority,
    notes,
    pushNotification,
    emailReminder,
  });
  res.status(201).json({ reminder });
};

// PUT /api/reminders/:id
const updateReminder = async (req, res) => {
  const reminder = await Reminder.findOne({ _id: req.params.id, owner: req.user._id });
  if (!reminder) return res.status(404).json({ message: "Reminder not found" });
  Object.assign(reminder, req.body);
  await reminder.save();
  res.json({ reminder });
};

// DELETE /api/reminders/:id
const deleteReminder = async (req, res) => {
  const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!reminder) return res.status(404).json({ message: "Reminder not found" });
  res.json({ message: "Reminder deleted successfully" });
};

module.exports = { getReminders, createReminder, updateReminder, deleteReminder };
