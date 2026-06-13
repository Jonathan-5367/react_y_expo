import { useState, useEffect } from 'react';

export type UserRole = 'administrador' | 'paciente' | 'doctor' | 'recepcionista';

export type User = {
    id: number;
    nombre: string;
    cedula: string;
    email: string;
    password?: string; // stored for demo verification
    telefono?: string;
    telefonoFamiliar?: string;
    alergias?: string;
    fechaNacimiento?: string;
    rol: UserRole;
};

// Initial test users
let users: User[] = [
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

let currentUser: User | null = null;

type AuthListener = () => void;
const listeners: Set<AuthListener> = new Set();

function notify() {
    listeners.forEach(fn => fn());
}

export function getCurrentUser() {
    return currentUser;
}

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        return { success: false, error: 'Usuario no registrado' };
    }
    if (user.password !== password) {
        return { success: false, error: 'Contraseña incorrecta' };
    }
    currentUser = user;
    notify();
    return { success: true, user };
}

export function logout() {
    currentUser = null;
    notify();
}

export function registerPatient(details: Omit<User, 'id' | 'rol'>): { success: boolean; user?: User; error?: string } {
    const exists = users.some(u => u.email.toLowerCase() === details.email.toLowerCase() || u.cedula === details.cedula);
    if (exists) {
        return { success: false, error: 'El correo o la cédula ya se encuentran registrados' };
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
        ...details,
        id: newId,
        rol: 'paciente'
    };
    users.push(newUser);
    // Auto login
    currentUser = newUser;
    notify();
    return { success: true, user: newUser };
}

export function registerAdmin(details: Omit<User, 'id'>): { success: boolean; user?: User; error?: string } {
    const exists = users.some(u => u.email.toLowerCase() === details.email.toLowerCase() || u.cedula === details.cedula);
    if (exists) {
        return { success: false, error: 'El correo o la cédula ya se encuentran registrados' };
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
        ...details,
        id: newId
    };
    users.push(newUser);
    // We don't auto-login for registering other admins from an admin session
    notify();
    return { success: true, user: newUser };
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
        users
    };
}
