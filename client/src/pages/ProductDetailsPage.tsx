import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProduct } from "../api/products";
import { addCartItem } from "../api/cart";
import type { Product } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { resolveImageUrl } from "../utils/image";

const currency = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "RON",
});

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Produsul nu există");
      setLoading(false);
      return;
    }
    const load = async () => {
      setError(null);
      try {
        const response = await getProduct(id);
        setProduct(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nu pot încărca produsul");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setError("Trebuie să fii autentificat pentru a adăuga produsul în coș");
      navigate("/login");
      return;
    }
    if (!product) {
      return;
    }
    try {
      setAdding(true);
      await addCartItem({ productId: product.id, quantity: 1 });
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu se poate adăuga produsul în coș");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p>Se încarcă detaliile...</p>;
  }

  if (error) {
    return (
      <section>
        <p className="alert">{error}</p>
        <Link to="/" className="secondary-btn">
          Înapoi la produse
        </Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section>
        <p>Produsul nu a fost găsit.</p>
        <Link to="/" className="secondary-btn">
          Înapoi la produse
        </Link>
      </section>
    );
  }

  return (
    <section>
      <header style={{ marginBottom: "1.5rem" }}>
        <Link to="/" className="secondary-btn" style={{ marginBottom: "1rem", display: "inline-block" }}>
          ← Înapoi la produse
        </Link>
        <h1>{product.name}</h1>
        <p>{product.category}</p>
      </header>

      <div className="product-details">
        <div className="product-details__image">
          <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
        </div>
        <div className="product-details__info">
          <p>{product.description}</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{currency.format(product.price)}</p>
          <p>Stoc disponibil: {product.stock}</p>
          <button className="primary-btn" onClick={handleAddToCart} disabled={adding}>
            {adding ? "Se adaugă..." : "Adaugă în coș"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
