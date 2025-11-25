"use client"
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import AppointmentList from '@/src/components/AppointmentList';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if(!token) {
            router.push("/login");
            return;
        }

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/verify`, {
            headers: { Authorization: `Bearer ${token}`,},
        }).catch(() => {
            localStorage.removeItem("adminToken");
            router.push("/login");
        });
    }, []);

    return (
        <div className='P-6'>
            <h1 className='text-xl font-bold'>Admin Dashboard</h1>
            <p className='mt-2'>Ingresaste como admin.</p>
            <AppointmentList/>
        </div>
    );
}