const TONES = {
  primary: "bg-primary-50 text-primary-600",
  warning: "bg-warning-50 text-warning-600",
  success: "bg-success-50 text-success-600",
  slate: "bg-slate-100 text-slate-600",
};

const SOLID_TONES = {
  primary: "bg-gradient-to-br from-primary-600 to-primary-800",
  warning: "bg-gradient-to-br from-warning-500 to-warning-700",
  success: "bg-gradient-to-br from-success-500 to-success-700",
  slate: "bg-gradient-to-br from-slate-700 to-slate-900",
};

export default function StatCard({ icon: Icon, label, value, tone = "primary", highlight = false }) {
  if (highlight) {
    return (
      <div className={`rounded-xl p-5 text-white shadow-md ${SOLID_TONES[tone]}`}>
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <Icon className="h-4.5 w-4.5" />
          </span>
        </div>
        <p className="mt-4 text-2xl font-semibold">{value}</p>
        <p className="mt-0.5 text-sm text-white/80">{label}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONES[tone]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </div>
  );
}
