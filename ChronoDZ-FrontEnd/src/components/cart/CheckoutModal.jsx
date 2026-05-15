import { useState, useEffect } from "react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Textarea from "../ui/Textarea.jsx";
import Button from "../ui/Button.jsx";
import { money } from "../../utils/helpers.js";
import { useCart } from "../../context/CartContext.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function CheckoutModal({ open, onClose }) {
  const { cart, clearCart } = useCart();
  const { products, placeOrder, user } = useApp();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    shipping: "insured",
    payment: "cash",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        phone: user.phone || "",
        city: user.city || "",
      }));
    }
  }, [user]);

  const detailed = cart
    .map((l) => {
      const p = products.find((pr) => pr.id === l.productId);
      return p ? { ...p, qty: l.qty } : null;
    })
    .filter(Boolean);

  const subtotal = detailed.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee = form.shipping === "insured" ? 3500 : 1800;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await placeOrder({
        customerData: { ...form },
        items: detailed,
        subtotal,
        shippingFee,
        total,
        userId: user?.id || null,
        paymentLabel: {
          cash: "Paiement à la livraison",
          card: "Carte bancaire",
          bank: "Virement",
        }[form.payment],
        shippingLabel:
          form.shipping === "insured"
            ? "Livraison assurée"
            : "Livraison standard",
      });

      clearCart();
      onClose();
      alert("✅ Commande confirmée ! Retrouve-la dans ton espace commandes.");
    } catch (error) {
      console.error("Erreur checkout :", error);
      alert("❌ Impossible de confirmer la commande.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Finaliser la commande" wide>
      <form className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Informations de livraison</h3>

          <Input
            label="Nom complet"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Téléphone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Ville"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <Input
            label="Adresse complète"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <Select
            label="Mode de livraison"
            value={form.shipping}
            onChange={(e) => setForm({ ...form, shipping: e.target.value })}
            options={[
              { value: "insured", label: "🛡️ Livraison assurée — 3 500 DZD" },
              { value: "standard", label: "📦 Livraison standard — 1 800 DZD" },
            ]}
          />

          <Select
            label="Mode de paiement"
            value={form.payment}
            onChange={(e) => setForm({ ...form, payment: e.target.value })}
            options={[
              { value: "cash", label: "💵 Paiement à la livraison" },
              { value: "card", label: "💳 Carte bancaire (démo)" },
              { value: "bank", label: "🏦 Virement bancaire (démo)" },
            ]}
          />

          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Instructions spéciales..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Récapitulatif</h3>

          <div className="space-y-3 rounded-3xl border border-line p-4">
            {detailed.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.model}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {item.brand} {item.model}
                  </p>
                  <p className="text-xs text-slate-400">Qté {item.qty}</p>
                </div>
                <p className="text-sm font-semibold">{money(item.qty * item.price)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <p className="font-bold text-emerald-800">🛡️ Protection achat</p>
            <p className="mt-2">
              Livraison suivie et assurée disponible. Commande traçable dans ton espace.
            </p>
          </div>

          <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Sous-total</span>
              <span className="font-semibold">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Livraison</span>
              <span className="font-semibold">{money(shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-slate-900">{money(total)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full justify-center" size="lg">
            ✅ Confirmer la commande
          </Button>
        </div>
      </form>
    </Modal>
  );
}