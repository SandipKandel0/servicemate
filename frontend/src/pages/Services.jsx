import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Wrench, Trash2 } from "lucide-react";
import Topbar from "../components/Topbar";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { fetchServices, deleteService as deleteServiceApi } from "../api/serviceApi";
import { formatDate, formatCurrency } from "../lib/format";

const STATUS_FILTERS = ["All", "Scheduled", "In Progress", "Completed", "Overdue"];

export default function Services() {
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchServices(statusFilter === "All" ? {} : { status: statusFilter })
      .then(({ data }) => setServices(data.services))
      .catch(() => setError("Could not load service records right now."))
      .finally(() => setIsLoading(false));
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service record?")) return;
    await deleteServiceApi(id);
    setServices((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <>
      <Topbar
        title="Services"
        subtitle="Track service history across your fleet."
        actions={
          <Link to="/services/new">
            <Button>
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-8">
        <div className="mb-5 flex gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                statusFilter === status
                  ? "bg-primary-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-danger-700">{error}</p>}

        <div className="rounded-xl border border-slate-200 bg-white">
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
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {s.vehicle ? `${s.vehicle.make} ${s.vehicle.model}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{s.serviceType}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(s.serviceDate)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatCurrency(s.cost)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.status} />
                    </td>
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
