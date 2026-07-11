import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { forgotPassword } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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

        {!isSent ? (
          <>
            <h1 className="mt-5 text-center text-xl font-semibold text-slate-900">Forgot Password?</h1>
            <p className="mt-1.5 text-center text-sm text-slate-500">
              Enter the email associated with your account and we'll send you reset instructions.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <TextField
                label="Email Address"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />
              <Button type="submit" isLoading={isLoading} className="w-full">
                Send Reset Instructions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="mt-5 flex justify-center">
              <CheckCircle2 className="h-10 w-10 text-success-500" />
            </div>
            <h1 className="mt-3 text-center text-xl font-semibold text-slate-900">Check your inbox</h1>
            <p className="mt-1.5 text-center text-sm text-slate-500">
              If an account exists for {email}, a password reset link is on its way.
            </p>
          </>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            ← Back to Login
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-slate-400">
          Having trouble? <span className="font-medium text-slate-500">Contact Support</span>
        </p>
      </div>
    </div>
  );
}
