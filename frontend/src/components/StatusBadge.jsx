const STYLES = {
  Completed: "bg-success-50 text-success-700",
  Good: "bg-success-50 text-success-700",
  Scheduled: "bg-primary-50 text-primary-700",
  "In Progress": "bg-primary-50 text-primary-700",
  "In Service": "bg-primary-50 text-primary-700",
  "Needs Attention": "bg-warning-50 text-warning-700",
  Pending: "bg-warning-50 text-warning-700",
  Overdue: "bg-danger-50 text-danger-700",
  Dismissed: "bg-slate-100 text-slate-500",
  High: "bg-danger-50 text-danger-700",
  Medium: "bg-warning-50 text-warning-700",
  Low: "bg-slate-100 text-slate-600",
};

const DOT_STYLES = {
  Completed: "bg-success-500",
  Good: "bg-success-500",
  Scheduled: "bg-primary-500",
  "In Progress": "bg-primary-500",
  "In Service": "bg-primary-500",
  "Needs Attention": "bg-warning-500",
  Pending: "bg-warning-500",
  Overdue: "bg-danger-500",
  Dismissed: "bg-slate-400",
  High: "bg-danger-500",
  Medium: "bg-warning-500",
  Low: "bg-slate-400",
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-slate-100 text-slate-600";
  const dot = DOT_STYLES[status] || "bg-slate-400";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
