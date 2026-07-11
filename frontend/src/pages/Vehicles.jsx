import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Car, Gauge, Trash2, Pencil } from "lucide-react";
import Topbar from "../components/Topbar";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { fetchVehicles, deleteVehicle as deleteVehicleApi } from "../api/vehicleApi";

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
        subtitle="Manage every vehicle in your fleet."
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
            {filtered.map((v) => (
              <div key={v._id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                    <Car className="h-6 w-6 text-primary-600" />
                  </div>
                  <StatusBadge status={v.status} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {v.year} {v.make} {v.model}
                </h3>
                <p className="text-sm text-slate-500">{v.registrationNumber}</p>

                <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                  <Gauge className="h-4 w-4" />
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
            ))}
          </div>
        )}
      </div>
    </>
  );
}
