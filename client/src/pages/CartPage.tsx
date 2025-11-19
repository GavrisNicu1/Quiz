import { useEffect, useMemo, useState } from "react";

import { fetchCart, updateCartItem, removeCartItem, clearCart } from "../api/cart";
import { checkoutOrder } from "../api/orders";
import type { CartItem } from "../types";

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState("Strada Exemplu 10, București");
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const loadCart = async () => {
    setError(null);
    try {
      const data = await fetchCart();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot încărca coșul");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const updated = await updateCartItem(itemId, { quantity });
      setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot actualiza cantitatea");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot elimina produsul");
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      setError("Completează adresa de livrare");
      return;
    }
    try {
      setIsCheckingOut(true);
      setCheckoutMessage(null);
      await checkoutOrder({ shippingAddress });
      setCheckoutMessage("Comanda a fost trimisă!");
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot finaliza comanda");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot goli coșul");
    }
  };

  return (
    <section>
      <header>
        <h1>Coșul meu</h1>
        <p>Revizuiește produsele înainte de a finaliza comanda.</p>
      </header>
      {loading && <p>Se încarcă coșul...</p>}
      {error && <div className="alert">{error}</div>}
      {!loading && items.length === 0 && <p>Nu ai produse în coș momentan.</p>}
      {!loading && items.length > 0 && (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>Cantitate</th>
                <th>Pret</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.product.name}</strong>
                    <div>{item.product.description}</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    />
                  </td>
                  <td>{(item.product.price * item.quantity).toFixed(2)} RON</td>
                  <td>
                    <button className="secondary-btn" onClick={() => handleRemove(item.id)}>
                      Șterge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label>
              Adresă livrare
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </label>
            <p>
              <strong>Total: {subtotal.toFixed(2)} RON</strong>
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="primary-btn" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? "Se procesează..." : "Finalizează comanda"}
              </button>
              <button className="secondary-btn" onClick={handleClear}>
                Golește coșul
              </button>
            </div>
            {checkoutMessage && <div className="success">{checkoutMessage}</div>}
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;
