# 📅 Schedulify — Modern Event Scheduling App

Schedulify is a full-stack Calendly clone built to simplify scheduling meetings and managing availability. It allows users to create custom event types, manage their weekly availability, and seamlessly connect with Google Calendar so bookings automatically generate Google Meet links without overlapping schedules.

---

## ✨ Features

* **Authentication & Profiles:** Quick user sign-in and profile setup managed via Clerk.
* **Custom Event Types:** Create public or private events with customizable titles, descriptions, durations, and URLs.
* **Dynamic Booking Pages:** Shareable user booking links for recruiters, clients, or team members to pick available slots.
* **Google Calendar Integration:** Automatically syncs booked events to your primary Google Calendar and generates live Google Meet invite links.
* **Availability Management:** Set custom daily working hours and time buffers to prevent back-to-back meeting fatigue.
* **Click & Booking Analytics:** Dashboard to view upcoming and past scheduled meetings.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router & Server Actions)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & [Shadcn UI](https://ui.shadcn.com/)
* **Database:** PostgreSQL (hosted on [Neon](https://neon.tech/))
* **ORM:** [Prisma](https://prisma.io/)
* **Authentication:** [Clerk](https://clerk.com/)
* **Integrations:** Google Calendar API (via Google Auth Platform)
* **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine:

### 1. Clone the repository
```bash
git clone [https://github.com/ishapawar0/schedulify.git](https://github.com/ishapawar0/schedulify.git)
cd schedulify
### 2. Install dependencies
```bash
npm install
3. Set up environment variables
Create a .env file in the root directory and add your credentials:

Code snippet
# Database
DATABASE_URL="postgresql://user:password@ep-example.neon.tech/neondb?sslmode=require"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
4. Set up the Database Schema
Push the Prisma schema to your Neon PostgreSQL instance:

Bash
npx prisma db push
5. Run the development server
Bash
npm run dev
Open http://localhost:3000 in your browser to view the application.

🔒 Google Calendar API Setup
To enable Google Calendar syncing locally or in production:

Create a project in the Google Cloud Console.

Enable the Google Calendar API.

Configure your OAuth Consent Screen with required scopes (.../auth/calendar).

Link your Google OAuth credentials inside Clerk's External Connection settings.
