const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");

// GET /api/vehicles
const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ vehicles });
};

// GET /api/vehicles/:id
const getVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  const services = await Service.find({ vehicle: vehicle._id }).sort({ serviceDate: -1 });
  res.json({ vehicle, services });
};

// POST /api/vehicles
const createVehicle = async (req, res) => {
  const { make, model, year, registrationNumber, vin, color, fuelType, mileage, image } = req.body;
  if (!make || !model || !year || !registrationNumber) {
    return res.status(400).json({ message: "Make, model, year, and registration number are required" });
  }
  const vehicle = await Vehicle.create({
    owner: req.user._id,
    make,
    model,
    year,
    registrationNumber,
    vin,
    color,
    fuelType,
    mileage,
    image,
  });
  res.status(201).json({ vehicle });
};

// PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  Object.assign(vehicle, req.body);
  await vehicle.save();
  res.json({ vehicle });
};

// DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  await Service.deleteMany({ vehicle: vehicle._id });
  res.json({ message: "Vehicle deleted successfully" });
};

module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle };
