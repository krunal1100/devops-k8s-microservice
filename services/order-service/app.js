const express = require("express");
const app = express();

app.get("/orders", (req, res) => {
  res.json({ status: "Order Service OK" });
});

app.listen(3000, () => {
  console.log("Order Service running on port 3000");
});
