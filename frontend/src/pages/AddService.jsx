import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  X,
  Plus,
  Wrench,
  MapPin,
  Gauge,
  DollarSign,
  AlertCircle,
  CalendarClock,
  UploadCloud,
  FileText,
  CarFront,
} from "lucide-react";
import Topbar from "../components/Topbar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { fetchVehicles } from "../api/vehicleApi";
import { fetchReminders, createReminder } from "../api/reminderApi";
import { createService, uploadServiceBill } from "../api/serviceApi";
import { daysUntil } from "../lib/format";

const SERVICE_TYPES = [
  "Oil Change",
  "Brake Service",
  "Tire Rotation",
  "Battery Replacement",
  "AC Service",
  "Engine Repair",
  "Wheel Alignment",
  "General Checkup",
  "Other",
];

const CATEGORY_OPTIONS = ["Oil Change", "Insurance", "Inspection", "Tire Rotation", "Battery Check", "Other"];

const MAX_BILL_SIZE = 5 * 1024 * 1024;

// Labels a vehicle with how soon it's due for service, so the closest one
// surfaces at the top of the picker instead of an arbitrary list order.
function urgencyLabel(dueDate) {
  if (!dueDate) return "";
  const days = daysUntil(dueDate);
  if (days < 0) return ` — Overdue by ${Math.abs(days)}d`;
  if (days === 0) return " — Due today";
  return ` — Due in ${days}d`;
}

