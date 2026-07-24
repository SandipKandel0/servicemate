import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  hint,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-danger-500"> *</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-100 ${
            Icon ? "pl-10" : "px-3.5"
          } ${Icon && isPassword ? "pr-10" : Icon ? "pr-3.5" : ""} ${isPassword && !Icon ? "pr-10 pl-3.5" : ""} ${
            error ? "border-danger-500" : "border-slate-200 focus:border-primary-500"
          }`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-danger-500">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}
