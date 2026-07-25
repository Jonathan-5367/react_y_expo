const mysql = require('mysql2');
require('dotenv').config();

<<<<<<< Updated upstream
const pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'consultorio_dental',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
=======
// Railway environment variable check
let connectionString = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.DB_URL;

// Use public URL if we are running locally (no RAILWAY_ENVIRONMENT) and MYSQL_PUBLIC_URL is provided
if (!process.env.RAILWAY_ENVIRONMENT && process.env.MYSQL_PUBLIC_URL) {
    connectionString = process.env.MYSQL_PUBLIC_URL;
}

let pool;

if (connectionString) {
    // Strip trailing /api or / if it was appended by mistake in .env
    if (connectionString.endsWith('/api')) {
        connectionString = connectionString.slice(0, -4);
    }
    if (connectionString.endsWith('/')) {
        connectionString = connectionString.slice(0, -1);
    }

    if (connectionString.includes('.internal') && !process.env.RAILWAY_ENVIRONMENT) {
        console.warn('⚠️ WARNING: You are trying to connect to a Railway internal host (.internal) from your local machine. This will likely fail. Use the public URL (MYSQL_PUBLIC_URL) instead.');
    }

    console.log('Connecting to MySQL using connection URL...');
    pool = mysql.createPool(connectionString);
} else {
    console.log('Connecting to MySQL using individual variables...');
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'consultorio_dental',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}
>>>>>>> Stashed changes


// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Successfully connected to the MySQL database.');
        connection.release();
    }
});

module.exports = pool.promise();
