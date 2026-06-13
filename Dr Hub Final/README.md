# Doctor Hub - Healthcare Web Application

A full-stack, production-ready system for doctor-patient consultation, appointment booking, and immutable medical history management.

## Live Link: https://dorctor-hub.vercel.app

## Prerequisites
- Node.js (v16+)
- MySQL Server

## 1. Database Setup
1. Open your MySQL client or terminal.
2. Execute the `backend/schema.sql` file to create the `doctor_hub` database, tables, and seed data.
```sql
SOURCE path/to/backend/schema.sql;
```

## 2. Backend Setup
1. Navigate to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Copy the example environment variables file and configure it (update `DB_PASSWORD` if necessary):
```bash
cp .env.example .env
```
4. Start the backend server:
```bash
npm start
```
The backend API will run on `http://localhost:5000`.

## 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
The React frontend will be accessible at the URL provided by Vite (usually `http://localhost:5173`).

## User Roles & Capabilities
- **Patient**: Can book appointments, manage their health ledger, upload payment proofs, and chat securely with doctors.
- **Doctor**: Can conduct consultations, issue immutable prescriptions, view full patient history, and manage their clinic timings.
- **Assistant**: Has dedicated workflows to verify patient payments and assist in managing clinic operations.
- **Admin**: Has access to the System Management dashboard. Can view the global registry of all system users, modify user roles, and reset user passwords. Can also see the global appointment schedule.
- **Super Admin**: Has complete, unrestricted system control. Can permanently delete users, bypass assistant payment verification, cancel active appointments, and directly edit/manage doctors' consultation fees dynamically.

## Test Accounts (Seed Data)
The database is fully seeded. If MySQL fails, the application gracefully falls back to an in-memory Mock JSON Database!

Password for all accounts: `password123`
- **Super Admin**: `superadmin@doctorhub.com`
- **Admin**: `admin@doctorhub.com`
- **Doctor (Allopathic)**: `sarah@doctorhub.com`
- **Doctor (Homeopathic)**: `bilal@doctorhub.com`
- **Doctor (Herbal)**: `luqman@doctorhub.com`
- **Assistant**: `ali@doctorhub.com`
- **Assistant**: `fatima@doctorhub.com`
- **Patient**: `john@example.com`

Enjoy exploring Doctor Hub!
