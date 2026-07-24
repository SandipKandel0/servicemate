import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BellRing, Check, X, Car, Droplet, ShieldCheck, ClipboardCheck, Disc, BatteryCharging } from "lucide-react";
import Topbar from "../components/Topbar";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import { fetchReminders, updateReminder, deleteReminder } from "../api/reminderApi";
import { formatDate, daysUntil } from "../lib/format";

const PRIORITY_BAR = {
  High: "border-l-danger-500",
  Medium: "border-l-warning-500",
  Low: "border-l-slate-300",
};

const PRIORITY_BADGE = {
  High: "bg-danger-50 text-danger-600",
  Medium: "bg-warning-50 text-warning-600",
  Low: "bg-slate-100 text-slate-500",
};

const CATEGORY_STYLE = {
  "Oil Change": { icon: Droplet, style: "bg-amber-50 text-amber-600" },
  Insurance: { icon: ShieldCheck, style: "bg-violet-50 text-violet-600" },
  Inspection: { icon: ClipboardCheck, style: "bg-sky-50 text-sky-600" },
  "Tire Rotation": { icon: Disc, style: "bg-indigo-50 text-indigo-600" },
  "Battery Check": { icon: BatteryCharging, style: "bg-rose-50 text-rose-600" },
  Other: { icon: BellRing, style: "bg-slate-100 text-slate-500" },
};

function urgencyBadge(dueDate) {
  const days = daysUntil(dueDate);
  if (days < 0) return { text: `Overdue ${Math.abs(days)}d`, style: "bg-danger-50 text-danger-700" };
  if (days === 0) return { text: "Due today", style: "bg-danger-50 text-danger-700" };
  if (days <= 7) return { text: `${days}d left`, style: "bg-warning-50 text-warning-700" };
  return { text: `${days}d left`, style: "bg-slate-100 text-slate-500" };
}

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    fetchReminders({ status: "Pending" })
      .then(({ data }) => setReminders(data.reminders))
      .catch(() => setError("Could not load your reminders right now."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleComplete = async (id) => {
    await updateReminder(id, { status: "Completed" });
    setReminders((prev) => prev.filter((r) => r._id !== id));
  };

  const handleDismiss = async (id) => {
    await deleteReminder(id);
    setReminders((prev) => prev.filter((r) => r._id !== id));
  };

  const dueThisWeek = reminders.filter((r) => {
    const d = daysUntil(r.dueDate);
    return d !== null && d <= 7 && d >= 0;
  }).length;
  const overdue = reminders.filter((r) => daysUntil(r.dueDate) < 0).length;

  return (
    <>
      <Topbar
        title="Reminders"
        actions={
          <Link to="/reminders/new">
            <Button>
              <Plus className="h-4 w-4" /> New Reminder
            </Button>
          </Link>
        }
      />

      <div className="flex-1 space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={BellRing} label="Total Active" value={reminders.length} tone="primary" />
          <StatCard icon={BellRing} label="Due This Week" value={dueThisWeek} tone="warning" />
          <StatCard icon={BellRing} label="Overdue" value={overdue} tone={overdue > 0 ? "warning" : "slate"} />
        </div>

        {error && <p className="text-sm text-danger-700">{error}</p>}

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : reminders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BellRing className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">No active reminders</p>
            <p className="mt-1 text-sm text-slate-400">You're all caught up — create one to stay ahead.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => {
              const category = CATEGORY_STYLE[r.category] || CATEGORY_STYLE.Other;
              const CategoryIcon = category.icon;
              return (
              <div
                key={r._id}
                className={`flex items-center justify-between rounded-xl border border-l-4 border-slate-200 bg-white p-4 ${PRIORITY_BAR[r.priority]}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.style}`}>
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">{r.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_BADGE[r.priority] || PRIORITY_BADGE.Low}`}>
                        {r.priority}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-500">
                      <Car className="h-3.5 w-3.5" />
                      {r.vehicle ? `${r.vehicle.make} ${r.vehicle.model}` : "—"}
                      <span className="text-slate-300">•</span>
                      Due {formatDate(r.dueDate)}
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${urgencyBadge(r.dueDate).style}`}>
                        {urgencyBadge(r.dueDate).text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleComplete(r._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-success-200 hover:bg-success-50 hover:text-success-700"
                    title="Mark as completed"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDismiss(r._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-danger-200 hover:bg-danger-50 hover:text-danger-700"
                    title="Dismiss reminder"
                  >
                    <X className="h-4 w-4" />
                  </button>
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
