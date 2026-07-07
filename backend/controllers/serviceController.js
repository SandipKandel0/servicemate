const Service = require("../models/Service");
const Vehicle = require("../models/Vehicle");

// GET /api/services
const getServices = async (req, res) => {
  const { vehicleId, status } = req.query;
  const filter = { owner: req.user._id };
  if (vehicleId) filter.vehicle = vehicleId;
  if (status) filter.status = status;
  const services = await Service.find(filter).populate("vehicle", "make model registrationNumber").sort({ serviceDate: -1 });
  res.json({ services });
};

// GET /api/services/:id
const getService = async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, owner: req.user._id }).populate("vehicle");
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json({ service });
};

// POST /api/services
const createService = async (req, res) => {
  const { vehicle, serviceType, serviceCenter, serviceDate, mileageAtService, cost, status, partsReplaced, notes } = req.body;
  if (!vehicle || !serviceType || !serviceDate) {
    return res.status(400).json({ message: "Vehicle, service type, and service date are required" });
  }
  const vehicleDoc = await Vehicle.findOne({ _id: vehicle, owner: req.user._id });
  if (!vehicleDoc) return res.status(404).json({ message: "Vehicle not found" });

  const service = await Service.create({
    owner: req.user._id,
    vehicle,
    serviceType,
    serviceCenter,
    serviceDate,
    mileageAtService,
    cost,
    status,
    partsReplaced,
    notes,
  });

  if (mileageAtService && mileageAtService > vehicleDoc.mileage) {
    vehicleDoc.mileage = mileageAtService;
    await vehicleDoc.save();
  }

  res.status(201).json({ service });
};

// PUT /api/services/:id
const updateService = async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, owner: req.user._id });
  if (!service) return res.status(404).json({ message: "Service not found" });
  Object.assign(service, req.body);
  await service.save();
  res.json({ service });
};

// DELETE /api/services/:id
const deleteService = async (req, res) => {
  const service = await Service.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json({ message: "Service record deleted successfully" });
};

module.exports = { getServices, getService, createService, updateService, deleteService };
