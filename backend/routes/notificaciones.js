const express = require('express');
const router = express.Router();
const db = require('../db');

// ─────────────────────────────────────────────
// Helper: crear una notificación en la BD
// (usada internamente por appointments.js también)
// ─────────────────────────────────────────────
async function crearNotificacion({ usuarioId, citaId = null, asunto, mensaje, icono = 'notifications', color = '#e83e8c' }) {
    await db.query(
        `INSERT INTO notificaciones (usuario_id, cita_id, tipo, asunto, mensaje, estado, icono, color, leido)
         VALUES (?, ?, 'sistema', ?, ?, 'enviado', ?, ?, 0)`,
        [usuarioId, citaId, asunto, mensaje, icono, color]
    );
}

module.exports.crearNotificacion = crearNotificacion;

// ─────────────────────────────────────────────
// 1. GET /api/notificaciones/:usuarioId
//    Obtener todas las notificaciones de un usuario
// ─────────────────────────────────────────────
router.get('/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT 
                id_notificacion as id,
                usuario_id,
                cita_id,
                asunto as title,
                mensaje as message,
                icono as icon,
                color,
                leido as \`read\`,
                creado_en
             FROM notificaciones
             WHERE usuario_id = ?
             ORDER BY creado_en DESC
             LIMIT 50`,
            [usuarioId]
        );

        // Formatear tiempo relativo
        const now = new Date();
        const formatted = rows.map(n => {
            const created = new Date(n.creado_en);
            const diffMs = now - created;
            const diffMin = Math.floor(diffMs / 60000);
            const diffH = Math.floor(diffMin / 60);
            const diffD = Math.floor(diffH / 24);

            let time;
            if (diffMin < 1) time = 'Hace un momento';
            else if (diffMin < 60) time = `Hace ${diffMin} min`;
            else if (diffH < 24) time = `Hace ${diffH} h`;
            else if (diffD === 1) time = 'Ayer';
            else time = `Hace ${diffD} días`;

            return {
                id: n.id,
                title: n.title,
                message: n.message,
                icon: n.icon || 'notifications',
                color: n.color || '#e83e8c',
                read: n.read === 1,
                time,
                creado_en: n.creado_en
            };
        });

        const unreadCount = formatted.filter(n => !n.read).length;
        return res.json({ notifications: formatted, unreadCount });
    } catch (err) {
        console.error('Error fetching notificaciones:', err);
        return res.status(500).json({ error: 'Error al obtener notificaciones.' });
    }
});

// ─────────────────────────────────────────────
// 2. PUT /api/notificaciones/:id/read
//    Marcar una notificación como leída
// ─────────────────────────────────────────────
router.put('/:id/read', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE notificaciones SET leido = 1 WHERE id_notificacion = ?', [id]);
        return res.json({ success: true });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        return res.status(500).json({ error: 'Error al marcar notificación.' });
    }
});

// ─────────────────────────────────────────────
// 3. PUT /api/notificaciones/read-all/:usuarioId
//    Marcar todas las notificaciones de un usuario como leídas
// ─────────────────────────────────────────────
router.put('/read-all/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        await db.query('UPDATE notificaciones SET leido = 1 WHERE usuario_id = ?', [usuarioId]);
        return res.json({ success: true });
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
        return res.status(500).json({ error: 'Error al marcar notificaciones.' });
    }
});

module.exports.router = router;
