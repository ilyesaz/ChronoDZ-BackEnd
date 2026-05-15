import { useApp } from "../context/AppContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import { money, formatDate } from "../utils/helpers.js";
import { Navigate } from "react-router-dom";

const STATUS_TONES = {
  "En attente": "amber",
  Confirmée: "green",
  Expédiée: "blue",
  Livrée: "green",
  Annulée: "red",
};

const ROLE_TONES = {
  admin: "red",
  seller: "blue",
  buyer: "gray",
};

const ROLE_LABELS = {
  admin: "Admin",
  seller: "Vendeur",
  buyer: "Acheteur",
};

export default function AdminPage() {
  const {
    user,
    users,
    products,
    orders,
    deleteProduct,
    updateOrderStatus,
  } = useApp();

  const isAdmin = user?.role === "admin";

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pending = orders.filter((order) => order.status === "En attente").length;
  const sellersCount = users.filter((u) => u.role === "seller").length;

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">⚙️ Administration</h1>
            <p className="mt-2 text-slate-500">
              Centre de contrôle global du marketplace ChronoDZ.
            </p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-red-600">Admin Access</p>
            <p>Gestion utilisateurs, annonces et commandes.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="👤"
          title="Utilisateurs"
          value={users.length}
          hint={`${sellersCount} vendeurs`}
        />
        <StatCard
          icon="⌚"
          title="Annonces"
          value={products.length}
          hint="Produits actifs"
          tone="blue"
        />
        <StatCard
          icon="📦"
          title="Commandes"
          value={orders.length}
          hint={`${pending} en attente`}
          tone="amber"
        />
        <StatCard
          icon="💰"
          title="CA"
          value={money(totalRevenue)}
          hint="Total commandes"
          tone="green"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-4xl border border-red-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-red-600">Priorité admin</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">Surveiller les commandes</h3>
          <p className="mt-2 text-sm text-slate-500">
            Vérifie les commandes en attente et assure le suivi des statuts.
          </p>
        </div>

        <div className="rounded-4xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Catalogue</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">Contrôler les annonces</h3>
          <p className="mt-2 text-sm text-slate-500">
            Gère les produits publiés et supprime les annonces si nécessaire.
          </p>
        </div>

        <div className="rounded-4xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-emerald-600">Communauté</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">Suivre les vendeurs</h3>
          <p className="mt-2 text-sm text-slate-500">
            Analyse les comptes vendeurs et la croissance de la plateforme.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-4xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Utilisateurs</h2>

        {users.length === 0 ? (
          <p className="text-slate-400">Aucun utilisateur trouvé.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-3 pr-4">Utilisateur</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Ville</th>
                  <th className="py-3 pr-4">Rôle</th>
                  <th className="py-3 pr-4">Inscription</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={`${u.firstName} ${u.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-xs text-slate-400">
                            #{u.id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 pr-4 text-slate-600">{u.email}</td>

                    <td className="py-3 pr-4 text-slate-500">
                      {u.city || "—"}
                    </td>

                    <td className="py-3 pr-4">
                      <Badge tone={ROLE_TONES[u.role] || "gray"}>
                        {ROLE_LABELS[u.role] || u.role}
                      </Badge>
                    </td>

                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-4xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Annonces produits</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3 pr-4">Montre</th>
                <th className="py-3 pr-4">Prix</th>
                <th className="py-3 pr-4">Vendeur</th>
                <th className="py-3 pr-4">Ville</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.model}
                        className="h-10 w-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {p.brand} {p.model}
                        </p>
                        <p className="text-xs text-slate-400">Réf. {p.ref}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 pr-4 font-semibold">{money(p.price)}</td>

                  <td className="py-3 pr-4">
                    <div className="space-y-1">
                      <Badge tone={p.sellerType === "dealer" ? "green" : "amber"}>
                        {p.sellerType === "dealer" ? "Dealer" : "Particulier"}
                      </Badge>
                      {p.seller && (
                        <p className="text-xs text-slate-400">
                          {p.seller.firstName} {p.seller.lastName}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="py-3 pr-4 text-slate-500">{p.location}</td>

                  <td className="py-3">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Supprimer "${p.brand} ${p.model}" ?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 rounded-4xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Toutes les commandes</h2>

        {orders.length === 0 ? (
          <p className="text-slate-400">Aucune commande.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">Client</th>
                  <th className="py-3 pr-4">Total</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Statut</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-400">
                      #{o.id.slice(-6).toUpperCase()}
                    </td>

                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">
                        {o.customer?.fullName || o.customerData?.fullName || "Client"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {o.customer?.city || o.customerData?.city || "Ville inconnue"}
                      </p>
                    </td>

                    <td className="py-3 pr-4 font-bold">{money(o.total)}</td>

                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {formatDate(o.createdAt)}
                    </td>

                    <td className="py-3 pr-4">
                      <Badge tone={STATUS_TONES[o.status] || "gray"}>
                        {o.status}
                      </Badge>
                    </td>

                    <td className="py-3">
                      {o.status === "En attente" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => updateOrderStatus(o.id, "Confirmée")}
                        >
                          Confirmer
                        </Button>
                      )}

                      {o.status === "Confirmée" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(o.id, "Expédiée")}
                        >
                          Expédier
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}