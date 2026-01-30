import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [username, setUsername] = useState("");

  const loadData = () => {
    fetch("/users").then(r => r.json()).then(setUsers);
    fetch("/orders").then(r => r.json()).then(setOrders);
  };

  useEffect(loadData, []);

  const createUser = () => {
    fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username })
    }).then(loadData);
  };

  const createOrder = () => {
    fetch("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: "Sample Order" })
    }).then(loadData);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Microservices Dashboard</h1>

      <h2>Users</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="User name"
      />
      <button onClick={createUser}>Add User</button>
      <pre>{JSON.stringify(users, null, 2)}</pre>

      <h2>Orders</h2>
      <button onClick={createOrder}>Add Order</button>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
}

export default App;
