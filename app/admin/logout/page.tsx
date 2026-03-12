"use client"
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        async function logout() {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`, {
                method: "POST",
                credentials: "include"
            });
            router.push("/");
        }
        logout();
    }, []);

    return <p className="p-6">Cerrando sesión...</p>;
}