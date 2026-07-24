const VARIANTS = {
  primary: "bg-primary-600 text-white shadow-sm shadow-primary-600/30 hover:bg-primary-700 hover:shadow-md disabled:bg-primary-300 disabled:shadow-none",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  danger: "bg-danger-500 text-white shadow-sm shadow-danger-500/30 hover:bg-danger-700 hover:shadow-md",
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  isLoading = false,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={isLoading || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}
