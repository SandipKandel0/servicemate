const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    registrationNumber: { type: String, required: true },
    vin: { type: String, default: "" },
    color: { type: String, default: "" },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
      default: "Petrol",
    },
    mileage: { type: Number, default: 0 },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Good", "Needs Attention", "In Service"],
      default: "Good",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
