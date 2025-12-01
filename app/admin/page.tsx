"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppointmentList from "@/src/components/AppointmentList";
import { checkAdminAuth } from "@/src/lib/checkAdminAuth";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        const verify = async () => {
            const isAuth = await checkAdminAuth();

            if (!isAuth) {
                localStorage.removeItem("adminToken");
                router.push("/admin/login");
            }
        };

        verify();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="mt-2">Ingresaste como admin.</p>

            <button
                className="bg-red-600 text-white px-4 py-2 rounded mt-4"
                onClick={() => {
                    localStorage.removeItem("adminToken");
                    router.push("/admin/login");
                }}
            >
                Logout
            </button>

            <AppointmentList />
        </div>
    );
}
