const mysql = require('mysql');
const config = require('./config').mysql;
const pool = mysql.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  timezone: 'UTC+0'
});

module.exports = pool