const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '192.168.99.133', // ip of docker machine
    // port: '3306',
    user: 'root',
    database: 'Matcha',
    password: 'tiger'
});

module.exports = pool.promise();