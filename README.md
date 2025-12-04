## Healthcare Wellness & Preventive Care Portal (MVP)

A simple full-stack web app for **patients** and **providers** to manage wellness goals and preventive-care reminders.

- **Patients** can sign up, log in, track daily goals (steps, water, sleep), manage profile info (allergies, medications), and mark preventive reminders as complete.
- **Providers** can log in, see a list of **assigned patients** and each patient’s basic **compliance status** and details.

Built as a 5-hour hackathon-style MVP with **React (Vite)**, **Node.js + Express**, **MongoDB (Atlas)**, **JWT auth**, and **bcrypt**.

---

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios
- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs, CORS, morgan
- **Database**: MongoDB (local or Atlas)
- **Auth**: JWT (Bearer tokens), password hashing with bcrypt

---

## Project Structure

- `server/` – Express API (auth, patient, provider, goals, reminders)
- `client/` – React SPA (landing, auth, dashboards, profile, settings)

---

## Getting Started (Local)

### 1. Prerequisites

- Node.js 20+
- MongoDB:
  - Either a **local MongoDB** instance  
  - Or a **MongoDB Atlas** cluster and connection string

---

### 2. Backend Setup (`server/`)

```bash
cd server
npm install
```

Create `server/.env`:

```bash
MONGO_URI="mongodb://127.0.0.1:27017/wellness_portal"   # or your Atlas URI
JWT_SECRET="change_this_in_production"
PORT=5000
CLIENT_ORIGIN="http://localhost:5173"
```

> If using MongoDB Atlas, replace `MONGO_URI` with your connection string, e.g.  
> `mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/wellnessdb?retryWrites=true&w=majority&appName=Cluster0`

#### (Optional) Seed demo data

Creates:
- 1 **provider**: `provider@example.com` / `Provider123!`
- 1 **patient**: `patient@example.com` / `Patient123!` assigned to that provider.

```bash
cd server
npm run seed
```

#### Run backend

```bash
cd server
npm run dev
```

Server starts on `http://localhost:5000` and logs:

```text
Connected to MongoDB
Server listening on port 5000
```

Health check:

- `GET http://localhost:5000/` → `{ status: "ok", message: "Wellness & Preventive Care API" }`

---

### 3. Frontend Setup (`client/`)

```bash
cd client
npm install
```

Create `client/.env`:

```bash
VITE_API_BASE_URL="http://localhost:5000/api"
```

Run dev server:

```bash
cd client
npm run dev
```

Open the app at the URL Vite prints (typically `http://localhost:5173`).

---

## Core Flows

### Authentication

- **Register** (`/register`)
  - Choose role: **patient** or **provider**
  - **Consent checkbox** is required (simple consent to process wellness data)
  - On success, frontend stores JWT in memory + `localStorage` and routes based on role.

- **Login** (`/login`)
  - Uses email + password
  - On success, JWT is stored and used as a **Bearer** token on all API calls.

### Patient Experience

- **Dashboard** (`/dashboard/patient`)
  - Shows daily **goals**:
    - Default: `steps`, `water`, `sleep` with targets and units
    - Allows quick **“log today’s progress”** per goal.
  - Shows **preventive reminders**:
    - Example: “Annual Wellness Check”
    - Patients can **mark reminders completed**.

- **Profile** (`/profile`)
  - Fields:
    - Name
    - Email (read-only)
    - Allergies
    - Current medications
  - Patients can **edit** name, allergies, and medications.

- **Settings** (`/settings`)
  - Shows basic account info and **Logout**.

### Provider Experience

- **Dashboard** (`/dashboard/provider`)
  - Sees **assigned patients** with a simple status:
    - `On Track`
    - `No Recent Activity`
    - `Missed Preventive Checkup` (if any overdue, incomplete reminder)
  - Clicking a patient shows:
    - Name, email, allergies, medications
    - Summary of goals and number of logs
    - List of preventive reminders with status

---

## REST API (Summary)

Base URL (local): `http://localhost:5000/api`

### Auth

