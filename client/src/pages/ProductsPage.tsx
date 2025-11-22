import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { listProducts } from "../api/products";
import { addCartItem } from "../api/cart";
import type { Product } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { resolveImageUrl } from "../utils/image";

const currency = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "RON",
});

const ProductsPage = () => {
  const { user } = useAuth();
  const { refreshCart } = useCart();
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
      await refreshCart();
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
          <article className="card product-card" key={product.id}>
            <Link to={`/products/${product.id}`} className="product-card__image" aria-label={`Vezi ${product.name}`}>
              <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
            </Link>
            <div>
              <h3>{product.name}</h3>
              {product.category && <small className="badge">{product.category}</small>}
            </div>
            <p>{product.description}</p>
            <p>
              <strong>{currency.format(product.price)}</strong>
            </p>
            <div className="product-card__actions">
              <Link to={`/products/${product.id}`} className="outline-btn">
                Vezi detalii
              </Link>
              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={!user || addingProductId === product.id}
              >
                {!user ? "Autentifică-te" : addingProductId === product.id ? "Se adaugă..." : "Adaugă în coș"}
              </button>
            </div>
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
