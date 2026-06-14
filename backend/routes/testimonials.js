const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL TESTIMONIALS
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                t.id_testimonio as id,
                u.nombre as author,
                t.contenido as text,
                t.calificacion as rating,
                DATE_FORMAT(t.creado_en, '%Y-%m-%d') as date
             FROM testimonios t
             LEFT JOIN usuarios u ON t.usuario_id = u.id_usuario
             ORDER BY t.creado_en DESC`
        );

        return res.json(rows);
    } catch (err) {
        // If table doesn't exist yet, return empty array instead of crashing
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return res.json([]);
        }
        console.error('Error fetching testimonials:', err);
        return res.status(500).json({ error: 'Error al obtener los testimonios.' });
    }
});

// CREATE A TESTIMONIAL
router.post('/', async (req, res) => {
    const { usuario_id, contenido, calificacion } = req.body;

    if (!usuario_id || !contenido) {
        return res.status(400).json({ error: 'El contenido del testimonio es obligatorio.' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO testimonios (usuario_id, contenido, calificacion, creado_en)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
            [usuario_id, contenido.trim(), calificacion || 5]
        );

        return res.json({
            success: true,
            testimonial: {
                id: result.insertId,
                usuario_id,
                contenido: contenido.trim(),
                calificacion: calificacion || 5
            }
        });
    } catch (err) {
        console.error('Error creating testimonial:', err);
        return res.status(500).json({ error: 'Error al crear el testimonio.' });
    }
});

module.exports = router;
