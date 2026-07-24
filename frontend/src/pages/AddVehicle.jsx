import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Car,
  ChevronLeft,
  ChevronDown,
  Hash,
  Palette,
  Gauge,
  AlertCircle,
  Wrench,
  MapPin,
  DollarSign,
  FileText,
  Upload,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Topbar from "../components/Topbar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { fetchVehicle, createVehicle, updateVehicle } from "../api/vehicleApi";
import { uploadServiceBill } from "../api/serviceApi";
import { formatDate, formatCurrency } from "../lib/format";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const CURRENT_YEAR = new Date().getFullYear();

const EMPTY_FORM = {
  make: "",
  model: "",
  year: CURRENT_YEAR,
  registrationNumber: "",
  vin: "",
  color: "",
  fuelType: "Petrol",
  mileage: "",
};

function validateForm(form) {
  const errors = {};
  if (!form.make.trim()) errors.make = "Make is required.";
  if (!form.model.trim()) errors.model = "Model is required.";
  if (!form.registrationNumber.trim()) errors.registrationNumber = "Registration number is required.";
  const year = Number(form.year);
  if (!year || year < 1980 || year > CURRENT_YEAR + 1) {
    errors.year = `Enter a year between 1980 and ${CURRENT_YEAR + 1}.`;
  }
  if (form.mileage !== "" && Number(form.mileage) < 0) {
    errors.mileage = "Mileage can't be negative.";
  }
  return errors;
}

function ServiceHistoryItem({ service, onBillUploaded }) {
  const [expanded, setExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError("");
    setIsUploading(true);
    try {
      const { data } = await uploadServiceBill(service._id, file);
      onBillUploaded(data.service);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Could not upload the bill.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <li className="py-3 text-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <p className="font-medium text-slate-800">{service.serviceType}</p>
          <p className="text-slate-500">{formatDate(service.serviceDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={service.status} />
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 rounded-lg bg-slate-50 p-4">
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5" /> Service Center
              </p>
              <p className="mt-0.5 text-slate-700">{service.serviceCenter || "—"}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <Gauge className="h-3.5 w-3.5" /> Mileage
              </p>
              <p className="mt-0.5 text-slate-700">{service.mileageAtService?.toLocaleString() || 0} mi</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <DollarSign className="h-3.5 w-3.5" /> Cost
              </p>
              <p className="mt-0.5 text-slate-700">{formatCurrency(service.cost)}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <Wrench className="h-3.5 w-3.5" /> Parts Replaced
              </p>
              <p className="mt-0.5 text-slate-700">
                {service.partsReplaced?.length ? service.partsReplaced.map((p) => p.name).join(", ") : "—"}
              </p>
            </div>
          </div>

          {service.notes && (
            <div>
              <p className="text-xs text-slate-400">Notes</p>
              <p className="mt-0.5 text-slate-700">{service.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <FileText className="h-3.5 w-3.5" /> Service Bill
            </div>
            {service.billUrl ? (
              <a
                href={service.billUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
              >
                {service.billFileName || "View Bill"} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline">
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {isUploading ? "Uploading..." : "Upload Bill"}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  disabled={isUploading}
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          {uploadError && <p className="text-xs text-danger-600">{uploadError}</p>}
        </div>
      )}
    </li>
  );
}

export default function AddVehicle() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
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

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setFieldErrors((f) => ({ ...f, [field]: undefined }));
  };

  const handleBillUploaded = (updatedService) =>
    setServices((prev) => prev.map((s) => (s._id === updatedService._id ? updatedService : s)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validateForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields before saving.");
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
      <Topbar title={isEditing ? "Edit Vehicle" : "Add New Vehicle"} />

      <div className="flex-1 p-8">
        <Link to="/vehicles" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> Back to Vehicles
        </Link>

        {isLoading ? (
          <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="max-w-3xl space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">General Information</h2>

              <div className="mt-5 flex flex-col gap-6 sm:flex-row">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  <Car className="h-10 w-10 text-slate-300" />
                </div>

                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Make"
                    required
                    hint="e.g. Toyota"
                    value={form.make}
                    onChange={handleChange("make")}
                    error={fieldErrors.make}
                  />
                  <TextField
                    label="Model"
                    required
                    hint="e.g. Camry"
                    value={form.model}
                    onChange={handleChange("model")}
                    error={fieldErrors.model}
                  />
                  <TextField
                    label="Registration Number"
                    required
                    hint="e.g. BA 12 PA 3456"
                    value={form.registrationNumber}
                    onChange={handleChange("registrationNumber")}
                    error={fieldErrors.registrationNumber}
                  />
                  <TextField
                    label="VIN"
                    icon={Hash}
                    hint="Vehicle identification number"
                    value={form.vin}
                    onChange={handleChange("vin")}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TextField
                  label="Year"
                  type="number"
                  required
                  min={1980}
                  max={CURRENT_YEAR + 1}
                  value={form.year}
                  onChange={handleChange("year")}
                  error={fieldErrors.year}
                />
                <TextField
                  label="Color"
                  icon={Palette}
                  hint="e.g. Silver"
                  value={form.color}
                  onChange={handleChange("color")}
                />
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
                  min={0}
                  icon={Gauge}
                  hint="e.g. 42500"
                  value={form.mileage}
                  onChange={handleChange("mileage")}
                  error={fieldErrors.mileage}
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
                      <ServiceHistoryItem key={s._id} service={s} onBillUploaded={handleBillUploaded} />
                    ))}
                  </ul>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm text-danger-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

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
