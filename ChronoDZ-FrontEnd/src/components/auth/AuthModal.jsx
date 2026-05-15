import { useState } from "react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function AuthModal() {
  const { authOpen, authMode, openAuth, closeAuth, login, register } = useApp();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    role: "buyer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(loginForm.email, loginForm.password);
      closeAuth();
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (registerForm.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      await register(registerForm);
      closeAuth();
      setRegisterForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        role: "buyer",
      });
    } catch (err) {
      setError(err.message || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  const SocialBtn = ({ label, icon }) => (
    <Button variant="secondary" className="w-full justify-center gap-3" type="button">
      <span>{icon}</span> {label}
    </Button>
  );

  return (
    <Modal open={authOpen} onClose={closeAuth} title="Mon compte ChronoDZ">
      <div className="mx-auto max-w-md">
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
          {["login", "register"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                openAuth(mode);
                setError("");
              }}
              className={`rounded-xl py-3 text-sm font-semibold transition ${
                authMode === mode
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {mode === "login" ? "Se connecter" : "S'inscrire"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {authMode === "login" ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="E-mail"
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              placeholder="admin@chronodz.dz"
            />

            <Input
              label="Mot de passe"
              type="password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded" /> Rester connecté
              </label>
              <button
                type="button"
                className="font-medium text-slate-900 underline underline-offset-4"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <SocialBtn label="Continuer avec Google" icon="🌐" />
              <SocialBtn label="Continuer avec Apple" icon="🍎" />
            </div>

            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter →"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  openAuth("register");
                  setError("");
                }}
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                S'inscrire
              </button>
            </p>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prénom"
                required
                value={registerForm.firstName}
                onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
              />
              <Input
                label="Nom"
                required
                value={registerForm.lastName}
                onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="E-mail"
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
              <Input
                label="Mot de passe"
                type="password"
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Téléphone"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
              <Input
                label="Ville"
                value={registerForm.city}
                onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
              />
            </div>

            <Select
              label="Type de compte"
              value={registerForm.role}
              onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
              options={[
                { value: "buyer", label: "Acheteur" },
                { value: "seller", label: "Vendeur / Dealer" },
              ]}
            />

            <div className="space-y-2 pt-2">
              <SocialBtn label="Continuer avec Google" icon="🌐" />
              <SocialBtn label="Continuer avec Apple" icon="🍎" />
            </div>

            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "Création…" : "Créer mon compte →"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              Déjà membre ?{" "}
              <button
                type="button"
                onClick={() => {
                  openAuth("login");
                  setError("");
                }}
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                Se connecter
              </button>
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}