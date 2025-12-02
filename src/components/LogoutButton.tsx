"use client"
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch (`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`, {
            method: "POST",
            credentials: "include",
        });

        router.push("/admin/login");
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}