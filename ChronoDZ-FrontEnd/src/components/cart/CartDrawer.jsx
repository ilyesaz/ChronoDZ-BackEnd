import { cx, money } from "../../utils/helpers.js";
import { useCart } from "../../context/CartContext.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";

export default function CartDrawer({ onCheckout }) {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem } = useCart();
  const { products } = useApp();
  const { session, openAuth } = useAuth();

  const detailed = cart.map((l) => {
    const p = products.find((pr) => pr.id === l.productId);
    return p ? { ...p, qty: l.qty } : null;
  }).filter(Boolean);

  const subtotal = detailed.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)} />
      )}
      <aside className={cx(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-line bg-white shadow-soft transition-transform duration-300",
        cartOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Panier</h3>
            <p className="text-sm text-slate-400">{detailed.length} article(s)</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setCartOpen(false)}>✕</Button>
        </div>

        <div className="flex-1 space-y-4 overflow-auto p-5">
          {detailed.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <p className="text-4xl mb-4">🛒</p>
              <p className="font-medium">Votre panier est vide.</p>
              <p className="mt-1 text-sm">Ajoutez des montres depuis le catalogue.</p>
            </div>
          ) : (
            detailed.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-3xl border border-line p-4">
                <img src={item.image} alt={item.model} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">{item.brand} {item.model}</p>
                  <p className="text-sm text-slate-400">{money(item.price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-line text-slate-700 hover:bg-slate-50">-</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-line text-slate-700 hover:bg-slate-50">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="text-xs text-rose-500 hover:text-rose-700">Supprimer</button>
                  <p className="font-bold text-slate-900">{money(item.qty * item.price)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="shrink-0 border-t border-line p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Sous-total</span>
            <span className="text-xl font-black text-slate-900">{money(subtotal)}</span>
          </div>
          <Button className="w-full justify-center" size="lg"
            disabled={detailed.length === 0}
            onClick={() => {
              if (!session) { setCartOpen(false); openAuth("login"); return; }
              setCartOpen(false); onCheckout();
            }}>
            Commander →
          </Button>
        </div>
      </aside>
    </>
  );
}