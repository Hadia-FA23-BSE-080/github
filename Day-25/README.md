# Deployment Guide: React (Vercel) & Express (Render)

This project has been configured for a live production deployment.

## 1. Deploying the Express Backend to Render

1. Push your `server` directory to a new GitHub repository (or use your existing repository).
2. Go to [Render](https://render.com/), sign in, and click **New+** -> **Web Service**.
3. Connect your GitHub repository.
4. If your server is in a sub-folder (e.g., `Day 25/server`), set the **Root Directory** to `server`.
5. Set the following details:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Click **Create Web Service**. Render will now deploy your API and provide a live URL (e.g., `https://your-api.onrender.com`).

## 2. Deploying the React Frontend to Vercel

1. Push your `client` directory to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
3. Import the repository containing your React app. 
4. If it is in a sub-folder, click **Edit** on the Root Directory and select `client`.
5. Vercel will automatically detect that it's a **Vite** app.
6. Open the **Environment Variables** section and add:
   - **Name:** `VITE_API_URL`
   - **Value:** `[YOUR_RENDER_URL_HERE]` (e.g., `https://your-api.onrender.com`)
7. Click **Deploy**. Vercel will build the frontend. The `vercel.json` file is already included for accurate client-side routing.

## Verification
Once both are deployed, open your Vercel live URL. You will see a premium UI that checks the connection to your Render backend in real-time. If everything is configured properly, the frontend will show a green "Online" badge for your backend.
