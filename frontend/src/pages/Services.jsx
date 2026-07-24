import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Wrench, Trash2, ClipboardList } from "lucide-react";
import Topbar from "../components/Topbar";
import Button from "../components/Button";
import { fetchServices, deleteService as deleteServiceApi } from "../api/serviceApi";
import { formatDate, formatCurrency } from "../lib/format";

const SERVICE_TYPE_STYLE = {
  "Oil Change": "bg-amber-50 text-amber-700",
  "Brake Service": "bg-danger-50 text-danger-700",
  "Tire Rotation": "bg-sky-50 text-sky-700",
  "Battery Replacement": "bg-violet-50 text-violet-700",
  "AC Service": "bg-cyan-50 text-cyan-700",
  "Engine Repair": "bg-rose-50 text-rose-700",
  "Wheel Alignment": "bg-indigo-50 text-indigo-700",
  "General Checkup": "bg-success-50 text-success-700",
};
const DEFAULT_SERVICE_TYPE_STYLE = "bg-slate-100 text-slate-600";

export default function Services() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchServices()
      .then(({ data }) => setServices(data.services))
      .catch(() => setError("Could not load service records right now."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service record?")) return;
    await deleteServiceApi(id);
    setServices((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <>
      <Topbar
        title="Services"
        actions={
          <Link to="/services/new">
            <Button>
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-8">
        {error && <p className="mb-5 text-sm text-danger-700">{error}</p>}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <ClipboardList className="h-4 w-4" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Service Records</h2>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">No service records yet</p>
              <p className="mt-1 text-sm text-slate-400">Log a service to start building your history.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="px-6 py-3 font-medium">Vehicle</th>
                  <th className="px-6 py-3 font-medium">Service Type</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Cost</th>
                  <th className="px-6 py-3 font-medium">Provider</th>
                  <th className="px-6 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => {
                  const typeStyle = SERVICE_TYPE_STYLE[s.serviceType] || DEFAULT_SERVICE_TYPE_STYLE;
                  return (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5 font-medium text-slate-800">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${typeStyle}`}>
                          <Wrench className="h-3.5 w-3.5" />
                        </span>
                        {s.vehicle ? `${s.vehicle.make} ${s.vehicle.model}` : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${typeStyle}`}>{s.serviceType}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(s.serviceDate)}</td>
                    <td className="px-6 py-4 font-medium text-success-700">{formatCurrency(s.cost)}</td>
                    <td className="px-6 py-4 text-slate-500">{s.serviceCenter || "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-slate-400 hover:text-danger-700"
                        title="Delete service record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
