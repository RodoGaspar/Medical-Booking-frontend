## Medical Appointment Booking System – Frontend (Next.js)

This is the frontend interface for the Medical Appointment Booking System.
It allows patients to book appointments and provides an admin dashboard to manage them.

## ✨ Features
    Fully responsive UI
    Appointment booking form with validation
    Admin Dashboard with:
        Login
        Appointment search & filtering
        Pagination
        Confirm / Reject / Delete actions
    Integration with backend API
    Secure admin session using HttpOnly cookies
    Built using modern React patterns

## 🧰 Tech Stack
    Next.js 14+
    React Hook Form + Zod (validation)
    Axios
    Tailwind CSS
    React Toastify / shadcn/ui
    Server Actions & API routes (depending on your structure)

## 🔧 Environment Variables
    Create a .env.local file:
        NEXT_PUBLIC_API_URL=
        
    Example:
        NEXT_PUBLIC_API_URL=http://localhost:5000

## 📦 Installation
    git clone <your-frontend-repo-url>
    cd frontend
    npm install
    npm run dev

    The frontend runs at:
    http://localhost:3000

## 🧭 Pages / Routes
    Route -	Description
    / -	Appointment booking form
    /admin/login -	Admin login
    /admin/dashboard -	Manage appointments4

## 🚀 Deployment
    Deployed on Vercel.
    Just push the repository and ensure you add this environment variable:

    NEXT_PUBLIC_API_URL=https://your-backend-url