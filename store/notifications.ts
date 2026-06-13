// Simple notification store shared across screens
import { useState, useEffect } from 'react';

export type Notification = {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    color: string;
};

let notifications: Notification[] = [
    { id: 1, title: 'Cita confirmada', message: 'Tu cita del 2 de junio a las 10:00 AM ha sido confirmada.', time: 'Hace 5 min', read: false, icon: 'checkmark-circle', color: '#2E8B57' },
    { id: 2, title: 'Recordatorio de cita', message: 'Tienes una cita mañana a las 9:00 AM. ¡No olvides asistir!', time: 'Hace 1 hora', read: false, icon: 'alarm', color: '#F39C12' },
    { id: 3, title: 'Resultado disponible', message: 'Tu historial de tratamiento ha sido actualizado por la doctora.', time: 'Ayer', read: true, icon: 'document-text', color: '#4A90E2' },
];

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
    listeners.forEach(fn => fn());
}

export function getNotifications() {
    return notifications;
}

export function getUnreadCount() {
    return notifications.filter(n => !n.read).length;
}

export function markRead(id: number) {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    notify();
}

export function markAllRead() {
    notifications = notifications.map(n => ({ ...n, read: true }));
    notify();
}

export function useNotifications() {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const listener = () => forceUpdate(c => c + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);

    return {
        notifications: getNotifications(),
        unreadCount: getUnreadCount(),
        markRead,
        markAllRead,
    };
}
