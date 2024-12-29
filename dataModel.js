const mysql = require('mysql2/promise');
const { creatSaltHash } = require('./services/passwordEncrypt');

// ฟังก์ชันสำหรับเชื่อมต่อ MySQL
const connectMysql = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3307,
            user: 'root',
            password: 'password',
            database: 'PJ01'
        });
        console.log('Connected to MySQL successfully.');
        return connection;
    } catch (err) {
        console.error('Error connecting to MySQL:', err.message);
        throw err;
    }
};


const initMysql = async () => {
    let connection;
    try {
        connection = await connectMysql();
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                hashpassword VARCHAR(255) NOT NULL,
                salt VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL DEFAULT 'user'
            )    
        `);
        const {salt, hashpassword} = creatSaltHash(process.env.ADMIN_PASSWORD);
        await connection.execute(`
            INSERT INTO users (name, email, hashpassword, salt, role)
            VALUES ('${process.env.ADMIN_NAME}', '${process.env.ADMIN_EMAIL}', '${hashpassword}', '${salt}', 'admin')
            ON DUPLICATE KEY UPDATE
            name = '${process.env.ADMIN_NAME}',
            email = '${process.env.ADMIN_EMAIL}',
            hashpassword = '${hashpassword}',
            salt = '${salt}',
            role = 'admin'`
        );
        console.log('Table "users" has been created or already exists.');
    } catch (err) {
        console.error('Error initializing MySQL:', err.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection to MySQL closed.');
        }
    }
};

module.exports = { connectMysql, initMysql };
