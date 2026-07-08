const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    category: {
      type: String,
      enum: ["Oil Change", "Insurance", "Inspection", "Tire Rotation", "Battery Check", "Other"],
      default: "Other",
    },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    notes: { type: String, default: "" },
    pushNotification: { type: Boolean, default: true },
    emailReminder: { type: Boolean, default: false },
    status: { type: String, enum: ["Pending", "Completed", "Dismissed"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
