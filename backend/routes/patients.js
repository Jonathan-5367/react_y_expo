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
                 WHERE paciente_id = p.id_paciente AND estado = 'completada') as lastVisit
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

module.exports = router;
