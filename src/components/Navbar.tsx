"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [ isOpen, setIsOpen ] = useState(false);

    const navItems = [
        { href: "/", label: "Home"},
        { href: "book", label: "Reservar turno" },
        { href: "appointments", label: "Ver Turnos" },
        { href: "admin/login", label: "Admin" },
    ];

    return (
        <nav className="bg-cyan-200 text-white p-4 shadow-md mb- fixed top-0 sticky z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

                <Link href="/" className=" text-xl font-bold text-blue-600">
                    EMMA
                </Link>
                <div className="hidden sm:flex gap-6">
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
                {/* Mobile Menu Button */}
                <button className="sm:hidden text-gray-600 hover:text-blue-600"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24}/> : <Menu size={24}/> } 
                </button>
            </div>
            {/* Mobile Nav Dropdown */}
            {isOpen &&(
                <div className="sm:hidden bg-white border-t border-gray-200">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 transition-colors ${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            )}
        </nav>
    );
}