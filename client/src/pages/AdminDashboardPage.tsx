import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { listProducts, createProduct, deleteProduct, updateProduct } from "../api/products";
import { fetchOrders, updateOrderStatus } from "../api/orders";
import { uploadProductImage } from "../api/upload";
import { fetchAdminStats } from "../api/admin";
import type { AdminStats, Order, Product } from "../types";
import { resolveImageUrl } from "../utils/image";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: string;
}

const DEFAULT_IMAGE = "https://placehold.co/400x300";
const DEFAULT_FORM_VALUES: ProductForm = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrl: DEFAULT_IMAGE,
  category: "",
};

const AdminDashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<ProductForm>({
    defaultValues: { ...DEFAULT_FORM_VALUES },
  });
  const imageUrlValue = watch("imageUrl");
  const isEditing = Boolean(editingProductId);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productList, orderList, statsData] = await Promise.all([
        listProducts(),
        fetchOrders(),
        fetchAdminStats(),
      ]);
      setProducts(productList);
      setOrders(orderList);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot încărca datele");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => {
    reset({ ...DEFAULT_FORM_VALUES });
    setEditingProductId(null);
  };

  const parsePayload = (values: ProductForm) => ({
    ...values,
    price: Number(values.price),
    stock: Number(values.stock),
    category: values.category?.trim() ? values.category.trim() : undefined,
  });

  const onSubmitProduct = async (values: ProductForm) => {
    try {
      const payload = parsePayload(values);
      if (isEditing && editingProductId) {
        const updated = await updateProduct(editingProductId, payload);
        setProducts((prev) => prev.map((product) => (product.id === updated.id ? updated : product)));
      } else {
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot salva produsul");
    }
  };

  const onDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      if (editingProductId === id) {
        resetForm();
      }
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

  const onEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      category: product.category ?? "",
    });
  };

  const onCancelEdit = () => {
    resetForm();
  };

  const onImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadProductImage(file);
      setValue("imageUrl", imageUrl, { shouldDirty: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot încărca imaginea");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
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

      {stats && (
        <div className="card-grid" style={{ marginBottom: "2rem" }}>
          <div className="card">
            <h4>Comenzi astăzi</h4>
            <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.ordersToday}</p>
          </div>
          <div className="card">
            <h4>Venit total</h4>
            <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.totalRevenue.toFixed(2)} RON</p>
          </div>
          <div className="card">
            <h4>Comenzi de pregătit</h4>
            <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.pendingProcessingCount}</p>
          </div>
          <div className="card">
            <h4>Comenzi livrate (total)</h4>
            <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.deliveredCount}</p>
          </div>
          <div className="card">
            <h4>Produse cu stoc redus</h4>
            <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.lowStockCount}</p>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>{isEditing ? "Editează produs" : "Adaugă produs"}</h3>
        <form onSubmit={handleSubmit(onSubmitProduct)}>
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
            <input
              type="number"
              step="0.01"
              {...register("price", { required: true, min: 0, valueAsNumber: true })}
            />
          </label>
          <label>
            Stoc
            <input type="number" {...register("stock", { required: true, min: 0, valueAsNumber: true })} />
          </label>
          <label>
            Categorie
            <input type="text" placeholder="ex: Electronice" {...register("category")} />
          </label>
          <label>
            Imagine (URL)
            <input type="url" {...register("imageUrl", { required: true })} />
          </label>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>sau încarcă o imagine din PC</p>
            <label
              htmlFor="product-image-upload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0d6efd",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                borderRadius: "999px",
                cursor: uploadingImage ? "not-allowed" : "pointer",
                opacity: uploadingImage ? 0.7 : 1,
                fontWeight: 600,
              }}
            >
              {uploadingImage ? "Se încarcă..." : "Încarcă din calculator"}
            </label>
            <input
              id="product-image-upload"
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              disabled={uploadingImage}
              style={{ display: "none" }}
            />
          </div>
          {imageUrlValue && (
            <div style={{ marginBottom: "1rem" }}>
              <small>Previzualizare:</small>
              <div>
                <img src={resolveImageUrl(imageUrlValue)} alt="previzualizare produs" style={{ maxWidth: "200px" }} />
              </div>
            </div>
          )}
          <button className="primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Se salvează..." : isEditing ? "Actualizează produs" : "Creează produs"}
          </button>
          {isEditing && (
            <button className="secondary-btn" type="button" onClick={onCancelEdit} style={{ marginLeft: "1rem" }}>
              Anulează editarea
            </button>
          )}
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
                      {product.category ? ` (${product.category})` : ""}
                    </span>
                    <span>
                      <button className="secondary-btn" style={{ marginRight: "0.5rem" }} onClick={() => onEditProduct(product)}>
                        Editează
                      </button>
                      <button className="secondary-btn" onClick={() => onDeleteProduct(product.id)}>
                        Șterge
                      </button>
                    </span>
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
