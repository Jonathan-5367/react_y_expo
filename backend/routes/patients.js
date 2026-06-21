const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL PATIENTS FOR ADMIN
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                u.id_usuario as id,
                u.nombre as name,
                u.cedula,
                u.telefono as phone,
                u.fecha_nacimiento as fechaNacimiento,
                COALESCE(TIMESTAMPDIFF(YEAR, u.fecha_nacimiento, CURDATE()), 0) as age,
                (SELECT DATE_FORMAT(MAX(fecha_hora), '%d %b %Y') 
                 FROM citas 
                 WHERE paciente_id = p.id_paciente AND estado != 'cancelada') as lastVisit
             FROM pacientes p
             JOIN usuarios u ON p.id_origen = u.id_usuario
             WHERE u.activo = 1`
        );

        // Map and clean response
        const patients = rows.map(p => ({
            id: String(p.id),
            name: p.name || 'Sin Nombre',
            cedula: p.cedula || 'N/A',
            phone: p.phone || 'N/A',
            age: p.age,
            lastVisit: p.lastVisit || 'Sin citas'
        }));

        return res.json(patients);
    } catch (err) {
        console.error('Error fetching patients:', err);
        return res.status(500).json({ error: 'Error al obtener el listado de pacientes.' });
    }
});
// GET PATIENT MEDICAL HISTORY (APPOINTMENTS)
router.get('/:id/history', async (req, res) => {
    const { id } = req.params;
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
             JOIN pacientes p ON c.paciente_id = p.id_paciente
             JOIN usuarios u_p ON p.id_origen = u_p.id_usuario
             LEFT JOIN usuarios u_d ON c.doctor_id = u_d.id_usuario
             WHERE p.id_origen = ?
             ORDER BY c.fecha_hora DESC`,
            [id]
        );

        const history = rows.map(item => {
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

        return res.json(history);
    } catch (err) {
        console.error('Error fetching patient history:', err);
        return res.status(500).json({ error: 'Error al obtener el historial del paciente.' });
    }
});

module.exports = router;
