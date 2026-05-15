import Modal from "../ui/Modal.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import { money } from "../../utils/helpers.js";

export default function ProductDetailsModal({ open, item, onClose, onAddToCart }) {
  if (!item) return null;
  return (
    <Modal open={open} onClose={onClose} title={`${item.brand} ${item.model}`} wide>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <img src={item.image} alt={`${item.brand} ${item.model}`}
            className="h-[380px] w-full rounded-3xl object-cover" />
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">Année</p>
              <p className="mt-1 font-semibold text-slate-800">{item.year}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">Stock</p>
              <p className="mt-1 font-semibold text-slate-800">{item.stock}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">Ville</p>
              <p className="mt-1 font-semibold text-slate-800">{item.location}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">{item.brand}</Badge>
            <Badge tone="amber">{item.category}</Badge>
            <Badge tone={item.sellerType === "dealer" ? "green" : "gray"}>
              {item.sellerType === "dealer" ? "🏪 Dealer vérifié" : "👤 Particulier"}
            </Badge>
            {item.buyerProtection && <Badge tone="green">🛡️ Protection active</Badge>}
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900">
              {item.brand} {item.model}
            </h2>
            <p className="mt-2 text-slate-400">Référence officielle: {item.ref}</p>
          </div>

          <p className="text-4xl font-black text-slate-900">{money(item.price)}</p>

          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            {item.description}
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-bold text-emerald-800">🛡️ Sécurité de la transaction</p>
            <ul className="mt-3 space-y-2 text-sm text-emerald-700">
              <li>• Vendeur {item.sellerType === "dealer" ? "dealer vérifié" : "particulier"}.</li>
              <li>• Option livraison assurée disponible au checkout.</li>
              <li>• Suivi de commande dans l'espace client.</li>
              <li>• Support disponible via la messagerie.</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 justify-center" onClick={() => { onAddToCart(item); onClose(); }}>
              🛒 Ajouter au panier
            </Button>
            <Button variant="secondary" onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}