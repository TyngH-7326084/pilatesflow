# PilatesFlow

A booking application for a Pilates studio. Guests browse the class schedule
without an account; members sign up, log in, book classes, and cancel
bookings; admins create classes.

## Architecture summary

- **Client:** React (Vite), calls the API over HTTPS/JSON.
- **Server:** Node.js + Express REST API, serving the built client as static
  files in production (single-port deployment).
- **Database:** MongoDB (Atlas), accessed via Mongoose.
- **Auth:** JWT issued on signup/login, passwords hashed with bcrypt, role
  stored on the user document (`admin` | `member`).

```
client/   React app (Vite)
server/   Express API
  src/pages Schedule, MyBookings, SignupLogin, AdminDashboard
  rc/components Navbar
  server/ Express API
  src/config DB connection
  src/models Mongoose schemas (User, Class, Booking)
  rc/controllers Route handlers / business logic
  src/routes Express routers
  src/middleware Auth, error handling, async wrapper
```

## Setup (local development)

1. Clone the repo and install dependencies:
   ```
   cd server && npm install
   cd ../client && npm install
   ```
2. Copy `server/.env.example` to `server/.env` and fill in:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — any long random string
3. Run the API: `cd server && npm run dev` (default port 3000)
4. Run the client: `cd client && npm run dev` (default port 5173)

## Deployment

- **Public URL:** 'http://32.236.237.225:3000' Note: this IP may change if the instance restarts
- **Deployment type:** Manual (CI/CD is out of scope for this assignment)

## Known limitations (Phase 1)

- Admin cannot edit or cancel an existing class (out of scope this phase)
- No automated tests
- No password reset flow
- Notifications limited to in-app success/error messages
- Single studio, single timezone (Brisbane) assumed
- No published/cancelled status on classes — the current schema does not
  model class state, so all created classes are treated as visible/active
- Booking capacity check is sequential (check-then-book), not atomic —
  assumes bookings are not submitted simultaneously by multiple members for
  the same class (see decision log entry on 24 Aug)
