"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { Axios } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"

const appointmentSchema = z.object({
    patientName: z.string().min(2, "Por favor ingrese su nombre completo"),
    email: z.string().email(" Email invalido"),
    phone: z.string().min(6, "Por favor ingrese su teléfono"),
    date: z.string().nonempty("Selecciona una fecha"),
    time: z.string().nonempty("Seleccione un horario"),
    doctor: z.string().min(2, "Ingrese su Médico"),
    notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AppointmentForm() {
    const [ availableSlots, setAvailableSlots] = useState<string []>([]);
    const [ bookedSlots, setBookedSlots ] = useState<string[]>([]);
    const [ loadingSlots, setLoadingSlots ] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");



    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema)
    });

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!selectedDate) return;
        setLoadingSlots(true)
        const fetchSlots = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/appointments/availability?date=${selectedDate}`
                );
                setAvailableSlots(res.data.availableSlots);
                setBookedSlots(res.data.bookedSlots)
            } catch (err) {
                console.error(err);
                toast.error("No se pudieron cargar los horarios disponibles");
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [selectedDate])

    const onSubmit = async (data: AppointmentFormData) => {
        try {
            const combinedDateTime = new Date(data.time);
            combinedDateTime.setSeconds(0, 0); 
            const payload = {...data, date: combinedDateTime.toISOString(), time:undefined };
            
            await axios.post("http://localhost:5000/api/appointments", payload);
            toast.success("Turno reservado con éxito");
            reset(); // clear the form after success
        } catch (err: any) {
            console.error(err);
            if (axios.isAxiosError(err) && err.response?.data?.message === "El horario ya está reservado") {
                toast.error("Ese horario ya fue reservado");
            } else {
                toast.error("Falló la reserva del turno");
            }
        };
    }
  

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
                Reserva un Turno
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block font-medium">Nombre Completo</label>
                    <input
                        type="text"
                        {...register("patientName")}
                        className="w-full border p-2 rounded"
                    />
                    {errors.patientName && (
                        <p className="text-red-500 text-sm">{errors.patientName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input 
                        type="email"
                        {...register("email")}
                        className="w-full border p-2 rounded"    
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Teléfono</label>
                    <input
                        type="text"
                        {...register("phone")}
                        className="w-full border p-2 rounded"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Fecha</label>
                    <input
                        type="date"
                        min={today}
                        {...register("date")}
                        className="w-full border p-2 rounded"
                        onChange={async (e) => {
                            const selected = e.target.value;
                            setSelectedDate(selected);
                            if (!selected) return;

                            try {
                                const res = await axios.get(
                                    `http://localhost:5000/api/appointments/availability?date=${selected}`
                                );
                                setAvailableSlots(res.data.availableSlots);
                            } catch (err) {
                                console.error(err);
                                toast.error("Error cargando los horarios disponibles");
                            }
                        }}
                    />
                    {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date.message}</p>
                    )}             
                </div>

                {selectedDate && (
                    <div>
                        <label className="block font-medium">Horario disponible</label>
                        <select 
                            {...register("time")}
                            disabled={ loadingSlots || availableSlots.length === 0}
                            className="w-full border p-2 rouded"
                        >
                            <option value=""> Selecciona un horario</option>
                            {availableSlots.map((slot) => {
                                const localTime = new Date(slot).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });

                                const isBooked = bookedSlots.includes(slot);

                                return(
                                    <option key={slot} value={slot} disabled={isBooked}>
                                        {localTime} {isBooked ? "(Ocupado)" : ""}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.time && (
                            <p className="text-red-500 text-sm">{ errors.time.message}</p>
                        )}
                    </div>
                )}

                <div>
                    <label className="block font-medium">Doctor</label>
                    <input
                        type="text"
                        {...register("doctor")}
                        className="w-full border p-2 rounded"
                    />
                    {errors.doctor && (
                        <p className="text-red-500 text-sm">{errors.doctor.message}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Notas</label>
                    <textarea
                        {...register("notes")}
                        className="w-full border p-2 rounded"
                    />             
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {isSubmitting ? "Guardando..." : "Book Appointment"}
                </button>
            </form>

            {/* {success && (
                <p className="text-green-600 mt-4 text-center">
                    {error}
                </p>
            )} */}
        </div>
    );
}