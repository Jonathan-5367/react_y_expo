import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

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

// Configuración de la URL Base de la API: Usa Localhost en Web, o la IP LAN en Móvil/Expo Go
const getHostIp = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) {
        return '192.168.0.193'; // Respaldo (Fallback) si no hay hostUri disponible
    }
    return hostUri.split(':')[0];
};

// --- CONFIGURACIÓN DEL SERVIDOR ---
// Cambia USE_PRODUCTION a true para usar tu base de datos en Railway (producción).
// Cambia a false para usar el servidor local en tu computadora.
const USE_PRODUCTION = true;

// La constante API_URL determina a dónde se enviarán todas las peticiones (fetch) de la app.
export const API_URL = USE_PRODUCTION
    ? 'https://reactyexpo-production.up.railway.app/api' // Enlace a tu servidor en la nube
    : (Platform.OS === 'web'
        ? 'http://localhost:3000/api' // Si estás probando en navegador web
        : `http://${getHostIp()}:3000/api`); // Si estás en Expo Go (Android/iOS) usando Wi-Fi local

const STORAGE_KEY = 'dental_current_user';
const isWeb = typeof window !== 'undefined' && !!window.localStorage;

let currentUser: User | null = null;

// Carga sincrónica para web (localStorage)
if (isWeb) {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    } catch (e) { }
}

// Guarda la sesión tanto en web (localStorage) como en móvil (AsyncStorage)
async function saveCurrentUser() {
    if (isWeb) {
        try {
            if (currentUser) {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
            } else {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        } catch (e) { }
    } else {
        try {
            if (currentUser) {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
            } else {
                await AsyncStorage.removeItem(STORAGE_KEY);
            }
        } catch (e) { }
    }
}

/**
 * Inicializa la sesión leyendo el usuario guardado desde AsyncStorage (móvil).
 * Debe llamarse una vez al iniciar la aplicación, antes de mostrar cualquier pantalla.
 */
export async function initAuth(): Promise<User | null> {
    if (isWeb) return currentUser; // En web ya se cargó sincrónicamente
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
            currentUser = JSON.parse(stored);
            notify();
        }
    } catch (e) { }
    return currentUser;
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

export async function logout() {
    currentUser = null;
    await saveCurrentUser();
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
        users: [] // Dejado para compatibilidad hacia atrás si existe referencia
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
