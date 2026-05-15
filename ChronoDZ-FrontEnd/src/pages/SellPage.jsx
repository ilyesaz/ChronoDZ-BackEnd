import { useApp } from "../context/AppContext.jsx";
import SellerForm from "../components/seller/SellerForm.jsx";
import Button from "../components/ui/Button.jsx";

export default function SellPage() {
  const { user, openAuth } = useApp();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-4xl border border-line bg-white p-16 text-center shadow-sm">
        <p className="mb-6 text-5xl">🔐</p>
        <h2 className="text-2xl font-black text-slate-900">Connexion requise</h2>
        <p className="mt-3 max-w-md text-slate-400">
          Connecte-toi ou crée un compte pour publier une annonce et commencer à vendre tes montres sur ChronoDZ.
        </p>
        <div className="mt-7 flex gap-3">
          <Button onClick={() => openAuth("login")}>Se connecter</Button>
          <Button variant="secondary" onClick={() => openAuth("register")}>
            Créer un compte
          </Button>
        </div>
      </div>
    );
  }

  if (!["seller", "admin"].includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center rounded-4xl border border-line bg-white p-16 text-center shadow-sm">
        <p className="mb-6 text-5xl">⛔</p>
        <h2 className="text-2xl font-black text-slate-900">Accès refusé</h2>
        <p className="mt-3 max-w-md text-slate-400">
          Seuls les vendeurs et les administrateurs peuvent publier une montre.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-orange-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">🏪 Espace vendeur</h1>
            <p className="mt-2 text-slate-500">
              Publie une annonce complète et présente ta montre aux acheteurs.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Statut
              </p>
              <p className="mt-1 font-black text-slate-900">Vendeur actif</p>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                Publication
              </p>
              <p className="mt-1 font-black text-slate-900">Nouvelle annonce</p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Visibilité
              </p>
              <p className="mt-1 font-black text-slate-900">Catalogue public</p>
            </div>
          </div>
        </div>
      </div>

      <SellerForm />
    </div>
  );
}