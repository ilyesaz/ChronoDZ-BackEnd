import { useApp } from "../context/AppContext.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import { money, formatDate } from "../utils/helpers.js";
import { Link } from "react-router-dom";

const STATUS_TONES = {
  "En attente": "amber",
  Confirmée: "green",
  Expédiée: "blue",
  Livrée: "green",
  Annulée: "red",
};

export default function OrdersPage() {
  const { user, orders, updateOrderStatus } = useApp();

  const isAdmin = user?.role === "admin";
  const myOrders = isAdmin ? orders : orders.filter((o) => o.userId === user?.id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-4xl border border-line bg-white p-16 text-center">
        <p className="mb-5 text-5xl">📦</p>
        <h2 className="text-2xl font-black text-slate-900">Connexion requise</h2>
        <p className="mt-3 text-slate-400">Connecte-toi pour voir tes commandes.</p>
        <Link to="/">
          <Button className="mt-6">Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900">📦 Commandes</h1>
        <p className="mt-2 text-slate-400">
          {myOrders.length} commande(s) {isAdmin ? "totales" : "à ton nom"}.
        </p>
      </div>

      {myOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-line bg-white p-16 text-center">
          <p className="mb-4 text-5xl">📭</p>
          <p className="text-lg font-bold text-slate-900">Aucune commande</p>
          <Link to="/">
            <Button className="mt-5">Aller au catalogue</Button>
          </Link>
        </div>
      ) : (
        myOrders.map((order) => (
          <div key={order.id} className="space-y-5 rounded-4xl border border-line bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  Commande #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-slate-400">
                  {formatDate(order.createdAt)} · {order.customer?.city || order.customerData?.city || "Ville inconnue"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {order.paymentLabel && <Badge tone="blue">{order.paymentLabel}</Badge>}
                {order.shippingLabel && <Badge tone="amber">{order.shippingLabel}</Badge>}
                <Badge tone={STATUS_TONES[order.status] || "gray"}>{order.status}</Badge>

                {isAdmin && order.status === "En attente" && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => updateOrderStatus(order.id, "Confirmée")}
                  >
                    Confirmer
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr,0.5fr]">
              <div className="space-y-3">
                {(order.items || []).map((item, index) => (
                  <div key={item.id || index} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <img
                      src={item.image}
                      alt={item.model}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900">
                        {item.brand} {item.model}
                      </p>
                      <p className="text-sm text-slate-400">
                        Qté {item.qty} · {money(item.price)}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">{money(item.qty * item.price)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 self-start rounded-3xl bg-slate-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Sous-total</span>
                  <span className="font-semibold">{money(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Livraison</span>
                  <span className="font-semibold">{money(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 font-bold">
                  <span>Total</span>
                  <span className="text-lg text-slate-900">{money(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}