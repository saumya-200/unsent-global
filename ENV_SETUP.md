# Environment Variable Setup Guide

## 1. Local Development Setup

### Frontend
1.  Navigate to `/frontend`.
2.  Copy `.env.local.example` to `.env.local`:
    ```bash
    cp .env.local.example .env.local
    ```
3.  Fill in your **Supabase URL** and **Anon Key** from the Supabase Dashboard.

### Backend
1.  Navigate to `/backend`.
2.  Copy `.env.local.example` to `.env`:
    ```bash
    cp .env.local.example .env
    ```
3.  Fill in your **Supabase URL** and **Service Role Key** (Settings -> API -> Service Role).

## 2. Production Deployment Setup

### Vercel (Frontend)
1.  Go to your project settings on Vercel.
2.  Navigate to **Environment Variables**.
3.  Add the contents of `/frontend/.env.example` (using real production values).
    - `NEXT_PUBLIC_BACKEND_URL` should match your Render backend URL.

### Render (Backend)
1.  Go to your service settings on Render.
2.  Navigate to **Environment**.
3.  Add the contents of `/backend/.env.example` (using real production values).
    - `SUPABASE_SERVICE_KEY` is critical here.
    - `CORS_ORIGINS` should allow your Vercel domain.

## 🚨 Security Principles
- **NEVER** commit files named `.env`, `.env.local`, or `.env.production`.
- **ALWAYS** update `.env.example` if you add new variables.
- **NEVER** expose the `SUPABASE_SERVICE_KEY` in the frontend!
