import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Topbar from "../components/Topbar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { fetchVehicles } from "../api/vehicleApi";
import { createReminder } from "../api/reminderApi";

const CATEGORIES = ["Oil Change", "Insurance", "Inspection", "Tire Rotation", "Battery Check", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

export default function AddReminder() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    vehicle: "",
    category: "Oil Change",
    title: "",
    dueDate: "",
    priority: "Medium",
    notes: "",
    pushNotification: true,
    emailReminder: false,
  });

  useEffect(() => {
    fetchVehicles().then(({ data }) => {
      setVehicles(data.vehicles);
      if (data.vehicles[0]) setForm((f) => ({ ...f, vehicle: data.vehicles[0]._id }));
    });
  }, []);

  const handleChange = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.vehicle || !form.title || !form.dueDate) {
      setError("Vehicle, title, and due date are required.");
      return;
    }
    setIsSaving(true);
    try {
      await createReminder(form);
      navigate("/reminders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this reminder.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Topbar title="Add New Reminder" subtitle="We'll surface this until it's marked complete." />

      <div className="flex-1 p-8">
        <Link to="/reminders" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> Back to Reminders
        </Link>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Reminder Details</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Vehicle Selection <span className="text-danger-500">*</span>
                </label>
                <select
                  value={form.vehicle}
                  onChange={handleChange("vehicle")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="" disabled>
                    Select a vehicle
                  </option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.year} {v.make} {v.model} — {v.registrationNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Reminder Category</label>
                <select
                  value={form.category}
                  onChange={handleChange("category")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <TextField
                  label="Title"
                  required
                  placeholder="e.g. Oil Change Due, Insurance Renewal"
                  value={form.title}
                  onChange={handleChange("title")}
                />
              </div>

              <TextField label="Due Date" type="date" required value={form.dueDate} onChange={handleChange("dueDate")} />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
                <select
                  value={form.priority}
                  onChange={handleChange("priority")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
              <textarea
                rows={3}
                placeholder="Any extra details worth remembering..."
                value={form.notes}
                onChange={handleChange("notes")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Notify Me Via</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.pushNotification}
                  onChange={handleChange("pushNotification")}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Push Notifications
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.emailReminder}
                  onChange={handleChange("emailReminder")}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Email Reminder
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-danger-700">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link to="/reminders">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={isSaving}>
              Save Reminder
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
