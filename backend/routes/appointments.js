const express = require('express');
const router = express.Router();
const db = require('../db');
const { crearNotificacion } = require('./notificaciones');

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

        // Mapear al formato requerido por el store del frontend
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
        
        // Buscar usuario por correo electrónico o crear uno temporal si no existe
        const [users] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [trimmedEmail]);
        let userId;
        
        if (users.length > 0) {
            userId = users[0].id_usuario;
        } else {
            // Auto-crear usuario básico (rol = 4 (paciente))
            const [newU] = await db.query(
                `INSERT INTO usuarios (nombre, email, telefono, id_rol, activo) 
                 VALUES (?, ?, ?, 4, 1)`,
                [pacienteNombre.trim(), trimmedEmail, pacienteTelefono.trim()]
            );
            userId = newU.insertId;
        }

        // Buscar o crear la entrada en la tabla pacientes
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

        // Selección de doctor por defecto (buscar el primer usuario con rol 2 (doctor), de lo contrario asignar nulo)
        const [doctors] = await db.query('SELECT id_usuario FROM usuarios WHERE id_rol = 2 LIMIT 1');
        const doctorId = doctors.length > 0 ? doctors[0].id_usuario : null;

        // Combinar fecha y hora
        const datetimeStr = `${fecha.trim()} ${hora.trim()}:00`;

        // --- VALIDACIONES DE NEGOCIO ---

        // 1. Bloquear citas en días específicos: Viernes (5), Sábados (6) y Domingos (0)
        // Obtenemos el día de la semana a partir de la fecha seleccionada.
        const selectedDate = new Date(`${fecha.trim()}T00:00:00`);
        const dayOfWeek = selectedDate.getDay(); // 0=Sun,1=Mon,...,6=Sat
        if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            return res.status(400).json({ error: 'No se pueden agendar citas los viernes, sábados ni domingos.' });
        }

        // 2. Evitar que dos citas se solapen en la misma hora el mismo día.
        // Solo verificamos citas que no estén canceladas (estado != 'cancelada').
        const [sameHour] = await db.query(
            `SELECT id_cita FROM citas 
             WHERE DATE(fecha_hora) = ? AND TIME_FORMAT(fecha_hora, '%H:%i') = ? 
             AND estado != 'cancelada'`,
            [fecha.trim(), hora.trim()]
        );
        if (sameHour.length > 0) {
            return res.status(400).json({ error: `El horario de las ${hora.trim()} ya está ocupado para ese día. Por favor selecciona otra hora.` });
        }

        // 3. Límite máximo de 4 citas por día en la clínica.
        // Contamos todas las citas agendadas para esa fecha que no estén canceladas.
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

        // --- NOTIFICACIONES EN DB ---
        const citaId = result.insertId;
        const dateParts = fecha.trim().split('-');
        const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : fecha.trim();

        // Notificar al paciente
        await crearNotificacion({
            usuarioId: userId,
            citaId,
            asunto: 'Cita agendada',
            mensaje: `Tu cita para ${procedimiento.trim()} el ${formattedDate} a las ${hora.trim()} ha sido agendada con éxito.`,
            icono: 'calendar',
            color: '#e83e8c'
        });

        // Notificar al doctor (si hay uno asignado)
        if (doctorId) {
            await crearNotificacion({
                usuarioId: doctorId,
                citaId,
                asunto: 'Nueva cita (Doctor)',
                mensaje: `El paciente ${pacienteNombre.trim()} ha agendado una cita para ${procedimiento.trim()} el ${formattedDate} a las ${hora.trim()}.`,
                icono: 'medical',
                color: '#2E8B57'
            });
        }

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
        // Obtener detalles de la cita antes de cancelarla
        const [cita] = await db.query(
            `SELECT c.*, p.id_origen as paciente_usuario_id, u.nombre as paciente_nombre
             FROM citas c 
             LEFT JOIN pacientes p ON c.paciente_id = p.id_paciente
             LEFT JOIN usuarios u ON p.id_origen = u.id_usuario
             WHERE c.id_cita = ?`, 
            [id]
        );

        const [result] = await db.query(
            "UPDATE citas SET estado = 'cancelada' WHERE id_cita = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada.' });
        }

        if (cita.length > 0) {
            const appointment = cita[0];
            const dateObj = new Date(appointment.fecha_hora);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
            const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

            if (appointment.paciente_usuario_id) {
                await crearNotificacion({
                    usuarioId: appointment.paciente_usuario_id,
                    citaId: id,
                    asunto: 'Cita cancelada',
                    mensaje: `La cita para ${appointment.motivo} el ${formattedDate} a las ${formattedTime} ha sido cancelada.`,
                    icono: 'close-circle',
                    color: '#F44336'
                });
            }

            if (appointment.doctor_id) {
                await crearNotificacion({
                    usuarioId: appointment.doctor_id,
                    citaId: id,
                    asunto: 'Cita cancelada (Doctor)',
                    mensaje: `La cita del paciente ${appointment.paciente_nombre} para ${appointment.motivo} el ${formattedDate} a las ${formattedTime} ha sido cancelada.`,
                    icono: 'close-circle',
                    color: '#F44336'
                });
            }
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
    console.log(`\n\n--- INICIO DE CONFIRMACIÓN CITA ${id} ---`);

    try {
        // Obtener detalles de la cita
        const [cita] = await db.query(
            `SELECT c.*, p.id_origen as paciente_usuario_id 
             FROM citas c 
             LEFT JOIN pacientes p ON c.paciente_id = p.id_paciente
             WHERE c.id_cita = ?`, 
            [id]
        );
        console.log(`Cita recuperada:`, cita.length > 0 ? 'SÍ' : 'NO');
        if (cita.length > 0) console.log(`Paciente usuario ID: ${cita[0].paciente_usuario_id}`);

        const [result] = await db.query(
            "UPDATE citas SET estado = 'confirmada' WHERE id_cita = ?",
            [id]
        );
        console.log(`Update result: affectedRows=${result.affectedRows}, changedRows=${result.changedRows}`);

        if (result.affectedRows === 0) {
            console.log('Error: Cita no encontrada o affectedRows = 0');
            return res.status(404).json({ error: 'Cita no encontrada.' });
        }

        if (cita.length > 0) {
            console.log('Intentando generar notificación...');
            const appointment = cita[0];
            const dateObj = new Date(appointment.fecha_hora);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
            const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

            if (appointment.paciente_usuario_id) {
                console.log(`Llamando a crearNotificacion para usuario ${appointment.paciente_usuario_id}...`);
                await crearNotificacion({
                    usuarioId: appointment.paciente_usuario_id,
                    citaId: id,
                    asunto: 'Cita confirmada',
                    mensaje: `Tu cita para ${appointment.motivo} el ${formattedDate} a las ${formattedTime} ha sido confirmada por el consultorio.`,
                    icono: 'checkmark-circle',
                    color: '#2E8B57'
                });
                console.log('Notificación creada exitosamente.');
            } else {
                console.log('No hay paciente_usuario_id, no se crea notificación.');
            }
        }

        console.log('Respondiendo OK al cliente.');
        return res.json({ success: true, message: 'La cita ha sido confirmada.' });
    } catch (err) {
        console.error('Error confirming appointment:', err);
        return res.status(500).json({ error: 'Error al confirmar la cita en el servidor.' });
    }
});

module.exports = router;
