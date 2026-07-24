import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-(--color-surface)">
      <Sidebar />
      <div className="relative isolate flex flex-1 flex-col overflow-y-auto bg-gradient-to-br from-sky-300 via-white to-blue-300 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-112 w-md rounded-full bg-sky-600 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-blue-600 blur-3xl dark:bg-blue-500/10" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
