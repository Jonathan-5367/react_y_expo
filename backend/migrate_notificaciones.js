const pool = require('./db');

async function migrate() {
    try {
        console.log('🔧 Migrando tabla notificaciones...\n');

        // Verificar si las columnas ya existen
        const [cols] = await pool.query(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'railway' AND TABLE_NAME = 'notificaciones'
        `);
        const existingCols = cols.map(c => c.COLUMN_NAME);
        console.log('Columnas actuales:', existingCols);

        if (!existingCols.includes('leido')) {
            await pool.query(`ALTER TABLE notificaciones ADD COLUMN leido tinyint(1) NOT NULL DEFAULT 0`);
            console.log('✅ Columna leido agregada');
        } else {
            console.log('⏭️  Columna leido ya existe');
        }

        if (!existingCols.includes('icono')) {
            await pool.query(`ALTER TABLE notificaciones ADD COLUMN icono varchar(50) DEFAULT 'notifications'`);
            console.log('✅ Columna icono agregada');
        } else {
            console.log('⏭️  Columna icono ya existe');
        }

        if (!existingCols.includes('color')) {
            await pool.query(`ALTER TABLE notificaciones ADD COLUMN color varchar(20) DEFAULT '#e83e8c'`);
            console.log('✅ Columna color agregada');
        } else {
            console.log('⏭️  Columna color ya existe');
        }

        // Verificar estructura final
        const [finalCols] = await pool.query(`SHOW COLUMNS FROM notificaciones`);
        console.log('\n📋 Estructura final de notificaciones:');
        finalCols.forEach(c => console.log(`  - ${c.Field} (${c.Type}) default: ${c.Default}`));

        console.log('\n🎉 Migración completada exitosamente!');
    } catch (e) {
        console.error('❌ Error en migración:', e.message);
    }
    process.exit(0);
}

migrate();
