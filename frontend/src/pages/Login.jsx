import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import TextField from "../components/TextField";
import Button from "../components/Button";
import SocialAuthButtons from "../components/SocialAuthButtons";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Welcome back — your fleet's service history and upcoming reminders are right where you left them.">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome Back</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in to continue to ServiceMate.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          label="Email Address"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange("email")}
        />
        <div>
          <TextField
            label="Password"
            type="password"
            required
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange("password")}
            error={error}
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Sign in to ServiceMate
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <SocialAuthButtons />

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/signup" className="font-medium text-primary-600 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
