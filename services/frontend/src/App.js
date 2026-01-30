import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetch("/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));

    fetch("/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Microservices Dashboard</h1>

      <section>
        <h2>User Service</h2>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </section>

      <section>
        <h2>Order Service</h2>
        <pre>{JSON.stringify(orders, null, 2)}</pre>
      </section>
    </div>
  );
}

export default App;