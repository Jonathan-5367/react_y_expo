import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { API_URL } from './auth';
import { addNotification } from './notifications';

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

export async function addAppointment(app: Omit<Appointment, 'id' | 'doctor' | 'estado' | 'pasada'>): Promise<{ success: true; appointment: Appointment } | { success: false; error: string }> {
    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(app),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || 'Error al registrar la cita.' };
        }
        
        if (data.success) {
            appointments = [data.appointment, ...appointments];
            notify();
            fetchAppointments();

            const dateParts = data.appointment.fecha.split('-');
            const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : data.appointment.fecha;

            // Notify patient (targeted to their email)
            addNotification(
                'Cita agendada',
                `Tu cita para ${data.appointment.procedimiento} el ${formattedDate} a las ${data.appointment.hora} ha sido agendada con éxito.`,
                'calendar',
                '#e83e8c',
                'paciente',
                data.appointment.pacienteEmail
            );

            // Notify doctor (targeted to doctor role)
            addNotification(
                'Nueva cita (Doctor)',
                `El paciente ${data.appointment.pacienteNombre} ha agendado una cita para ${data.appointment.procedimiento} el ${formattedDate} a las ${data.appointment.hora}.`,
                'medical',
                '#2E8B57',
                'doctor'
            );

            return { success: true, appointment: data.appointment };
        }
        return { success: false, error: 'No se pudo registrar la cita.' };
    } catch (err) {
        console.error(err);
        return { success: false, error: 'Error de conexión. Inténtalo de nuevo.' };
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
            const appToCancel = appointments.find(a => a.id === id);
            if (appToCancel) {
                const dateParts = appToCancel.fecha.split('-');
                const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : appToCancel.fecha;

                // Send cancellation notification to patient
                addNotification(
                    'Cita cancelada',
                    `La cita para ${appToCancel.procedimiento} el ${formattedDate} a las ${appToCancel.hora} ha sido cancelada.`,
                    'close-circle',
                    '#F44336',
                    'paciente',
                    appToCancel.pacienteEmail
                );

                // Send cancellation notification to doctor
                addNotification(
                    'Cita cancelada (Doctor)',
                    `La cita del paciente ${appToCancel.pacienteNombre} para ${appToCancel.procedimiento} el ${formattedDate} a las ${appToCancel.hora} ha sido cancelada.`,
                    'close-circle',
                    '#F44336',
                    'doctor'
                );
            }

            // Create a new array and object references to trigger React state re-rendering
            appointments = appointments.map(a => 
                a.id === id ? { ...a, estado: 'cancelada' } : a
            );
            notify();
            fetchAppointments();
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function confirmAppointment(id: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/appointments/${id}/confirm`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Error confirming appointment');
        const data = await response.json();

        if (data.success) {
            const appToConfirm = appointments.find(a => a.id === id);
            if (appToConfirm) {
                const dateParts = appToConfirm.fecha.split('-');
                const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : appToConfirm.fecha;

                // Send confirmation notification to patient
                addNotification(
                    'Cita confirmada',
                    `Tu cita para ${appToConfirm.procedimiento} el ${formattedDate} a las ${appToConfirm.hora} ha sido confirmada por el consultorio.`,
                    'checkmark-circle',
                    '#2E8B57',
                    'paciente',
                    appToConfirm.pacienteEmail
                );
            }

            // Create a new array and object references to trigger React state re-rendering
            appointments = appointments.map(a => 
                a.id === id ? { ...a, estado: 'confirmada' } : a
            );
            notify();
            fetchAppointments();
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function useAppointments() {
    const [currentAppointments, setCurrentAppointments] = useState<Appointment[]>(appointments);

    useEffect(() => {
        const listener = () => {
            setCurrentAppointments([...appointments]);
        };
        listeners.add(listener);
        
        // Auto-fetch on mount
        fetchAppointments();

        return () => { listeners.delete(listener); };
    }, []);

    return {
        appointments: currentAppointments,
        getAppointments,
        fetchAppointments,
        addAppointment,
        cancelAppointment,
        confirmAppointment
    };
}
