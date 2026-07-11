import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Car, ChevronLeft } from "lucide-react";
import Topbar from "../components/Topbar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { fetchVehicle, createVehicle, updateVehicle } from "../api/vehicleApi";
import { formatDate } from "../lib/format";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];

const EMPTY_FORM = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  registrationNumber: "",
  vin: "",
  color: "",
  fuelType: "Petrol",
  mileage: "",
};

export default function AddVehicle() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    fetchVehicle(id)
      .then(({ data }) => {
        setForm({ ...EMPTY_FORM, ...data.vehicle });
        setServices(data.services || []);
      })
      .catch(() => setError("Could not load this vehicle."))
      .finally(() => setIsLoading(false));
  }, [id, isEditing]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.make || !form.model || !form.year || !form.registrationNumber) {
      setError("Make, model, year, and registration number are required.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = { ...form, year: Number(form.year), mileage: Number(form.mileage) || 0 };
      if (isEditing) {
        await updateVehicle(id, payload);
      } else {
        await createVehicle(payload);
      }
      navigate("/vehicles");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this vehicle.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Topbar title={isEditing ? "Edit Vehicle" : "Add New Vehicle"} subtitle="Keep your vehicle details up to date." />

      <div className="flex-1 p-8">
        <Link to="/vehicles" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> Back to Vehicles
        </Link>

        {isLoading ? (
          <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">General Information</h2>

              <div className="mt-5 flex flex-col gap-6 sm:flex-row">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  <Car className="h-10 w-10 text-slate-300" />
                </div>

                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField label="Make" required placeholder="Toyota" value={form.make} onChange={handleChange("make")} />
                  <TextField label="Model" required placeholder="Camry" value={form.model} onChange={handleChange("model")} />
                  <TextField
                    label="Registration Number"
                    required
                    placeholder="e.g. BA 12 PA 3456"
                    value={form.registrationNumber}
                    onChange={handleChange("registrationNumber")}
                  />
                  <TextField label="VIN" placeholder="Vehicle identification number" value={form.vin} onChange={handleChange("vin")} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TextField
                  label="Year"
                  type="number"
                  required
                  value={form.year}
                  onChange={handleChange("year")}
                />
                <TextField label="Color" placeholder="e.g. Silver" value={form.color} onChange={handleChange("color")} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Fuel Type</label>
                  <select
                    value={form.fuelType}
                    onChange={handleChange("fuelType")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    {FUEL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">Additional Information</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  label="Current Mileage"
                  type="number"
                  placeholder="e.g. 42500"
                  value={form.mileage}
                  onChange={handleChange("mileage")}
                />
              </div>
            </div>

            {isEditing && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-base font-semibold text-slate-900">Service History</h2>
                {services.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-400">No service records logged for this vehicle yet.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-slate-100">
                    {services.map((s) => (
                      <li key={s._id} className="flex items-center justify-between py-3 text-sm">
                        <div>
                          <p className="font-medium text-slate-800">{s.serviceType}</p>
                          <p className="text-slate-500">{formatDate(s.serviceDate)}</p>
                        </div>
                        <StatusBadge status={s.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {error && <p className="text-sm text-danger-700">{error}</p>}

            <div className="flex justify-end gap-3">
              <Link to="/vehicles">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSaving}>
                Save Vehicle
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
