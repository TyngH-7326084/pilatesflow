# PilatesFlow

A booking application for a Pilates studio. Guests browse the class schedule
without an account; members sign up, log in, book classes, and cancel
bookings; admins create classes.

## Architecture summary

- **Client:** React (Vite), calls the API over HTTPS/JSON.
- **Server:** Node.js + Express REST API.
- **Database:** MongoDB (Atlas), accessed via Mongoose.
- **Auth:** JWT issued on signup/login, passwords hashed with bcrypt, role
  stored on the user document (`admin` | `member`).

```
client/   React app (Vite)
server/   Express API
  src/config      DB connection
  src/models      Mongoose schemas
  src/controllers Route handlers / business logic
  src/routes      Express routers
  src/middleware  Error handling, async wrapper
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
3. Run the API: `cd server && npm run dev` (default port 5000)
4. Run the client: `cd client && npm run dev` (default port 5173)

## Deployment

- **Public URL:** _TBD — add EC2 public IP or domain once deployed_
- **Deployment type:** Manual (CI/CD is out of scope for this assignment)
- **Deployment steps:** see `DEPLOYMENT.md`

## Known limitations (Phase 1)

- Admin cannot edit or cancel an existing class (out of scope this phase)
- No automated tests
- No password reset flow
- Notifications limited to in-app success/error messages
- Single studio, single timezone (Brisbane) assumed

## GenAI disclosure

See Section 6 of the project report for the GenAI evidence log and reflection.
