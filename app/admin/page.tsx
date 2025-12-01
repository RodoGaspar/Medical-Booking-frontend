"use client"

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import AppointmentList from '@/src/components/AppointmentList';
import { jwtDecode } from 'jwt-decode';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if(!token) {
            router.push("/admin/login");
            return;
        }

        // 1. Decode token
        try {
            const { exp }: any = jwtDecode(token);
            const now = Date.now() / 1000;

            // 2. Token expired?
            if (exp < now) {
                localStorage.removeItem("adminToken");
                router.push("/admin/login");
                return;
            } 
        } catch (err) {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
            return;
        }

        // 3. Verify token with server
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/verify`, {
            headers: { Authorization: `Bearer ${token}`,},
        }).catch(() => {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
        });
    }, []);

    return (
        <div className='P-6'>
            <h1 className='text-xl font-bold'>Admin Dashboard</h1>
            <p className='mt-2'>Ingresaste como admin.</p>
            <button
                onClick={() => {
                    localStorage.removeItem("adminToken");
                    router.push("/admin/login");
                }}
                className='bg-red-600 text-white px-4 py-2 rounded mt-4'
            >
                Logout
            </button>
            <AppointmentList/>
        </div>
    );
}