// Simple notification store shared across screens
import { useState, useEffect } from 'react';
import { getCurrentUser } from './auth';

export type Notification = {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    color: string;
    destinatarioRol?: 'administrador' | 'paciente' | 'doctor' | 'recepcionista' | 'todos';
    destinatarioEmail?: string;
};

const isWeb = typeof window !== 'undefined' && !!window.localStorage;

let initialNotifications: Notification[] = [
    { id: 1, title: 'Cita confirmada', message: 'Tu cita del 2 de junio a las 10:00 AM ha sido confirmada.', time: 'Hace 5 min', read: false, icon: 'checkmark-circle', color: '#2E8B57', destinatarioRol: 'todos' },
    { id: 2, title: 'Recordatorio de cita', message: 'Tienes una cita mañana a las 9:00 AM. ¡No olvides asistir!', time: 'Hace 1 hora', read: false, icon: 'alarm', color: '#F39C12', destinatarioRol: 'todos' },
    { id: 3, title: 'Resultado disponible', message: 'Tu historial de tratamiento ha sido actualizado por la doctora.', time: 'Ayer', read: true, icon: 'document-text', color: '#4A90E2', destinatarioRol: 'todos' },
];

let notifications: Notification[] = initialNotifications;

if (isWeb) {
    try {
        const stored = window.localStorage.getItem('dental_notifications');
        if (stored) {
            notifications = JSON.parse(stored);
        }
    } catch (e) {}
}

function saveNotifications() {
    if (isWeb) {
        try {
            window.localStorage.setItem('dental_notifications', JSON.stringify(notifications));
        } catch (e) {}
    }
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
    listeners.forEach(fn => fn());
}

export function getNotifications() {
    const user = getCurrentUser();
    if (!user) return [];
    
    return notifications.filter(n => {
        // Filter by email if specified
        if (n.destinatarioEmail && n.destinatarioEmail.toLowerCase() !== user.email.toLowerCase()) {
            return false;
        }
        // Filter by role if specified
        if (n.destinatarioRol && n.destinatarioRol !== 'todos') {
            const isAdmin = user.rol === 'administrador' || user.rol === 'doctor' || user.rol === 'recepcionista';
            if (n.destinatarioRol === 'doctor' || n.destinatarioRol === 'administrador') {
                return isAdmin;
            }
            if (n.destinatarioRol === 'paciente') {
                return user.rol === 'paciente';
            }
            return n.destinatarioRol === user.rol;
        }
        return true;
    });
}

export function getUnreadCount() {
    return getNotifications().filter(n => !n.read).length;
}

export function markRead(id: number) {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications();
    notify();
}

export function markAllRead() {
    const visibleNotifs = getNotifications();
    const visibleIds = new Set(visibleNotifs.map(n => n.id));
    notifications = notifications.map(n => visibleIds.has(n.id) ? { ...n, read: true } : n);
    saveNotifications();
    notify();
}

export function addNotification(
    title: string, 
    message: string, 
    icon: string = 'notifications', 
    color: string = '#e83e8c',
    destinatarioRol?: 'administrador' | 'paciente' | 'doctor' | 'recepcionista' | 'todos',
    destinatarioEmail?: string
) {
    const newNotif: Notification = {
        id: Date.now() + Math.random(),
        title,
        message,
        time: 'Hace un momento',
        read: false,
        icon,
        color,
        destinatarioRol,
        destinatarioEmail
    };
    notifications = [newNotif, ...notifications];
    saveNotifications();
    notify();
}

export function useNotifications() {
    const [currentNotifications, setCurrentNotifications] = useState<Notification[]>(getNotifications());
    const [currentUnreadCount, setCurrentUnreadCount] = useState(getUnreadCount());

    useEffect(() => {
        const listener = () => {
            setCurrentNotifications(getNotifications());
            setCurrentUnreadCount(getUnreadCount());
        };
        listeners.add(listener);
        // Sync on mount
        listener();
        return () => { listeners.delete(listener); };
    }, []);

    return {
        notifications: currentNotifications,
        unreadCount: currentUnreadCount,
        markRead,
        markAllRead,
        addNotification,
    };
}
