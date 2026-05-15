import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { getInitials } from "../../utils/helpers.js";

export default function Navbar() {
  const { user, logout, openAuth } = useApp();
  const { cartCount, setCartOpen } = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const canSell = user?.role === "seller" || user?.role === "admin";

  const navLink = (to, label) => (
    <Link
      to={to}
      className={
        pathname === to
          ? "rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          : "rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      }
    >
      {label}
    </Link>
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-8xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 font-headline text-2xl font-bold italic text-slate-900"
        >
          ⌚ ChronoDZ
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {navLink("/", "Boutique")}
          {canSell && navLink("/vendre", "Vendre")}
          {user && navLink("/commandes", "Commandes")}
          {user && navLink("/messages", "Messages")}
          {isAdmin && navLink("/admin", "Admin")}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Link
            to="/favoris"
            className="relative rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ❤️
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profil"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white"
                title={`${user.firstName} ${user.lastName}`}
              >
                {getInitials(user.firstName, user.lastName)}
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-2xl border border-line px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => openAuth("login")}
                className="rounded-2xl border border-line px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Connexion
              </button>

              <button
                onClick={() => openAuth("register")}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                S'inscrire
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}