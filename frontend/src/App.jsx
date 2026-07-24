import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth } from "./context/AuthContext";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import Services from "./pages/Services";
import AddService from "./pages/AddService";
import Reminders from "./pages/Reminders";
import AddReminder from "./pages/AddReminder";
import Settings from "./pages/Settings";

// Sends "/" and any unmatched path to Login if there's no active session,
// or Dashboard if there is — instead of always assuming Dashboard.
function RootRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-(--color-surface)">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/new" element={<AddVehicle />} />
          <Route path="/vehicles/:id" element={<AddVehicle />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/new" element={<AddService />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/reminders/new" element={<AddReminder />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