export default function AddService() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    vehicle: "",
    serviceType: "",
    serviceCenter: "",
    serviceDate: new Date().toISOString().slice(0, 10),
    mileageAtService: "",
    cost: "",
    notes: "",
    category: "",
  });
  const [parts, setParts] = useState([]);
  const [partInput, setPartInput] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [nextServiceMileage, setNextServiceMileage] = useState("");
  const [billFile, setBillFile] = useState(null);
  const [billError, setBillError] = useState("");

  useEffect(() => {
    Promise.all([fetchVehicles(), fetchReminders({ status: "Pending" })])
      .then(([vehiclesRes, remindersRes]) => {
        setVehicles(vehiclesRes.data.vehicles);
        setReminders(remindersRes.data.reminders);
        if (vehiclesRes.data.vehicles[0]) {
          setForm((f) => ({ ...f, vehicle: vehiclesRes.data.vehicles[0]._id }));
        }
      })
      .finally(() => setIsLoadingVehicles(false));
  }, []);

  // Sorts vehicles so the ones needing service soonest appear first in the dropdown.
  const rankedVehicles = useMemo(() => {
    return vehicles
      .map((v) => {
        const nextDue = reminders
          .filter((r) => (r.vehicle?._id || r.vehicle) === v._id)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
        const days = nextDue ? daysUntil(nextDue.dueDate) : Infinity;
        return { vehicle: v, rank: days, suffix: urgencyLabel(nextDue?.dueDate) };
      })
      .sort((a, b) => a.rank - b.rank);
  }, [vehicles, reminders]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addPart = () => {
    const name = partInput.trim();
    if (!name) return;
    setParts((prev) => [...prev, name]);
    setPartInput("");
  };

  const handlePartKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPart();
    }
  };

  const removePart = (idx) => setParts((prev) => prev.filter((_, i) => i !== idx));

  const handleBillChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBillError("");
    if (file.size > MAX_BILL_SIZE) {
      setBillError("File is too large — 5MB max.");
      return;
    }
    setBillFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.vehicle || !form.serviceType || !form.serviceDate || !form.mileageAtService) {
      setError("Vehicle, service type, service date, and odometer reading are required.");
      return;
    }
    setIsSaving(true);
    try {
      const { data } = await createService({
        ...form,
        mileageAtService: Number(form.mileageAtService) || 0,
        cost: Number(form.cost) || 0,
        partsReplaced: parts.map((name) => ({ name, cost: 0 })),
        category: form.category || undefined,
      });

      if (billFile) {
        await uploadServiceBill(data.service._id, billFile);
      }

      if (nextServiceDate || nextServiceMileage) {
        await createReminder({
          vehicle: form.vehicle,
          category: form.category || "Other",
          title: `${form.serviceType} — Next Service`,
          dueDate: nextServiceDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().slice(0, 10),
          targetMileage: nextServiceMileage ? Number(nextServiceMileage) : undefined,
        });
      }

      navigate("/services");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this service record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Topbar title="Add New Service" />

      <div className="flex-1 p-8">
        <Link to="/services" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> Back to Services
        </Link>

        {isLoadingVehicles ? (
          <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <CarFront className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-700">You don't have any vehicles yet</p>
            <p className="mt-1 text-sm text-slate-500">Add a vehicle first so you can log a service record for it.</p>
            <Link to="/vehicles/new" className="mt-4">
              <Button type="button">Add a Vehicle</Button>
            </Link>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Service Details</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Service Type <span className="text-danger-500">*</span>
                </label>
                <select
                  required
                  value={form.serviceType}
                  onChange={handleChange("serviceType")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="" disabled>
                    Select service type
                  </option>
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Vehicle <span className="text-danger-500">*</span>
                </label>
                <select
                  required
                  value={form.vehicle}
                  onChange={handleChange("vehicle")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  {rankedVehicles.map(({ vehicle: v, suffix }) => (
                    <option key={v._id} value={v._id}>
                      {v.year} {v.make} {v.model} — {v.registrationNumber}
                      {suffix}
                    </option>
                  ))}
                </select>
              </div>

              <TextField
                label="Service Date"
                type="date"
                required
                value={form.serviceDate}
                onChange={handleChange("serviceDate")}
              />
              <TextField
                label="Odometer Reading (KM)"
                type="number"
                required
                icon={Gauge}
                hint="e.g. 25680"
                value={form.mileageAtService}
                onChange={handleChange("mileageAtService")}
              />
              <TextField
                label="Service Provider / Workshop"
                icon={MapPin}
                hint="e.g. Pitstop Auto Care"
                value={form.serviceCenter}
                onChange={handleChange("serviceCenter")}
              />
              <TextField
                label="Service Cost (NPR)"
                type="number"
                icon={DollarSign}
                hint="e.g. 3500"
                value={form.cost}
                onChange={handleChange("cost")}
              />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Description / Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Engine oil changed and general checkup done."
                value={form.notes}
                onChange={handleChange("notes")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Parts Replaced (Optional)</h2>
              <button
                type="button"
                onClick={addPart}
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add Part
              </button>
            </div>

            <div className="mt-4 flex gap-3">
              <div className="flex-1">
                <TextField
                  icon={Wrench}
                  placeholder="e.g. Engine Oil (4L)"
                  value={partInput}
                  onChange={(e) => setPartInput(e.target.value)}
                  onKeyDown={handlePartKeyDown}
                />
              </div>
            </div>

            {parts.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {parts.map((name, idx) => (
                  <span
                    key={`${name}-${idx}`}
                    className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm text-primary-700"
                  >
                    {name}
                    <button type="button" onClick={() => removePart(idx)} className="text-primary-400 hover:text-primary-700">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">Next Service Reminder</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">Set either a date, a mileage target, or both.</p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                label="By Date"
                type="date"
                value={nextServiceDate}
                onChange={(e) => setNextServiceDate(e.target.value)}
              />
              <TextField
                label="By KM"
                type="number"
                icon={Gauge}
                hint="e.g. 30000"
                value={nextServiceMileage}
                onChange={(e) => setNextServiceMileage(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Attach Invoice / Bill (Optional)</h2>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center hover:border-primary-300 hover:bg-primary-50/40">
              {billFile ? (
                <>
                  <FileText className="h-6 w-6 text-primary-600" />
                  <p className="text-sm font-medium text-slate-700">{billFile.name}</p>
                  <p className="text-xs text-slate-400">Click to replace</p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-6 w-6 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">Upload file</p>
                  <p className="text-xs text-slate-400">JPG, PNG, PDF up to 5MB</p>
                </>
              )}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleBillChange} />
            </label>
            {billError && <p className="mt-2 text-xs text-danger-600">{billError}</p>}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Tags / Category (Optional)</h2>
            <div className="mt-4">
              <select
                value={form.category}
                onChange={handleChange("category")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select tags</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm text-danger-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Link to="/services">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={isSaving}>
              Save Service
            </Button>
          </div>
        </form>
        )}
      </div>
    </>
  );
}
