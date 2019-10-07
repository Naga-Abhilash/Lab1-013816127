const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit:1000,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'grubhub'
});

module.exports = pool;