import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { API_URL, useAuth } from './auth';
import { syncAllAppointmentReminders } from '@/utils/local-notifications';
import { fetchNotifications } from './notifications';

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

// --- SISTEMA DE REACTIVIDAD CUSTOMIZADO ---
// Utilizamos un Set de "listeners" (funciones de escucha) para notificar a los componentes 
// de React cada vez que las citas cambian (se agrega, cancela o confirma una).
const listeners = new Set<() => void>();

// Esta función ejecuta todos los listeners registrados, forzando un re-renderizado
// en los componentes que estén usando el hook useAppointments().
const notifyListeners = () => listeners.forEach((listener) => listener());

export async function fetchAppointments(): Promise<Appointment[]> {
    try {
        const response = await fetch(`${API_URL}/appointments`);
        if (!response.ok) throw new Error('Error fetching appointments');
        const data = await response.json();
        appointments = data;
        notifyListeners();
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
            notifyListeners();
            fetchAppointments();
            fetchNotifications(); // Update current user's notification bell

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
            // Create a new array and object references to trigger React state re-rendering
            appointments = appointments.map(a => 
                a.id === id ? { ...a, estado: 'cancelada' } : a
            );
            notifyListeners();
            fetchAppointments();
            fetchNotifications(); // Update current user's notification bell
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
            // Create a new array and object references to trigger React state re-rendering
            appointments = appointments.map(a => 
                a.id === id ? { ...a, estado: 'confirmada' } : a
            );
            notifyListeners();
            fetchAppointments();
            fetchNotifications(); // Update current user's notification bell
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Hook principal que expone el estado de las citas a los componentes de la interfaz.
export function useAppointments() {
    // Almacenamos las citas en el estado local del componente para garantizar la reactividad.
    const [currentAppointments, setCurrentAppointments] = useState<Appointment[]>(appointments);
    const { user } = useAuth();

    useEffect(() => {
        // Función que actualiza el estado local cuando se emite una notificación.
        const listener = () => {
            setCurrentAppointments([...appointments]);
        };
        
        // Suscribimos el componente a los cambios al montarse.
        listeners.add(listener);
        
        // Auto-fetch on mount
        fetchAppointments();

        // Limpieza: nos desuscribimos cuando el componente se desmonta.
        return () => { listeners.delete(listener); };
    }, []);

    // Sincronizar recordatorios locales de las citas del paciente
    useEffect(() => {
        if (user && user.rol === 'paciente') {
            syncAllAppointmentReminders(currentAppointments, user.email);
        }
    }, [currentAppointments, user]);

    return {
        appointments: currentAppointments,
        getAppointments,
        fetchAppointments,
        addAppointment,
        cancelAppointment,
        confirmAppointment
    };
}
