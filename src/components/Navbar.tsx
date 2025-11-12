"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home"},
        { href: "book", label: "Reservar turno" },
        { href: "appointments", label: "Ver Turnos" },
    ];

    return (
        <nav className="bg-cyan-200 text-white p-4 shadow-wd fixed top-0 w-full z-10">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Link href="/" className=" text-xl font-bold text-blue-600">
                    Turnos
                </Link>
                <div className="flex gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors ${
                                    isActive
                                    ? " text-blue-300 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-blue-500"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );                        
                    })}
                </div>
            </div>
        </nav>
    );
}