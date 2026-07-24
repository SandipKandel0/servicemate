const mongoose = require("mongoose");

const partSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cost: { type: Number, default: 0 },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    serviceType: { type: String, required: true },
    serviceCenter: { type: String, default: "" },
    serviceDate: { type: Date, required: true },
    mileageAtService: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Overdue"],
      default: "Scheduled",
    },
    partsReplaced: [partSchema],
    notes: { type: String, default: "" },
    billUrl: { type: String, default: "" },
    billFileName: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Oil Change", "Insurance", "Inspection", "Tire Rotation", "Battery Check", "Other"],
      default: "Other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
