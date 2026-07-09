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

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
