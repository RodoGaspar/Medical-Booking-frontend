"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppointmentList from "@/src/components/AppointmentList";
import { checkAdminAuth } from "@/src/lib/checkAdminAuth";
import LogoutButton from "@/src/components/LogoutButton";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const isAuth = await checkAdminAuth();

            if (!isAuth) {
                router.push("/admin/login");
            }
        })();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="mt-2">Ingresaste como admin.</p>

            <div>
                <LogoutButton/>
            </div>

            <AppointmentList />
        </div>
    );
}
