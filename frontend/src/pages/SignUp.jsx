import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import TextField from "../components/TextField";
import Button from "../components/Button";
import SocialAuthButtons from "../components/SocialAuthButtons";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Track services, set reminders, and never miss a maintenance window across your entire fleet.">
      <h1 className="text-2xl font-semibold text-slate-900">Create Account</h1>
      <p className="mt-1 text-sm text-slate-500">Sign up to start managing your vehicles.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          label="Full Name"
          required
          placeholder="John Doe"
          value={form.fullName}
          onChange={handleChange("fullName")}
        />
        <TextField
          label="Email Address"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange("email")}
        />
        <TextField
          label="Phone Number"
          type="tel"
          placeholder="+977 98XXXXXXXX"
          value={form.phone}
          onChange={handleChange("phone")}
        />
        <TextField
          label="Password"
          type="password"
          required
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange("password")}
          error={error}
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Continue
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <SocialAuthButtons />

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
