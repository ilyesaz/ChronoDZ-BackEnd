import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { getInitials } from "../utils/helpers.js";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api.js";

export default function AccountPage() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    avatar: "",
    password: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        avatar: user.avatar || "",
        password: "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-4xl border border-line bg-white p-16 text-center">
        <p className="mb-5 text-5xl">👤</p>
        <h2 className="text-2xl font-black text-slate-900">Non connecté</h2>
        <Link to="/">
          <Button className="mt-6">Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        avatar: form.avatar,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const updated = await authApi.updateProfile(user.id, payload);

      localStorage.setItem("chrono_user", JSON.stringify(updated.user));
      window.location.reload();

      setSaved(true);
      setForm((prev) => ({ ...prev, password: "" }));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleLabels = {
    admin: "Administrateur",
    seller: "Vendeur",
    buyer: "Acheteur",
  };

  return (
    <section className="space-y-6">
      <div className="rounded-4xl border border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">👤 Espace utilisateur</h1>
            <p className="mt-2 text-slate-500">
              Gère ton profil, consulte ton activité et personnalise ton compte.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-blue-600">Buyer Space</p>
            <p>Profil, favoris, messages et suivi personnel.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-4xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Mes commandes</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">Suivi achats</h3>
          <p className="mt-2 text-sm text-slate-500">
            Consulte rapidement l’état de tes commandes passées.
          </p>
        </div>

        <div className="rounded-4xl border border-pink-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-pink-600">Mes favoris</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">Montres sauvegardées</h3>
          <p className="mt-2 text-sm text-slate-500">
            Retrouve les modèles ajoutés à ta wishlist.
          </p>
        </div>

        <div className="rounded-4xl border border-violet-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-violet-600">Messages</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">Conversations</h3>
          <p className="mt-2 text-sm text-slate-500">
            Garde le contact avec les vendeurs depuis ton espace personnel.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        <div className="h-fit space-y-4 rounded-4xl border border-line bg-white p-6 text-center shadow-sm">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-2xl font-black text-white">
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}

          <div>
            <p className="text-xl font-black text-slate-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <span className="font-semibold text-slate-700">
              {roleLabels[user.role] || user.role}
            </span>
          </div>

          {user.city && <p className="text-sm text-slate-400">📍 {user.city}</p>}

          <Button variant="danger" className="w-full justify-center" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>

        <div className="rounded-4xl border border-line bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">Modifier les informations</h2>

          {saved && (
            <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
              ✅ Profil mis à jour avec succès !
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Prénom"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              <Input
                label="Nom"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <Input
                label="Téléphone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Ville"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              <Input
                label="Avatar URL"
                value={form.avatar}
                onChange={(e) => handleChange("avatar", e.target.value)}
              />
            </div>

            <Input
              label="Nouveau mot de passe"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Laisser vide pour ne pas changer"
            />

            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Sauvegarde..." : "💾 Sauvegarder"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}