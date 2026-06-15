const mysql = require('mysql2');
require('dotenv').config();

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


// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Successfully connected to MySQL database via XAMPP.');
        connection.release();
    }
});

module.exports = pool.promise();
