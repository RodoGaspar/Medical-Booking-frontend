"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                // 🚨 REQUIRED for sending & receiving cookies
                credentials: "include",
            });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Login failed");
            return;
        }


        // Redirect to admin dashboard
        router.push("/admin");
        } catch (err) {
            console.error(err);
            setError("Error connecting to server");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-lg shadow-md w-80"
            >
                <h2 className="text-2xl font-bold mb-4 text- center">Admin Login</h2>
                {error && <p className=" text-red-500 text-sm mb-3">{error}</p>}

                <label className="block mb-2">Email</label>
                <input
                    className="border p-2 w-full mb-4 rouded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="admin@example.com"
                    required
                />

                <label className="block mb-2">Password</label>
                <input
                    className="border p-2 w-full mb-4 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full py-2 rounded hover: bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}