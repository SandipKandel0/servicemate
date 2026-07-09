export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  ...rest
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-danger-500"> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-100 ${
          error ? "border-danger-500" : "border-slate-200 focus:border-primary-500"
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
    </div>
  );
}
