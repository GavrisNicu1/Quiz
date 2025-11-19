import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { listProducts, createProduct, deleteProduct } from "../api/products";
import { fetchOrders, updateOrderStatus } from "../api/orders";
import type { Order, Product } from "../types";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

const AdminDashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductForm>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "https://placehold.co/400x300",
    },
  });

  const loadData = async () => {
    setError(null);
    try {
      const [productList, orderList] = await Promise.all([listProducts(), fetchOrders()]);
      setProducts(productList);
      setOrders(orderList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot încărca datele");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const onCreateProduct = async (values: ProductForm) => {
    try {
      const product = await createProduct(values);
      setProducts((prev) => [product, ...prev]);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot crea produsul");
    }
  };

  const onDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot șterge produsul");
    }
  };

  const onStatusChange = async (orderId: string, status: string) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot actualiza statusul");
    }
  };

  return (
    <section>
      <header>
        <h1>Panou administrator</h1>
        <p>Administrează catalogul și comenzile în timp real.</p>
      </header>
      {loading && <p>Se încarcă datele...</p>}
      {error && <div className="alert">{error}</div>}

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Adaugă produs</h3>
        <form onSubmit={handleSubmit(onCreateProduct)}>
          <label>
            Nume
            <input type="text" {...register("name", { required: true })} />
          </label>
          <label>
            Descriere
            <textarea {...register("description", { required: true })} rows={3} />
          </label>
          <label>
            Preț (RON)
            <input type="number" step="0.01" {...register("price", { required: true, min: 0 })} />
          </label>
          <label>
            Stoc
            <input type="number" {...register("stock", { required: true, min: 0 })} />
          </label>
          <label>
            Imagine (URL)
            <input type="url" {...register("imageUrl", { required: true })} />
          </label>
          <button className="primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Se salvează..." : "Creează produs"}
          </button>
        </form>
      </div>

      {!loading && (
        <div className="card-grid">
          <div className="card">
            <h3>Produse existente</h3>
            {products.length === 0 ? (
              <p>Nu există produse în catalog.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {products.map((product) => (
                  <li
                    key={product.id}
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}
                  >
                    <span>
                      {product.name} – {product.price.toFixed(2)} RON
                    </span>
                    <button className="secondary-btn" onClick={() => onDeleteProduct(product.id)}>
                      Șterge
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3>Comenzi</h3>
            {orders.length === 0 ? (
              <p>Nu există comenzi.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id.slice(0, 8)}...</td>
                      <td>{order.total.toFixed(2)} RON</td>
                      <td>
                        <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value)}>
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboardPage;
