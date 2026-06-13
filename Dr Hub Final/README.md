# Doctor Hub - Healthcare Web Application

A full-stack, production-ready system for doctor-patient consultation, appointment booking, and immutable medical history management.

## Live Link: https://dorctor-hub.vercel.app

## Prerequisites
- Node.js (v16+)
- MySQL Server


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

## Project Screenshot:
<img width="624" height="295" alt="image" src="https://github.com/user-attachments/assets/b46ec997-b4c3-4548-a8bf-b95407739b85" />
<img width="624" height="297" alt="image" src="https://github.com/user-attachments/assets/a26676b8-1c46-43e1-8d40-63042de7d756" />
<img width="624" height="311" alt="image" src="https://github.com/user-attachments/assets/3017e77e-493e-40ec-8941-21ce37c85307" />
<img width="624" height="290" alt="image" src="https://github.com/user-attachments/assets/a067c1b3-5375-4814-a3aa-b0a64ef11598" />
<img width="624" height="295" alt="image" src="https://github.com/user-attachments/assets/aa0df441-01c3-43d4-9ead-c9aabc187902" />
<img width="624" height="293" alt="image" src="https://github.com/user-attachments/assets/b0d73e5e-7b02-4359-b88f-f08a706e3df5" />
<img width="624" height="290" alt="image" src="https://github.com/user-attachments/assets/b4d2147a-716f-4908-9ad9-d7e38684dcce" />
<img width="624" height="295" alt="image" src="https://github.com/user-attachments/assets/840d6955-b3ad-4f2e-9e22-c10bec81339f" />
<img width="624" height="296" alt="image" src="https://github.com/user-attachments/assets/efa6183b-02a3-426d-a70a-39405aa2900e" />
<img width="624" height="269" alt="image" src="https://github.com/user-attachments/assets/b721c6ab-1505-4186-9f74-cff89621115a" />
<img width="624" height="296" alt="image" src="https://github.com/user-attachments/assets/271fd155-18dc-41be-962b-7a8884abdc84" />
<img width="624" height="297" alt="image" src="https://github.com/user-attachments/assets/5628be19-c9f5-4be8-9010-a1ed646d01e9" />
<img width="624" height="288" alt="image" src="https://github.com/user-attachments/assets/92e2bfa9-dc33-4a50-9697-ff0b0618b281" />
<img width="624" height="296" alt="image" src="https://github.com/user-attachments/assets/fa899acc-eacc-455e-b946-97843f04951c" />
<img width="624" height="300" alt="image" src="https://github.com/user-attachments/assets/3e95819f-185b-471b-81e9-3b6551cca3ad" />
<img width="624" height="299" alt="image" src="https://github.com/user-attachments/assets/5e8d0c05-24df-4869-809d-db91af358a43" />
<img width="624" height="300" alt="image" src="https://github.com/user-attachments/assets/6be98a54-5307-420e-99d0-9f4c24e0d964" />
<img width="624" height="294" alt="image" src="https://github.com/user-attachments/assets/19859d41-0e07-4c0a-bc6f-6fc3fcc7bc57" />
<img width="624" height="302" alt="image" src="https://github.com/user-attachments/assets/8e8f5184-74d8-45ae-8c93-1803f7ead277" />
<img width="624" height="292" alt="image" src="https://github.com/user-attachments/assets/e28fc26d-51ea-455c-8835-137eadf66f03" />
<img width="624" height="295" alt="image" src="https://github.com/user-attachments/assets/08c32b08-1f0d-407d-b711-702f9999a76d" />
<img width="624" height="304" alt="image" src="https://github.com/user-attachments/assets/3ec1ebc2-7c80-475f-8c94-3bcddef7bc96" />
<img width="624" height="304" alt="image" src="https://github.com/user-attachments/assets/5ef86a46-dd77-4a83-9b45-6fb35be69523" />
<img width="624" height="303" alt="image" src="https://github.com/user-attachments/assets/8f2a52a9-958a-492c-ad06-81307cd32d27" />
<img width="624" height="305" alt="image" src="https://github.com/user-attachments/assets/7e429b2c-e2f7-463d-a2fb-f0855ad136db" />
<img width="624" height="300" alt="image" src="https://github.com/user-attachments/assets/e5eb8861-bc1e-4ac8-9bd7-7c067a00f87d" />
<img width="624" height="297" alt="image" src="https://github.com/user-attachments/assets/7850886c-1357-470a-8f24-7f87c41ae592" />
<img width="624" height="298" alt="image" src="https://github.com/user-attachments/assets/78ee8bbe-2953-4523-b5e7-2df20ac0bc9f" />
<img width="624" height="295" alt="image" src="https://github.com/user-attachments/assets/44770cea-6b57-4d10-8505-d5b3b8bf43e4" />
<img width="624" height="290" alt="image" src="https://github.com/user-attachments/assets/d479702b-8db6-4eaf-87a8-a3b682ebc2a6" />
<img width="624" height="310" alt="image" src="https://github.com/user-attachments/assets/7c18fa4c-7c65-42eb-a2bc-77e34265bc23" />
<img width="624" height="312" alt="image" src="https://github.com/user-attachments/assets/830ad6bb-2dd3-4353-8b05-f479d892415f" />




