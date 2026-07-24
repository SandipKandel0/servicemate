import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Wrench,
  BellRing,
  Settings,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vehicles", label: "Vehicles", icon: Car },
  { to: "/services", label: "Services", icon: Wrench },
  { to: "/reminders", label: "Reminders", icon: BellRing },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useTheme();

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-gradient-to-b from-teal-700 via-cyan-700 to-slate-800 shadow-xl">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/20 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur shadow-sm">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>

        <span className="text-lg font-bold text-white">
          ServiceMate
        </span>
      </div>


      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white shadow-md backdrop-blur"
                  : "text-cyan-50 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                )}

                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>


      {/* User profile */}
      <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 backdrop-blur">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{user?.fullName || "User"}</p>
          <p className="truncate text-xs text-cyan-100/80">{user?.email}</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-1 border-t border-white/20 px-3 py-4">

        <button
          onClick={toggleMode}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cyan-50 transition-all hover:bg-white/10 hover:text-white"
        >
          {mode === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}

          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </button>


        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cyan-50 transition-all hover:bg-red-500/20 hover:text-red-200"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>

      </div>

    </aside>
  );
}