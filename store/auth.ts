import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

export type UserRole = 'administrador' | 'paciente' | 'doctor' | 'recepcionista';

export type User = {
    id: number;
    nombre: string;
    cedula: string;
    email: string;
    password?: string;
    telefono?: string;
    telefonoFamiliar?: string;
    alergias?: string;
    fechaNacimiento?: string;
    rol: UserRole;
};

// API Base URL config: uses Localhost on Web, computer's LAN IP on Mobile/Expo Go
const getHostIp = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) {
        return '192.168.0.193'; // Fallback if no hostUri is available
    }
    return hostUri.split(':')[0];
};

export const API_URL = Platform.OS === 'web' 
    ? 'http://localhost:3000/api' 
    : `http://${getHostIp()}:3000/api`;

const isWeb = typeof window !== 'undefined' && !!window.localStorage;

let currentUser: User | null = null;
if (isWeb) {
    try {
        const stored = window.localStorage.getItem('dental_current_user');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    } catch (e) {}
}

function saveCurrentUser() {
    if (isWeb) {
        try {
            if (currentUser) {
                window.localStorage.setItem('dental_current_user', JSON.stringify(currentUser));
            } else {
                window.localStorage.removeItem('dental_current_user');
            }
        } catch (e) {}
    }
}

type AuthListener = () => void;
const listeners: Set<AuthListener> = new Set();

function notify() {
    listeners.forEach(fn => fn());
}

export function getCurrentUser() {
    return currentUser;
}

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || 'Credenciales inválidas' };
        }

        currentUser = data.user;
        saveCurrentUser();
        notify();
        return { success: true, user: data.user };
    } catch (err) {
        console.error('Error logging in:', err);
        return { success: false, error: 'No se pudo conectar al servidor de base de datos.' };
    }
}

export function logout() {
    currentUser = null;
    saveCurrentUser();
    notify();
}

export async function registerPatient(details: Omit<User, 'id' | 'rol'>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(details),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || 'Error al registrarse' };
        }

        currentUser = data.user;
        saveCurrentUser();
        notify();
        return { success: true, user: data.user };
    } catch (err) {
        console.error('Error registering patient:', err);
        return { success: false, error: 'No se pudo conectar al servidor de base de datos.' };
    }
}

export async function registerAdmin(details: Omit<User, 'id'>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
        const response = await fetch(`${API_URL}/auth/register-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(details),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || 'Error al registrar usuario administrativo' };
        }

        notify();
        return { success: true, user: data.user };
    } catch (err) {
        console.error('Error registering admin:', err);
        return { success: false, error: 'No se pudo conectar al servidor de base de datos.' };
    }
}

export async function updateProfile(id: number, details: Omit<User, 'id' | 'rol'>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
        const response = await fetch(`${API_URL}/auth/profile/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(details),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || 'Error al actualizar el perfil' };
        }

        currentUser = data.user;
        saveCurrentUser();
        notify();
        return { success: true, user: data.user };
    } catch (err) {
        console.error('Error updating profile:', err);
        return { success: false, error: 'No se pudo conectar al servidor de base de datos.' };
    }
}

export function useAuth() {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const listener = () => forceUpdate(c => c + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);

    return {
        user: currentUser,
        login,
        logout,
        registerPatient,
        registerAdmin,
        updateProfile,
        users: [] // Left for backward compatibility if reference exists
    };
}

export function useProtectedRoute() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace('/login');
        }
    }, [user]);

    return user;
}
