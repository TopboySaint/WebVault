# WebVault

Modern full‑stack demo of a simple digital banking platform (account creation, JWT auth, balance viewing, peer transfers, notifications, and investment marketing pages).

## Features
- User signup with hashed passwords (bcrypt) and unique 10‑digit account numbers ([server/index.js](server/index.js))
- JWT based signin (10 min expiry) and protected dashboard (client guarded via [`ProtectedRoute`](client/src/components/ProtectedRoute.jsx))
- Funds transfer between accounts with balance mutation and dual notification entries
- Notification feed (credit / debit tagging)
- Welcome email dispatch via Nodemailer + Gmail template ([server/emailTemplates/welcomeMail.js](server/emailTemplates/welcomeMail.js))
- Responsive React UI (Tailwind via CDN) with public marketing pages (About, Services, Investments, Contact)
- Route guards for auth / public access ([`PublicRoute`](client/src/components/PublicRoute.jsx))
- Simple investment plan showcase (static)

## Tech Stack
- Frontend: React 19, React Router 7, Formik + Yup, Axios, Vite
- Backend: Express 5, Mongoose 8, bcrypt, jsonwebtoken, Nodemailer, dotenv, CORS
- Database: MongoDB (Atlas)
- Auth: JWT (stored in localStorage)
- Styling: TailwindCSS

## Monorepo Structure
```
client/        React SPA
server/        Express API + Mongo models + mail template
```

## API Overview (REST)
Base URL (dev): http://localhost:8080  
Deployed (used by client): https://webvault-9uhh.onrender.com

| Method | Endpoint | Body (JSON) | Description |
| ------ | -------- | ----------- | ----------- |
| POST | `/signup` | firstName,lastName,email,phone,password | Create user, send welcome email |
| POST | `/signin` | email,password | Issue JWT (10m expiry) |
| POST | `/transfer` | senderAccountNumber,recipientAccountNumber,amount | Move funds + notifications |
| GET | `/notifications/:accountNumber` | — | List notifications (array) |
| GET | `/user/:accountNumber` | — | Get user (sans password) |
| GET | `/` | — | Health/info |


## Local Development

```
### Run Backend
```
cd server
node index.js
```
### Run Frontend
```
cd client
npm run dev
``

## Future Improvements
- Pagination for notifications
- Transaction history endpoint
- KYC document upload & verification status
- Investment portfolio backend model
- Password reset & email verification
- Admin dashboard (metrics / user management)
- Unit & integration tests (Jest + Supertest)
