import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { resetPassword } from "../api/authApi";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, password);
      setIsDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "This reset link is invalid or has expired");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-surface) px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
        </div>

        {!isDone ? (
          <>
            <h1 className="mt-5 text-center text-xl font-semibold text-slate-900">Set a new password</h1>
            <p className="mt-1.5 text-center text-sm text-slate-500">
              Choose a strong password you haven't used before.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <TextField
                label="New Password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirm Password"
                type="password"
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={error}
              />
              <Button type="submit" isLoading={isLoading} className="w-full">
                Reset Password
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="mt-5 flex justify-center">
              <CheckCircle2 className="h-10 w-10 text-success-500" />
            </div>
            <h1 className="mt-3 text-center text-xl font-semibold text-slate-900">Password updated</h1>
            <p className="mt-1.5 text-center text-sm text-slate-500">Redirecting you to login…</p>
          </>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
