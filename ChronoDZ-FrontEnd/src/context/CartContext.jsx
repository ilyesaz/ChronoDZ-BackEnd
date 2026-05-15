import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { cartApi } from "../services/api.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => cartApi.get());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    cartApi.save(cart);
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const exists = prev.find((l) => l.productId === product.id);
      return exists
        ? prev.map((l) =>
            l.productId === product.id ? { ...l, qty: l.qty + 1 } : l
          )
        : [...prev, { productId: product.id, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, qty } : l))
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    cartApi.clear();
  }, []);

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}