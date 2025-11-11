import AppointmentList from "@/src/components/AppointmentList";

export default function AppointmentPage() {
    return (
        <main className="p-6">
            <h1 className="text-2xl">Lista de Turnos</h1>
            <AppointmentList/>
        </main>
    );
}