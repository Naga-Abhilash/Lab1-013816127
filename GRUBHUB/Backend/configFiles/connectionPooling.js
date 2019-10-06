const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit:100,
    host: 'localhost',
    user: 'root',
    password: '7777',
    database: 'grubhubdb'
});

module.exports = pool;