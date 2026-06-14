const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Helper to compare bcrypt hashes from PHP ($2y$) and plain text
const comparePassword = (inputPassword, dbHash) => {
    if (!dbHash) return false;
    // Normalized PHP variant $2y$ to $2a$ for node compatibility
    const normalizedHash = dbHash.startsWith('$2y$') ? '$2a$' + dbHash.slice(4) : dbHash;
    try {
        return bcrypt.compareSync(inputPassword, normalizedHash);
    } catch (e) {
        // Fallback for plain text passwords in demo/mock accounts
        return inputPassword === dbHash;
    }
};

// 1. LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        const [users] = await db.query(
            `SELECT u.*, r.nombre as rol 
             FROM usuarios u 
             LEFT JOIN roles r ON u.id_rol = r.id_rol 
             WHERE u.email = ? AND u.activo = 1`,
            [trimmedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Usuario no registrado o inactivo' });
        }

        const user = users[0];
        const isMatch = comparePassword(trimmedPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Clean user response
        delete user.password;

        return res.json({
            success: true,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                cedula: user.cedula,
                email: user.email,
                telefono: user.telefono,
                telefonoFamiliar: user.telefono_familiar,
                alergias: user.alergias,
                fechaNacimiento: user.fecha_nacimiento,
                rol: user.rol
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 2. REGISTER PATIENT
router.post('/register', async (req, res) => {
    const { nombre, cedula, email, password, telefono, fechaNacimiento, telefonoFamiliar, alergias } = req.body;

    if (!nombre || !cedula || !email || !password) {
        return res.status(400).json({ error: 'Nombre, cédula, correo y contraseña son campos obligatorios.' });
    }

    try {
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedCedula = cedula.trim();

        // Check unique fields
        const [existing] = await db.query(
            'SELECT id_usuario FROM usuarios WHERE email = ? OR cedula = ?',
            [trimmedEmail, trimmedCedula]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'El correo o la cédula ya se encuentran registrados.' });
        }

        // Hash password
        const passwordHash = bcrypt.hashSync(password.trim(), 10);
        
        // Insert into usuarios
        const [result] = await db.query(
            `INSERT INTO usuarios (nombre, cedula, email, password, telefono, telefono_familiar, alergias, fecha_nacimiento, id_rol, activo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 4, 1)`,
            [
                nombre.trim(),
                trimmedCedula,
                trimmedEmail,
                passwordHash,
                telefono ? telefono.trim() : null,
                telefonoFamiliar ? telefonoFamiliar.trim() : null,
                alergias ? alergias.trim() : null,
                fechaNacimiento ? fechaNacimiento.trim() : null
            ]
        );

        const newUserId = result.insertId;

        // Insert into pacientes
        await db.query(
            'INSERT INTO pacientes (tipo, id_origen) VALUES (?, ?)',
            ['adulto', newUserId]
        );

        return res.json({
            success: true,
            user: {
                id: newUserId,
                nombre: nombre.trim(),
                cedula: trimmedCedula,
                email: trimmedEmail,
                telefono,
                telefonoFamiliar,
                alergias,
                fechaNacimiento,
                rol: 'paciente'
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ error: 'Error interno al registrar el paciente' });
    }
});

// 3. REGISTER ADMIN (ANY ROLE BY ADMIN)
router.post('/register-admin', async (req, res) => {
    const { nombre, cedula, email, password, telefono, rol } = req.body;

    if (!nombre || !cedula || !email || !password || !rol) {
        return res.status(400).json({ error: 'Todos los campos marcados con asterisco (*) son requeridos.' });
    }

    try {
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedCedula = cedula.trim();

        // Check unique fields
        const [existing] = await db.query(
            'SELECT id_usuario FROM usuarios WHERE email = ? OR cedula = ?',
            [trimmedEmail, trimmedCedula]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'El correo o la cédula ya se encuentran registrados.' });
        }

        // Map role name to role id
        const roleMap = {
            'administrador': 1,
            'doctor': 2,
            'recepcionista': 3,
            'paciente': 4
        };

        const roleId = roleMap[rol.toLowerCase()] || 4;

        // Hash password
        const passwordHash = bcrypt.hashSync(password.trim(), 10);

        // Insert into usuarios
        const [result] = await db.query(
            `INSERT INTO usuarios (nombre, cedula, email, password, telefono, id_rol, activo) 
             VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [
                nombre.trim(),
                trimmedCedula,
                trimmedEmail,
                passwordHash,
                telefono ? telefono.trim() : null,
                roleId
            ]
        );

        const newUserId = result.insertId;

        // If registered as patient, create references
        if (roleId === 4) {
            await db.query(
                'INSERT INTO pacientes (tipo, id_origen) VALUES (?, ?)',
                ['adulto', newUserId]
            );
        }

        return res.json({
            success: true,
            user: {
                id: newUserId,
                nombre: nombre.trim(),
                cedula: trimmedCedula,
                email: trimmedEmail,
                telefono,
                rol
            }
        });
    } catch (err) {
        console.error('Admin Registration error:', err);
        return res.status(500).json({ error: 'Error interno al crear el usuario.' });
    }
});

// 4. GET USER PROFILE
router.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [users] = await db.query(
            `SELECT u.*, r.nombre as rol 
             FROM usuarios u 
             LEFT JOIN roles r ON u.id_rol = r.id_rol 
             WHERE u.id_usuario = ? AND u.activo = 1`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado o inactivo' });
        }

        const user = users[0];
        delete user.password;

        return res.json({
            success: true,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                cedula: user.cedula,
                email: user.email,
                telefono: user.telefono,
                telefonoFamiliar: user.telefono_familiar,
                alergias: user.alergias,
                fechaNacimiento: user.fecha_nacimiento,
                rol: user.rol
            }
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;

