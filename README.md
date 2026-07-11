# ServiceMate

A vehicle service management platform — track vehicles, log service history, set maintenance reminders, and monitor fleet health from one dashboard.

**Stack:** React (Vite) · Node.js + Express · MongoDB · JWT auth (access + refresh tokens)

## Project structure

```
servicemate/
├── backend/     Express API + MongoDB models
└── frontend/    React app (Vite + Tailwind CSS v4)
```

## Pages included

Sign Up, Login, Forgot Password, Reset Password, Dashboard, Vehicles, Add/Edit Vehicle,
Services, Add Service, Reminders, Add Reminder, Settings.

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/servicemate
JWT_ACCESS_SECRET=replace_with_a_long_random_string
JWT_REFRESH_SECRET=replace_with_a_different_long_random_string
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:5173
```

Make sure MongoDB is running locally (or point `MONGO_URI` at a MongoDB Atlas cluster), then start the API:

```bash
npm run dev      # nodemon, restarts on file changes
# or
npm start
```

The API runs on `http://localhost:5000` and exposes a health check at `GET /api/health`.

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`. The Vite dev server proxies any request to `/api/*` through to the backend on port 5000 (see `vite.config.js`), so the two run side by side with no extra CORS configuration needed in development.

## 3. Try it out

1. Visit `http://localhost:5173/signup` and create an account.
2. You'll land on the Dashboard — add a vehicle first (`Vehicles → Add Vehicle`), then log a service or set a reminder against it.
3. `Settings` lets you update your profile and notification preferences.

## API overview

| Resource   | Routes |
|------------|--------|
| Auth       | `POST /api/auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password/:token`, `GET /me`, `PUT /me`, `PUT /notification-settings` |
| Vehicles   | `GET/POST /api/vehicles`, `GET/PUT/DELETE /api/vehicles/:id` |
| Services   | `GET/POST /api/services`, `GET/PUT/DELETE /api/services/:id` |
| Reminders  | `GET/POST /api/reminders`, `PUT/DELETE /api/reminders/:id` |
| Dashboard  | `GET /api/dashboard` — aggregated stats, fleet health, recent services, upcoming reminders |

All routes except `register`, `login`, `refresh`, and `forgot/reset-password` require an `Authorization: Bearer <accessToken>` header. The frontend's axios client (`src/api/axiosClient.js`) handles this automatically, including silently refreshing an expired access token using the refresh token.

## Notes & next steps

- **Password reset emails:** `forgotPassword` currently logs the reset link to the backend console instead of sending an email — wire up a provider like Nodemailer/SendGrid in `controllers/authController.js` when you're ready.
- **Vehicle photos:** the "upload" box on Add Vehicle is currently a decorative placeholder. Add an image upload endpoint (e.g. to S3/Cloudinary) and wire the `image` field on the `Vehicle` model to it.
- **Social login buttons** on Sign Up/Login are visual only — they're not wired to real OAuth providers.
- **Fleet health score** on the dashboard is a simple heuristic based on vehicle status (`Good` / `Needs Attention` / `In Service`). Swap in your own scoring logic in `dashboardController.js` if you want it based on mileage, days since last service, etc.
