import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Car, Gauge, Trash2, Pencil } from "lucide-react";
import Topbar from "../components/Topbar";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { fetchVehicles, deleteVehicle as deleteVehicleApi } from "../api/vehicleApi";

const STATUS_ACCENT = {
  Good: "border-t-4 border-t-success-500",
  "Needs Attention": "border-t-4 border-t-warning-500",
  "In Service": "border-t-4 border-t-primary-500",
};

const FUEL_STYLE = {
  Petrol: { gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-600/30", chip: "bg-amber-50 text-amber-700" },
  Diesel: { gradient: "from-slate-500 to-slate-700", shadow: "shadow-slate-600/30", chip: "bg-slate-100 text-slate-600" },
  Electric: { gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-600/30", chip: "bg-emerald-50 text-emerald-700" },
  Hybrid: { gradient: "from-teal-500 to-cyan-600", shadow: "shadow-teal-600/30", chip: "bg-teal-50 text-teal-700" },
  CNG: { gradient: "from-sky-500 to-blue-600", shadow: "shadow-sky-600/30", chip: "bg-sky-50 text-sky-700" },
};
const DEFAULT_FUEL_STYLE = { gradient: "from-primary-500 to-primary-700", shadow: "shadow-primary-600/30", chip: "bg-primary-50 text-primary-700" };

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const loadVehicles = () => {
    setIsLoading(true);
    fetchVehicles()
      .then(({ data }) => setVehicles(data.vehicles))
      .catch(() => setError("Could not load your vehicles right now."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this vehicle and all of its service history?")) return;
    await deleteVehicleApi(id);
    setVehicles((prev) => prev.filter((v) => v._id !== id));
  };

  const filtered = vehicles.filter((v) => {
    const haystack = `${v.make} ${v.model} ${v.registrationNumber}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <>
      <Topbar
        title="Vehicles"
        actions={
          <Link to="/vehicles/new">
            <Button>
              <Plus className="h-4 w-4" /> Add Vehicle
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-8">
        <div className="relative mb-5 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by make, model, or plate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {error && <p className="text-sm text-danger-700">{error}</p>}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Car className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">No vehicles yet</p>
            <p className="mt-1 text-sm text-slate-400">Add your first vehicle to start tracking services.</p>
            <Link to="/vehicles/new" className="mt-4 inline-block">
              <Button>
                <Plus className="h-4 w-4" /> Add Vehicle
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => {
              const fuelStyle = FUEL_STYLE[v.fuelType] || DEFAULT_FUEL_STYLE;
              return (
              <div
                key={v._id}
                className={`overflow-hidden rounded-xl border border-slate-200 bg-white ${STATUS_ACCENT[v.status] || STATUS_ACCENT.Good}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${fuelStyle.gradient} shadow-sm ${fuelStyle.shadow}`}>
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <StatusBadge status={v.status} />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {v.year} {v.make} {v.model}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm text-slate-500">{v.registrationNumber}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${fuelStyle.chip}`}>{v.fuelType}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                      <Gauge className="h-3.5 w-3.5" />
                    </span>
                    {v.mileage?.toLocaleString() || 0} mi
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <Link to={`/vehicles/${v._id}`} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-danger-200 hover:bg-danger-50 hover:text-danger-700"
                      title="Delete vehicle"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
