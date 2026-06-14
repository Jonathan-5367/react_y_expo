import { useState, useEffect } from 'react';
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

<<<<<<< HEAD
// API Base URL config: uses Localhost on Web, computer's LAN IP on Mobile/Expo Go
const API_URL = Platform.OS === 'web' ? 'http://localhost:3000/api' : 'http://192.168.0.193:3000/api';

const isWeb = typeof window !== 'undefined' && !!window.localStorage;
=======
const isWeb = typeof window !== 'undefined' && !!window.localStorage;

// Load users from localStorage if available
let users: User[] = [];
if (isWeb) {
    try {
        const stored = window.localStorage.getItem('dental_users');
        if (stored) {
            users = JSON.parse(stored);
        }
    } catch (e) {
        console.error(e);
    }
}

if (users.length === 0) {
    users = [
        {
            id: 1,
            nombre: 'Admin Principal',
            cedula: '99999999',
            email: 'admin@admin.com',
            password: 'admin',
            rol: 'administrador'
        },
        {
            id: 2,
            nombre: 'Juan Pérez',
            cedula: '12345678',
            email: 'paciente@paciente.com',
            password: 'password',
            telefono: '04141234567',
            telefonoFamiliar: '04147654321',
            alergias: 'Ninguna',
            fechaNacimiento: '1995-05-15',
            rol: 'paciente'
        },
        {
            id: 3,
            nombre: 'Ana Gómez',
            cedula: '12345679',
            email: 'ana@gmail.com',
            password: 'password',
            rol: 'paciente'
        }
    ];
}
>>>>>>> d32345c22357e77b7c7e3b654c495a373808e746

let currentUser: User | null = null;
if (isWeb) {
    try {
        const stored = window.localStorage.getItem('dental_current_user');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    } catch (e) {}
}

<<<<<<< HEAD
=======
function saveUsers() {
    if (isWeb) {
        try {
            window.localStorage.setItem('dental_users', JSON.stringify(users));
        } catch (e) {
            console.error(e);
        }
    }
}

>>>>>>> d32345c22357e77b7c7e3b654c495a373808e746
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

<<<<<<< HEAD
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
=======
export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const user = users.find(u => u.email.trim().toLowerCase() === trimmedEmail);
    if (!user) {
        return { success: false, error: 'Usuario no registrado' };
    }
    if ((user.password || '').trim() !== trimmedPassword) {
        return { success: false, error: 'Contraseña incorrecta' };
    }
    currentUser = user;
    saveCurrentUser();
    notify();
    return { success: true, user };
>>>>>>> d32345c22357e77b7c7e3b654c495a373808e746
}

export function logout() {
    currentUser = null;
    saveCurrentUser();
    notify();
}

<<<<<<< HEAD
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
=======
export function registerPatient(details: Omit<User, 'id' | 'rol'>): { success: boolean; user?: User; error?: string } {
    const trimmedEmail = details.email.trim().toLowerCase();
    const trimmedCedula = details.cedula.trim();
    const exists = users.some(u => u.email.trim().toLowerCase() === trimmedEmail || u.cedula.trim() === trimmedCedula);
    if (exists) {
        return { success: false, error: 'El correo o la cédula ya se encuentran registrados' };
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
        ...details,
        nombre: details.nombre.trim(),
        cedula: trimmedCedula,
        email: trimmedEmail,
        password: details.password ? details.password.trim() : '',
        telefono: details.telefono ? details.telefono.trim() : '',
        telefonoFamiliar: details.telefonoFamiliar ? details.telefonoFamiliar.trim() : '',
        alergias: details.alergias ? details.alergias.trim() : '',
        fechaNacimiento: details.fechaNacimiento ? details.fechaNacimiento.trim() : '',
        id: newId,
        rol: 'paciente'
    };
    users.push(newUser);
    saveUsers();
    // Auto login
    currentUser = newUser;
    saveCurrentUser();
    notify();
    return { success: true, user: newUser };
}

export function registerAdmin(details: Omit<User, 'id'>): { success: boolean; user?: User; error?: string } {
    const trimmedEmail = details.email.trim().toLowerCase();
    const trimmedCedula = details.cedula.trim();
    const exists = users.some(u => u.email.trim().toLowerCase() === trimmedEmail || u.cedula.trim() === trimmedCedula);
    if (exists) {
        return { success: false, error: 'El correo o la cédula ya se encuentran registrados' };
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
        ...details,
        nombre: details.nombre.trim(),
        cedula: trimmedCedula,
        email: trimmedEmail,
        password: details.password ? details.password.trim() : '',
        telefono: details.telefono ? details.telefono.trim() : '',
        id: newId
    };
    users.push(newUser);
    saveUsers();
    // We don't auto-login for registering other admins from an admin session
    notify();
    return { success: true, user: newUser };
>>>>>>> d32345c22357e77b7c7e3b654c495a373808e746
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
        users: [] // Left for backward compatibility if reference exists
    };
}