- **POST** `/auth/register`
  - Body:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "Password123!",
      "role": "patient",          // "patient" | "provider"
      "consentGiven": true,
      "allergies": "Peanuts",     // optional (patient)
      "medications": "Vitamin D"  // optional (patient)
    }
    ```
  - Response:
    ```json
    {
      "token": "JWT_TOKEN",
      "user": {
        "id": "...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "patient"
      }
    }
    ```

- **POST** `/auth/login`
  - Body:
    ```json
    {
      "email": "jane@example.com",
      "password": "Password123!"
    }
    ```
  - Response: Same shape as `/auth/register`.

- **GET** `/auth/me`
  - Headers: `Authorization: Bearer <JWT>`
  - Returns basic user info.

### Patient APIs (require patient JWT)

- **GET** `/patient/profile`
- **PUT** `/patient/profile`
  - Body:
    ```json
    {
      "name": "Updated Name",
      "allergies": "Shellfish",
      "medications": "New med"
    }
    ```

- **GET** `/patient/dashboard`
  - Returns:
    ```json
    {
      "goals": [ ... ],
      "reminders": [ ... ]
    }
    ```

- **POST** `/patient/goals/:goalId/log`
  - Body:
    ```json
    {
      "value": 8000
    }
    ```

- **POST** `/patient/reminders/:reminderId/complete`

### Provider APIs (require provider JWT)

- **GET** `/provider/patients`
  - Returns:
    ```json
    {
      "patients": [
        {
          "id": "...",
          "name": "Demo Patient",
          "email": "patient@example.com",
          "status": "On Track" | "No Recent Activity" | "Missed Preventive Checkup"
        }
      ]
    }
    ```

- **GET** `/provider/patients/:patientId`
  - Returns full patient snapshot: profile, goals, reminders.

---

## Security Notes

- **Passwords**:
  - Hashed with **bcryptjs** (`passwordHash` stored; never raw password).
- **Auth**:
  - **JWT** issued on login/register; must be sent as `Authorization: Bearer <token>`.
  - Token includes `id` and `role`.
- **Role-based access**:
  - Patient routes guarded by `requireRole('patient')`
  - Provider routes guarded by `requireRole('provider')`
- **CORS**:
  - Only allows the configured `CLIENT_ORIGIN` (e.g. frontend origin).
- **Environment variables**:
  - Secrets (`JWT_SECRET`, DB credentials) live only in `.env` files / platform env config, **not** in source.
- **HTTPS**:
  - Use HTTPS in production via your hosting provider (Vercel/Render/Heroku/AWS).

---

## Deployment Overview

### Option 1 – Separate frontend & backend

- **Backend** (Render / Heroku / AWS / etc.):
  - Deploy `server/` as a Node app.
  - Set environment variables:
    - `MONGO_URI` (Atlas URL)
    - `JWT_SECRET`
    - `PORT` (usually provided by platform)
    - `CLIENT_ORIGIN` (your frontend URL, e.g. `https://your-frontend.app`)

- **Frontend** (Vercel / Netlify / etc.):
  - Deploy `client/` as a Vite React app.
  - Set environment variable:
    - `VITE_API_BASE_URL` → your deployed backend API base, e.g. `https://your-api.app/api`

### Option 2 – All-in-one (for hackathons)

- Keep the separation but host both on free tiers:
  - e.g. **Render** for the backend and **Vercel** for the frontend.
  - Ensure CORS `CLIENT_ORIGIN` aligns with the actual frontend URL.

---

## Testing the API

Use **Postman**, **Thunder Client**, or curl:

1. Register a new user via `POST /api/auth/register`.
2. Copy the `token` from the response.
3. Call a protected endpoint, e.g.:

```bash
curl http://localhost:5000/api/patient/dashboard \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Notes / Possible Extensions

Nice-to-have features not fully built out (but easy to add next):

- Basic password reset flow (email-based or security-token based).
!- CI pipeline (GitHub Actions) to run lint/tests on push.
- More detailed logging/audit trail for key user actions.
- More granular goal/reminder configuration per patient.



