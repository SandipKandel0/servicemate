# ServiceMate — Frontend

React (Vite) + Tailwind CSS v4 single-page app for the ServiceMate platform. See the root [`README.md`](../README.md) for full setup instructions covering both the frontend and backend.

## Quick start

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api/*` to the backend at `http://localhost:5000` (configured in `vite.config.js`).

## Structure

```
src/
├── api/          axios client + one module per resource (auth, vehicles, services, reminders, dashboard)
├── components/   shared UI building blocks (Sidebar, Topbar, TextField, Button, StatusBadge, etc.)
├── context/      AuthContext — current user, login/register/logout
├── layouts/      DashboardLayout (sidebar + content) and AuthLayout (split auth screens)
├── lib/          formatting helpers (dates, currency)
└── pages/        one file per route (SignUp, Login, Dashboard, Vehicles, AddVehicle, ...)
```
