const express = require("express");
const app = express();

app.use(express.json());

let orders = [];

app.get("/orders", (req, res) => res.json(orders));

app.post("/orders", (req, res) => {
  orders.push(req.body);
  res.json({ status: "Order created" });
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(3000, () => console.log("Order Service running"));