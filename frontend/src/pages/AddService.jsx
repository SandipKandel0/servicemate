import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X } from "lucide-react";
import Topbar from "../components/Topbar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { fetchVehicles } from "../api/vehicleApi";
import { createService } from "../api/serviceApi";

const STATUS_OPTIONS = ["Scheduled", "In Progress", "Completed", "Overdue"];

export default function AddService() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    vehicle: "",
    serviceType: "",
    serviceCenter: "",
    serviceDate: new Date().toISOString().slice(0, 10),
    mileageAtService: "",
    cost: "",
    status: "Scheduled",
    notes: "",
  });
  const [parts, setParts] = useState([{ name: "", cost: "" }]);

  useEffect(() => {
    fetchVehicles().then(({ data }) => {
      setVehicles(data.vehicles);
      if (data.vehicles[0]) setForm((f) => ({ ...f, vehicle: data.vehicles[0]._id }));
    });
  }, []);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const updatePart = (idx, field, value) =>
    setParts((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));

  const addPartRow = () => setParts((prev) => [...prev, { name: "", cost: "" }]);
  const removePartRow = (idx) => setParts((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.vehicle || !form.serviceType || !form.serviceDate) {
      setError("Vehicle, service type, and service date are required.");
      return;
    }
    setIsSaving(true);
    try {
      await createService({
        ...form,
        mileageAtService: Number(form.mileageAtService) || 0,
        cost: Number(form.cost) || 0,
        partsReplaced: parts
          .filter((p) => p.name.trim())
          .map((p) => ({ name: p.name, cost: Number(p.cost) || 0 })),
      });
      navigate("/services");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this service record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Topbar title="Add New Service" subtitle="Log a service record for one of your vehicles." />

      <div className="flex-1 p-8">
        <Link to="/services" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> Back to Services
        </Link>

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Service Details</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Vehicle <span className="text-danger-500">*</span>
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

              <TextField
                label="Service Type"
                required
                placeholder="e.g. Oil Change, Brake Pad Replacement"
                value={form.serviceType}
                onChange={handleChange("serviceType")}
              />
              <TextField
                label="Service Center"
                placeholder="e.g. AutoCare Center, Kathmandu"
                value={form.serviceCenter}
                onChange={handleChange("serviceCenter")}
              />
              <TextField
                label="Service Date"
                type="date"
                required
                value={form.serviceDate}
                onChange={handleChange("serviceDate")}
              />
              <TextField
                label="Mileage at Service"
                type="number"
                placeholder="e.g. 42500"
                value={form.mileageAtService}
                onChange={handleChange("mileageAtService")}
              />
              <TextField
                label="Cost"
                type="number"
                placeholder="0.00"
                value={form.cost}
                onChange={handleChange("cost")}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={form.status}
                  onChange={handleChange("status")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Parts Replaced</h2>
              <button
                type="button"
                onClick={addPartRow}
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add Another Part
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {parts.map((part, idx) => (
                <div key={idx} className="flex items-end gap-3">
                  <div className="flex-1">
                    <TextField
                      label={idx === 0 ? "Part Name" : undefined}
                      placeholder="e.g. Brake Pads"
                      value={part.name}
                      onChange={(e) => updatePart(idx, "name", e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <TextField
                      label={idx === 0 ? "Cost" : undefined}
                      type="number"
                      placeholder="0.00"
                      value={part.cost}
                      onChange={(e) => updatePart(idx, "cost", e.target.value)}
                    />
                  </div>
                  {parts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePartRow(idx)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-danger-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              rows={3}
              placeholder="Any additional details about this service..."
              value={form.notes}
              onChange={handleChange("notes")}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {error && <p className="text-sm text-danger-700">{error}</p>}

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
      </div>
    </>
  );
}
