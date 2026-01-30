const express = require("express");
const mysql = require("mysql2");

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.get("/users", (req, res) => {
  db.query("SELECT 'User Service OK' AS status", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("User Service running on port 3000");
});
