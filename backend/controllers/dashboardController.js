const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const Reminder = require("../models/Reminder");

// Simple heuristic to turn a vehicle's status into a health percentage for the
// "Fleet Health Overview" bar chart on the dashboard.
const healthScoreFor = (vehicle) => {
  if (vehicle.status === "Needs Attention") return 45;
  if (vehicle.status === "In Service") return 65;
  return 92;
};

// GET /api/dashboard
const getDashboard = async (req, res) => {
  const ownerId = req.user._id;

  const [vehicles, scheduledCount, completedCount, pendingReminders, recentServices] = await Promise.all([
    Vehicle.find({ owner: ownerId }),
    Service.countDocuments({ owner: ownerId, status: "Scheduled" }),
    Service.countDocuments({ owner: ownerId, status: "Completed" }),
    Reminder.find({ owner: ownerId, status: "Pending" }).populate("vehicle", "make model registrationNumber").sort({ dueDate: 1 }),
    Service.find({ owner: ownerId }).populate("vehicle", "make model registrationNumber").sort({ serviceDate: -1 }).limit(5),
  ]);

  const needsAttentionVehicles = vehicles.filter((v) => v.status === "Needs Attention");
  const now = new Date();
  const overdueReminders = pendingReminders.filter((r) => r.dueDate < now);

  res.json({
    stats: {
      totalVehicles: vehicles.length,
      scheduledServices: scheduledCount,
      needsAttention: needsAttentionVehicles.length + overdueReminders.length,
      completedServices: completedCount,
    },
    fleetHealth: vehicles.map((v) => ({
      id: v._id,
      label: `${v.make} ${v.model}`,
      registrationNumber: v.registrationNumber,
      healthScore: healthScoreFor(v),
      status: v.status,
    })),
    needsAttention: [
      ...needsAttentionVehicles.map((v) => ({
        type: "vehicle",
        title: `${v.make} ${v.model}`,
        subtitle: v.registrationNumber,
      })),
      ...overdueReminders.map((r) => ({
        type: "reminder",
        title: r.title,
        subtitle: r.vehicle ? `${r.vehicle.make} ${r.vehicle.model}` : "",
      })),
    ],
    recentServices,
    upcomingReminders: pendingReminders.slice(0, 5),
  });
};

module.exports = { getDashboard };
