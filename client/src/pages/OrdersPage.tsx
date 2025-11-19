import { useEffect, useState } from "react";

import { fetchOrders } from "../api/orders";
import type { Order } from "../types";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nu pot încărca comenzile");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <section>
      <header>
        <h1>Comenzile mele</h1>
        <p>Urmărește statusul pentru fiecare comandă plasată.</p>
      </header>
      {loading && <p>Se încarcă...</p>}
      {error && <div className="alert">{error}</div>}
      {!loading && orders.length === 0 && <p>Nu ai comenzi de afișat.</p>}
      {!loading && orders.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.slice(0, 8)}...</td>
                <td>{new Date(order.createdAt).toLocaleString("ro-RO")}</td>
                <td>{order.total.toFixed(2)} RON</td>
                <td>
                  <span className="badge">{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default OrdersPage;
