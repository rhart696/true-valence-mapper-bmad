# Deployment Guide: True Valence Mapper (MVP)

This guide explains how to deploy the application to the cloud using **Vercel**, allowing your colleagues to access it via a public URL (e.g., `https://true-valence-mapper.vercel.app`) instead of running it locally.

## Prerequisites
1.  **GitHub Account:** You already have the repo at `https://github.com/rhart696/true-valence-mapper-bmad`.
2.  **Vercel Account:** Sign up at [vercel.com](https://vercel.com) (free tier is sufficient).
3.  **Supabase Project:** You should have this from the Demo setup.

## Step 1: Push Code to GitHub
Ensure your latest changes (including the new React app) are pushed to your repository.

```bash
# In the project root
git add .
git commit -m "feat: Implement MVP React App with Supabase"
git push origin main
```

## Step 2: Deploy to Vercel
1.  **Log in** to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository:**
    -   Select your `true-valence-mapper-bmad` repository.
4.  **Configure Project:**
    -   **Framework Preset:** Vite
    -   **Root Directory:** Click "Edit" and select `versions/bmad/app` (this is crucial because the app isn't in the root).
5.  **Environment Variables:**
    -   Expand the "Environment Variables" section.
    -   Add the same variables from your local `.env` file:
        -   `VITE_SUPABASE_URL`: (Your Supabase Project URL)
        -   `VITE_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
6.  Click **"Deploy"**.

## Step 3: Verify Deployment
1.  Wait for the build to complete (usually < 1 minute).
2.  Vercel will provide a **Deployment URL** (e.g., `https://true-valence-mapper-bmad.vercel.app`).
3.  **Test:**
    -   Open the URL.
    -   Log in with your email (Magic Link).
    -   Create a map and verify it saves.

## Step 4: Share with Colleagues
-   Send the **Vercel URL** to your colleagues.
-   **Note:** Since we haven't set up strict Row Level Security (RLS) policies yet, they will be able to log in with *their* emails and see *their* own data (once RLS is enabled). For now, in the pilot, it's open.

## Troubleshooting
-   **Build Fails?** Check the "Build Logs" in Vercel. Ensure `npm install` ran correctly.
-   **White Screen?** Check the browser console. Usually means Environment Variables are missing.
