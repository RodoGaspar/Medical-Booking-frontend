"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import  api  from "../lib/api";

interface Appointment {
    _id: string;
    patientName: string;
    email: string;
    phone: string;
    date: string;
    doctor: string;
    status: string;
}

const AppointmentList: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    //Fetch all appointments
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get("api/appointments");
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    //Update appointment status
    const handleStatusChange = async (id: string, newStatus: string) => {
        try{
            await api.patch(`api/appointments/${id}/status`, {
                status: newStatus,
            });
            toast.success("Status updated!");
            fetchAppointments();
        } catch(err) {
            console.error(err);
            toast.error("Failed to update status")
        }
    };

    //Delete appointment

    const handleDelete = async (id: string) => {
        if(!confirm("¿Seguro que deseas eliminar este turno?")) return;

        try {
            await api.delete(`api/appointments/${id}`);
            toast.success("Turno eliminado");
            fetchAppointments();
        } catch (err) {
            console.error(err);
            toast.error("No se pudo eliminar el turno")
        }

    };

    //Filtered list
    const filteredAppointments =
        filter === "all"
            ? appointments
            : appointments.filter((a) => a.status === filter);

    //----------Filtering + Searching----------
    const filtered = appointments 
        .filter(a => filter === "all" ? true : a.status === filter)
        .filter(a => {
            const term = search.toLowerCase();
            return (
                a.patientName.toLowerCase().includes(term) ||
                a.email.toLowerCase().includes(term) ||
                a.doctor.toLowerCase().includes(term)
            );
        });

    //----------Pagination-------------
    const startIdex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIdex + itemsPerPage;
    const paginated = filtered.slice(startIdex, endIndex);

    //----------Reset page to 1 when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search]);

    // Helper for colored status badge
    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-700 border-green-300";
            case "cancelled":
                return "bg-red-100 text-red-700 border-yellow-300"
            default:
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
        }
    };

    // Summary section
    const total = appointments.length
    const pending = appointments.filter(a => a.status === "pending").length;
    const confirmed = appointments.filter(a => a.status === "confirmed").length;
    const cancelled = appointments.filter(a => a.status === "cancelled").length;
    

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }
    
    return(
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb=4">Gestión de Turnos</h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white shadow rounded p-4 text-center">    
                    <h3 className="text-gray-500 text-sm">Total</h3>
                    <p className="text-2xl font-bold">{total}</p>
                </div>
                <div className="bg-yellow-50 shadow rounded p-4 text-center">    
                    <h3 className="text-yellow-700 text-sm">Pendientes</h3>
                    <p className="text-2xl font-bold text-yellow-800">{pending}</p>
                </div>
                <div className="bg-green-50 shadow rounded p-4 text-center">    
                    <h3 className="text-green-700 text-sm">Confirmados</h3>
                    <p className="text-2xl font-bold text-green-800">{confirmed}</p>
                </div>
                <div className="bg-red-50 shadow rounded p-4 text-center">    
                    <h3 className="text-red-700 text-sm">Cancelados</h3>
                    <p className="text-2xl font-bold text-red-800">{cancelled}</p>
                </div>          
            </div>

            {/*Filter bar + search bar*/}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                <div>
                    <label className="mr-2 font-medium">Filtrar por estado</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="cancelled">Cancelado</option>
                    </select>
                </div>
            

                <div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o doctor"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded w-full sm:w-64"
                    />
                </div>
            </div>
            {/* Appointments Table*/}
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Paciente</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Teléfono</th>
                        <th className="border p-2">Fecha</th>
                        <th className="border p-2">Doctor</th>
                        <th className="border p-2">Estado</th>
                        <th className="border p-2 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
    {loading ? (
        <tr>
            <td colSpan={7} className="p-6 text-center">
                <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </td>
        </tr>
    ) : paginated.length > 0 ? (
        paginated.map((a) => (
            <tr key={a._id} className="hover:bg-gray-50">
                <td className="border p-2">{a.patientName}</td>
                <td className="border p-2">{a.email}</td>
                <td className="border p-2">{a.phone}</td>
                <td className="border p-2">
                    {new Date(a.date).toLocaleString("es-AR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                </td>
                <td className="border p-2">{a.doctor}</td>
                <td className="border p-2">
                    <select
                        value={a.status}
                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                        className={`border rounded p-1 ${getStatusColor(a.status)}`}
                    >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="cancelled">Cancelado</option>
                    </select>
                </td>
                <td className="border p-2 text-center">
                    <button
                        onClick={() => handleDelete(a._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar turno"
                    >
                        Eliminar
                    </button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan={7} className="text-center p-4 text-gray-500 italic">
                No hay turnos disponibles
            </td>
        </tr>
    )}
</tbody>
            </table>
            {/* Pagination */}
            {filtered.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50">
                        Atras
                    </button>
                    <span>
                        Pag. {currentPage} de {Math.ceil(filtered.length / itemsPerPage)}
                    </span>
                    <button
                        disabled={endIndex >= filtered.length}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prox.
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentList

