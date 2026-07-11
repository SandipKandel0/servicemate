import { useState } from "react";
import { User, ShieldCheck, BellRing, Save } from "lucide-react";
import Topbar from "../components/Topbar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Toggle from "../components/Toggle";
import { useAuth } from "../context/AuthContext";
import { updateProfile, updateNotificationSettings } from "../api/authApi";

export default function Settings() {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState({ fullName: user?.fullName || "", phone: user?.phone || "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [notifications, setNotifications] = useState(
    user?.notificationSettings || { pushNotifications: true, emailReminders: true }
  );
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage("");
    try {
      const { data } = await updateProfile(profile);
      setUser(data.user);
      setProfileMessage("Profile updated.");
    } catch {
      setProfileMessage("Could not update your profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleNotification = async (field, value) => {
    const next = { ...notifications, [field]: value };
    setNotifications(next);
    setIsSavingNotifications(true);
    try {
      const { data } = await updateNotificationSettings(next);
      setUser(data.user);
    } finally {
      setIsSavingNotifications(false);
    }
  };

  return (
    <>
      <Topbar title="Settings" subtitle="Manage your account, security, and notification preferences." />

      <div className="flex-1 space-y-6 p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">User Profile</h2>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-lg font-semibold text-white">
                {initials}
              </div>
              <div>
                <p className="font-medium text-slate-800">{user?.fullName}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <TextField
                label="Full Name"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              />
              <TextField
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              />
              {profileMessage && <p className="text-sm text-slate-500">{profileMessage}</p>}
              <Button type="submit" isLoading={isSavingProfile}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </form>
          </section>

          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Security</h2>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Reset your password using the same flow as the login page's "Forgot password" link.
              </p>
              <a href="/forgot-password" className="mt-4 inline-block">
                <Button variant="secondary">Send Password Reset Link</Button>
              </a>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <BellRing className="h-4.5 w-4.5 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Push Notifications</p>
                    <p className="text-xs text-slate-500">Get reminders sent straight to your device.</p>
                  </div>
                  <Toggle
                    checked={notifications.pushNotifications}
                    onChange={(v) => handleToggleNotification("pushNotifications", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Email Reminders</p>
                    <p className="text-xs text-slate-500">Receive a summary email for upcoming services.</p>
                  </div>
                  <Toggle
                    checked={notifications.emailReminders}
                    onChange={(v) => handleToggleNotification("emailReminders", v)}
                  />
                </div>
                {isSavingNotifications && <p className="text-xs text-slate-400">Saving…</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
