const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "Matcha",
  password: "",
});

module.exports = pool.promise();
