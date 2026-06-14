import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';

export type Appointment = {
    id: number;
    pacienteNombre: string;
    pacienteTelefono: string;
    pacienteEmail: string;
    fecha: string; // Format: YYYY-MM-DD
    hora: string;  // Format: HH:MM
    procedimiento: string;
    doctor: string;
    estado: AppointmentStatus;
    pasada: boolean;
};

const API_URL = Platform.OS === 'web' ? 'http://localhost:3000/api' : 'http://192.168.0.193:3000/api';

let appointments: Appointment[] = [];

type AppointmentsListener = () => void;
const listeners: Set<AppointmentsListener> = new Set();

function notify() {
    listeners.forEach(fn => fn());
}

export async function fetchAppointments(): Promise<Appointment[]> {
    try {
        const response = await fetch(`${API_URL}/appointments`);
        if (!response.ok) throw new Error('Error fetching appointments');
        const data = await response.json();
        appointments = data;
        notify();
        return appointments;
    } catch (err) {
        console.error(err);
        return appointments;
    }
}

export function getAppointments() {
    return appointments;
}

export async function addAppointment(app: Omit<Appointment, 'id' | 'doctor' | 'estado' | 'pasada'>): Promise<Appointment | null> {
    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(app),
        });

        if (!response.ok) throw new Error('Error creating appointment');
        const data = await response.json();
        
        if (data.success) {
            appointments = [data.appointment, ...appointments];
            notify();
            return data.appointment;
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function cancelAppointment(id: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/appointments/${id}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Error canceling appointment');
        const data = await response.json();

        if (data.success) {
            const index = appointments.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments[index].estado = 'cancelada';
                notify();
            }
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function useAppointments() {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const listener = () => forceUpdate(c => c + 1);
        listeners.add(listener);
        
        // Auto-fetch on mount
        fetchAppointments();

        return () => { listeners.delete(listener); };
    }, []);

    return {
        appointments,
        getAppointments,
        fetchAppointments,
        addAppointment,
        cancelAppointment
    };
}
