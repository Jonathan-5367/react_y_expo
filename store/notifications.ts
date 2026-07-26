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

type Listener = () => void;
const listeners: Set<Listener> = new Set();

let notifications: Notification[] = [];
let unreadCount = 0;

// Evitar circular dependency
let _getUserProvider: (() => any) = () => null;
let _getApiUrlProvider: (() => string) = () => '';

export function setProviders(getUser: () => any, getApiUrl: () => string) {
    _getUserProvider = getUser;
    _getApiUrlProvider = getApiUrl;
}

function notify() {
    listeners.forEach(fn => fn());
}

export async function fetchNotifications() {
    const user = _getUserProvider();
    if (!user) {
        notifications = [];
        unreadCount = 0;
        notify();
        return;
    }

    try {
        const response = await fetch(`${_getApiUrlProvider()}/notificaciones/${user.id}`);
        if (response.ok) {
            const data = await response.json();
            notifications = data.notifications || [];
            unreadCount = data.unreadCount || 0;
            notify();
        }
    } catch (err) {
        console.error('Error fetching notifications:', err);
    }
}

export async function markRead(id: number) {
    // Actualización optimista
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    unreadCount = notifications.filter(n => !n.read).length;
    notify();

    try {
        await fetch(`${_getApiUrlProvider()}/notificaciones/${id}/read`, { method: 'PUT' });
    } catch (err) {
        console.error('Error marking read:', err);
        fetchNotifications(); // Restaurar desde el servidor en caso de error
    }
}

export async function markAllRead() {
    const user = _getUserProvider();
    if (!user) return;

    // Actualización optimista
    notifications = notifications.map(n => ({ ...n, read: true }));
    unreadCount = 0;
    notify();

    try {
        await fetch(`${_getApiUrlProvider()}/notificaciones/read-all/${user.id}`, { method: 'PUT' });
    } catch (err) {
        console.error('Error marking all read:', err);
        fetchNotifications(); // Restaurar desde el servidor en caso de error
    }
}

export function useNotifications() {
    const [currentNotifications, setCurrentNotifications] = useState<Notification[]>(notifications);
    const [currentUnreadCount, setCurrentUnreadCount] = useState(unreadCount);

    useEffect(() => {
        const listener = () => {
            setCurrentNotifications(notifications);
            setCurrentUnreadCount(unreadCount);
        };
        listeners.add(listener);
        
        // Sincronizar desde la base de datos
        fetchNotifications();

        return () => { listeners.delete(listener); };
    }, []);

    return {
        notifications: currentNotifications,
        unreadCount: currentUnreadCount,
        markRead,
        markAllRead,
        fetchNotifications,
    };
}

export function clearNotifications(): void {
    notifications = [];
    unreadCount = 0;
    notify();
}
