const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. GET ALL APPOINTMENTS
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                c.id_cita as id,
                u_p.nombre as pacienteNombre,
                u_p.telefono as pacienteTelefono,
                u_p.email as pacienteEmail,
                DATE_FORMAT(c.fecha_hora, '%Y-%m-%d') as fecha,
                TIME_FORMAT(c.fecha_hora, '%H:%i') as hora,
                c.motivo as procedimiento,
                COALESCE(u_d.nombre, 'Dra. Nazaret Lopez') as doctor,
                c.estado
             FROM citas c
             LEFT JOIN pacientes p ON c.paciente_id = p.id_paciente
             LEFT JOIN usuarios u_p ON p.id_origen = u_p.id_usuario
             LEFT JOIN usuarios u_d ON c.doctor_id = u_d.id_usuario
             ORDER BY c.fecha_hora DESC`
        );

        // Map to format required by the frontend store
        const appointments = rows.map(item => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isPast = item.fecha < todayStr;
            return {
                id: item.id,
                pacienteNombre: item.pacienteNombre || 'Desconocido',
                pacienteTelefono: item.pacienteTelefono || '',
                pacienteEmail: item.pacienteEmail || '',
                fecha: item.fecha,
                hora: item.hora,
                procedimiento: item.procedimiento || 'Consulta General',
                doctor: item.doctor,
                estado: item.estado || 'pendiente',
                pasada: isPast
            };
        });

        return res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        return res.status(500).json({ error: 'Error al obtener las citas' });
    }
});

// 2. CREATE AN APPOINTMENT
router.post('/', async (req, res) => {
    const { pacienteNombre, pacienteTelefono, pacienteEmail, fecha, hora, procedimiento } = req.body;

    if (!pacienteNombre || !pacienteTelefono || !pacienteEmail || !fecha || !hora || !procedimiento) {
        return res.status(400).json({ error: 'Todos los campos son requeridos para agendar la cita.' });
    }

    try {
        const trimmedEmail = pacienteEmail.trim().toLowerCase();
        
        // Find user by email or create a skeleton one if it doesn't exist
        const [users] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [trimmedEmail]);
        let userId;
        
        if (users.length > 0) {
            userId = users[0].id_usuario;
        } else {
            // Auto-create skeleton user (role = 4 (paciente))
            const [newU] = await db.query(
                `INSERT INTO usuarios (nombre, email, telefono, id_rol, activo) 
                 VALUES (?, ?, ?, 4, 1)`,
                [pacienteNombre.trim(), trimmedEmail, pacienteTelefono.trim()]
            );
            userId = newU.insertId;
        }

        // Find or create patient entry
        const [patients] = await db.query('SELECT id_paciente FROM pacientes WHERE id_origen = ?', [userId]);
        let patientId;
        
        if (patients.length > 0) {
            patientId = patients[0].id_paciente;
        } else {
            const [newP] = await db.query(
                'INSERT INTO pacientes (tipo, id_origen) VALUES (?, ?)',
                ['adulto', userId]
            );
            patientId = newP.insertId;
        }

        // Default doctor selection (find first user with role 2 (doctor), otherwise default to null)
        const [doctors] = await db.query('SELECT id_usuario FROM usuarios WHERE id_rol = 2 LIMIT 1');
        const doctorId = doctors.length > 0 ? doctors[0].id_usuario : null;

        // Combine date and time
        const datetimeStr = `${fecha.trim()} ${hora.trim()}:00`;

        // --- VALIDATIONS ---

        // 1. Block Fridays (5), Saturdays (6) and Sundays (0)
        const selectedDate = new Date(`${fecha.trim()}T00:00:00`);
        const dayOfWeek = selectedDate.getDay(); // 0=Sun,1=Mon,...,6=Sat
        if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            return res.status(400).json({ error: 'No se pueden agendar citas los viernes, sábados ni domingos.' });
        }

        // 2. Check same-hour conflict (only non-cancelled appointments)
        const [sameHour] = await db.query(
            `SELECT id_cita FROM citas 
             WHERE DATE(fecha_hora) = ? AND TIME_FORMAT(fecha_hora, '%H:%i') = ? 
             AND estado != 'cancelada'`,
            [fecha.trim(), hora.trim()]
        );
        if (sameHour.length > 0) {
            return res.status(400).json({ error: `El horario de las ${hora.trim()} ya está ocupado para ese día. Por favor selecciona otra hora.` });
        }

        // 3. Max 4 appointments per day (non-cancelled)
        const [dayCount] = await db.query(
            `SELECT COUNT(*) as total FROM citas 
             WHERE DATE(fecha_hora) = ? AND estado != 'cancelada'`,
            [fecha.trim()]
        );
        if (dayCount[0].total >= 4) {
            return res.status(400).json({ error: 'El día seleccionado ya tiene el máximo de 4 citas. Por favor escoge otro día.' });
        }

        const [result] = await db.query(
            `INSERT INTO citas (paciente_id, doctor_id, fecha_hora, motivo, estado, creado_por, creado_en) 
             VALUES (?, ?, ?, ?, 'pendiente', ?, CURRENT_TIMESTAMP)`,
            [patientId, doctorId, datetimeStr, procedimiento.trim(), userId]
        );

        const todayStr = new Date().toISOString().split('T')[0];

        return res.json({
            success: true,
            appointment: {
                id: result.insertId,
                pacienteNombre: pacienteNombre.trim(),
                pacienteTelefono: pacienteTelefono.trim(),
                pacienteEmail: trimmedEmail,
                fecha: fecha.trim(),
                hora: hora.trim(),
                procedimiento: procedimiento.trim(),
                doctor: 'Dra. Nazaret Lopez',
                estado: 'pendiente',
                pasada: fecha.trim() < todayStr
            }
        });
    } catch (err) {
        console.error('Error creating appointment:', err);
        return res.status(500).json({ error: 'Error al agendar la cita en el servidor.' });
    }
});

// 3. CANCEL APPOINTMENT
router.put('/:id/cancel', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            "UPDATE citas SET estado = 'cancelada' WHERE id_cita = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada.' });
        }

        return res.json({ success: true, message: 'La cita ha sido cancelada.' });
    } catch (err) {
        console.error('Error canceling appointment:', err);
        return res.status(500).json({ error: 'Error al cancelar la cita en el servidor.' });
    }
});

// 4. CONFIRM APPOINTMENT
router.put('/:id/confirm', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            "UPDATE citas SET estado = 'confirmada' WHERE id_cita = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada.' });
        }

        return res.json({ success: true, message: 'La cita ha sido confirmada.' });
    } catch (err) {
        console.error('Error confirming appointment:', err);
        return res.status(500).json({ error: 'Error al confirmar la cita en el servidor.' });
    }
});

module.exports = router;
