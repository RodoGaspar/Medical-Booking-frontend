import Link from "next/link";
import AppointmentForm from "@/src/components/AppointmentForm";

export default function BookPage() {
    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-600">
                Reserva un Turno
            </h1>
            <Link href="/appointments" className="text-blue-500 hover:underline mb-4 inline-block">Ver lista de turnos</Link>
            <AppointmentForm/>
        </main>
    );
}