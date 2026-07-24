import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
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
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-slate-900">Welcome Back</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in to continue to ServiceMate.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          label="Email Address"
          type="email"
          required
          icon={Mail}
          value={form.email}
          onChange={handleChange("email")}
        />
        <div>
          <TextField
            label="Password"
            type="password"
            required
            icon={Lock}
            value={form.password}
            onChange={handleChange("password")}
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm text-danger-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

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
