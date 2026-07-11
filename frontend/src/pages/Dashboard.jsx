import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, CalendarClock, TriangleAlert, CheckCircle2, Plus } from "lucide-react";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import { fetchDashboard } from "../api/dashboardApi";
import { formatDate } from "../lib/format";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard()
      .then(({ data }) => setData(data))
      .catch(() => setError("Could not load your dashboard right now."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Here's what's happening across your fleet."
        actions={
          <Link to="/vehicles/new">
            <Button>
              <Plus className="h-4 w-4" /> Add Vehicle
            </Button>
          </Link>
        }
      />

      <div className="flex-1 space-y-6 p-8">
        {error && <p className="text-sm text-danger-700">{error}</p>}

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          data && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Car} label="Total Vehicles" value={data.stats.totalVehicles} tone="primary" />
                <StatCard icon={CalendarClock} label="Scheduled Services" value={data.stats.scheduledServices} tone="slate" />
                <StatCard icon={TriangleAlert} label="Needs Attention" value={data.stats.needsAttention} tone="warning" />
                <StatCard icon={CheckCircle2} label="Completed Services" value={data.stats.completedServices} tone="success" />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
                  <h2 className="text-base font-semibold text-slate-900">Fleet Health Overview</h2>
                  {data.fleetHealth.length === 0 ? (
                    <EmptyState text="Add a vehicle to see its health here." />
                  ) : (
                    <div className="mt-5 space-y-4">
                      {data.fleetHealth.map((v) => (
                        <div key={v.id}>
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">{v.label}</span>
                            <span className="text-slate-500">{v.healthScore}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                v.healthScore >= 80 ? "bg-success-500" : v.healthScore >= 60 ? "bg-warning-500" : "bg-danger-500"
                              }`}
                              style={{ width: `${v.healthScore}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-base font-semibold text-slate-900">Needs Attention</h2>
                  {data.needsAttention.length === 0 ? (
                    <EmptyState text="Nothing urgent — you're all caught up." />
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {data.needsAttention.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 rounded-lg bg-warning-50 p-3">
                          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.subtitle}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">Recent Services</h2>
                  <Link to="/services" className="text-sm font-medium text-primary-600 hover:underline">
                    View All Activities
                  </Link>
                </div>

                {data.recentServices.length === 0 ? (
                  <EmptyState text="Service records you log will show up here." />
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-xs uppercase text-slate-400">
                          <th className="pb-3 font-medium">Vehicle</th>
                          <th className="pb-3 font-medium">Service Type</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.recentServices.map((s) => (
                          <tr key={s._id}>
                            <td className="py-3 font-medium text-slate-800">
                              {s.vehicle ? `${s.vehicle.make} ${s.vehicle.model}` : "—"}
                            </td>
                            <td className="py-3 text-slate-600">{s.serviceType}</td>
                            <td className="py-3 text-slate-500">{formatDate(s.serviceDate)}</td>
                            <td className="py-3">
                              <StatusBadge status={s.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </div>
    </>
  );
}

function EmptyState({ text }) {
  return <p className="mt-4 text-sm text-slate-400">{text}</p>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}
