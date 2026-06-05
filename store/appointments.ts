import { useState, useEffect } from 'react';

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

// Initial realistic mock data
let appointments: Appointment[] = [
    {
        id: 1,
        pacienteNombre: 'Juan Pérez',
        pacienteTelefono: '04141234567',
        pacienteEmail: 'paciente@paciente.com',
        fecha: '2026-06-15',
        hora: '10:00',
        procedimiento: 'Limpieza Dental',
        doctor: 'Dra. Nazaret Lopez',
        estado: 'confirmada',
        pasada: false
    },
    {
        id: 2,
        pacienteNombre: 'Juan Pérez',
        pacienteTelefono: '04141234567',
        pacienteEmail: 'paciente@paciente.com',
        fecha: '2026-05-02',
        hora: '14:30',
        procedimiento: 'Ortodoncia',
        doctor: 'Dra. Nazaret Lopez',
        estado: 'completada',
        pasada: true
    },
    {
        id: 3,
        pacienteNombre: 'Juan Pérez',
        pacienteTelefono: '04141234567',
        pacienteEmail: 'paciente@paciente.com',
        fecha: '2026-04-10',
        hora: '09:00',
        procedimiento: 'Consulta General',
        doctor: 'Dra. Nazaret Lopez',
        estado: 'cancelada',
        pasada: true
    },
    {
        id: 4,
        pacienteNombre: 'Ana Gómez',
        pacienteTelefono: '555-0101',
        pacienteEmail: 'ana@gmail.com',
        fecha: '2026-06-22',
        hora: '14:30',
        procedimiento: 'Ortodoncia',
        doctor: 'Dra. Nazaret Lopez',
        estado: 'confirmada',
        pasada: false
    },
    {
        id: 5,
        pacienteNombre: 'Carlos Ruiz',
        pacienteTelefono: '555-0202',
        pacienteEmail: 'carlos@gmail.com',
        fecha: '2026-06-10',
        hora: '09:00',
        procedimiento: 'Consulta General',
        doctor: 'Dra. Nazaret Lopez',
        estado: 'pendiente',
        pasada: false
    }
];

type AppointmentsListener = () => void;
const listeners: Set<AppointmentsListener> = new Set();

function notify() {
    listeners.forEach(fn => fn());
}

export function getAppointments() {
    return appointments;
}

export function addAppointment(app: Omit<Appointment, 'id' | 'doctor' | 'estado' | 'pasada'>): Appointment {
    const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    
    // Determine if the appointment date is in the past
    const todayStr = new Date().toISOString().split('T')[0];
    const isPast = app.fecha < todayStr;

    const newAppointment: Appointment = {
        ...app,
        id: newId,
        doctor: 'Dra. Nazaret Lopez',
        estado: 'confirmada',
        pasada: isPast
    };

    appointments = [newAppointment, ...appointments];
    notify();
    return newAppointment;
}

export function cancelAppointment(id: number): boolean {
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        // Only allow canceling future non-canceled appointments
        appointments[index].estado = 'cancelada';
        notify();
        return true;
    }
    return false;
}

export function useAppointments() {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const listener = () => forceUpdate(c => c + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);

    return {
        appointments,
        getAppointments,
        addAppointment,
        cancelAppointment
    };
}
