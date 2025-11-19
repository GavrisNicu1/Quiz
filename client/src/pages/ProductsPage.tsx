import { useEffect, useMemo, useState } from "react";

import { listProducts } from "../api/products";
import { addCartItem } from "../api/cart";
import type { Product } from "../types";
import { useAuth } from "../hooks/useAuth";

const currency = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "RON",
});

const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const response = await listProducts();
        setProducts(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nu pot încărca produsele");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      setError("Trebuie să fii autentificat pentru a adăuga în coș");
      return;
    }
    try {
      setAddingProductId(productId);
      await addCartItem({ productId, quantity: 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu s-a putut adăuga produsul");
    } finally {
      setAddingProductId(null);
    }
  };

  const content = useMemo(() => {
    if (loading) {
      return <p>Se încarcă lista de produse...</p>;
    }
    if (error) {
      return <div className="alert">{error}</div>;
    }
    if (products.length === 0) {
      return <p>Nu există produse în catalog în acest moment.</p>;
    }
    return (
      <div className="card-grid">
        {products.map((product) => (
          <article className="card" key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>
              <strong>{currency.format(product.price)}</strong>
            </p>
            <button
              onClick={() => handleAddToCart(product.id)}
              disabled={!user || addingProductId === product.id}
            >
              {!user ? "Autentifică-te" : addingProductId === product.id ? "Se adaugă..." : "Adaugă în coș"}
            </button>
          </article>
        ))}
      </div>
    );
  }, [addingProductId, error, loading, products, user]);

  return (
    <section>
      <header>
        <h1>Produsele disponibile</h1>
        <p>Adaugă rapid în coș orice produs din catalog.</p>
      </header>
      {content}
    </section>
  );
};

export default ProductsPage;
