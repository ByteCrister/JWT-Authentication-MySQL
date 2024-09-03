const mysql = require('mysql2');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student'
});

module.exports =  database ;