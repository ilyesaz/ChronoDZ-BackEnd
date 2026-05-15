import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-8xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-headline text-xl font-bold italic text-slate-900">
            ⌚ ChronoDZ
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Marketplace horloger algérien. Achetez et vendez des montres premium
            avec confiance.
          </p>
          <div className="mt-4 flex gap-3">
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              React 18
            </span>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              Tailwind CSS
            </span>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              Vite
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">Marketplace</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
            <li><Link to="/" className="hover:text-slate-800">Toutes les montres</Link></li>
            <li><Link to="/favoris" className="hover:text-slate-800">Mes favoris</Link></li>
            <li><Link to="/commandes" className="hover:text-slate-800">Mes commandes</Link></li>
            <li><Link to="/messages" className="hover:text-slate-800">Messagerie</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">Vendre</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
            <li><Link to="/vendre" className="hover:text-slate-800">Publier une annonce</Link></li>
            <li><Link to="/profil" className="hover:text-slate-800">Profil vendeur</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ChronoDZ — Starter open-source. À brancher sur un backend pour la production.
      </div>
    </footer>
  );
}