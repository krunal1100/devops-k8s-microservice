const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/users", (req, res) => {
  const { name } = req.body;
  db.query(
    "INSERT INTO users(name) VALUES (?)",
    [name],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ status: "User created" });
    }
  );
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(3000, () => console.log("User Service running"));
