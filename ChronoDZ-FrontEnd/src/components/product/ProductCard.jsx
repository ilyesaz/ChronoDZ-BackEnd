import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import { money } from "../../utils/helpers.js";

export default function ProductCard({ item, onOpen, onAddToCart, onToggleFavorite, isFavorite }) {
  return (
    <article className="card group overflow-hidden">
      <div className="relative overflow-hidden">
        <img src={item.image} alt={`${item.brand} ${item.model}`}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105" />
        <button onClick={() => onToggleFavorite(item.id)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110">
          {isFavorite ? "❤️" : "🤍"}
        </button>
        {item.buyerProtection && (
          <div className="absolute bottom-3 left-3">
            <Badge tone="green">🛡️ Buyer Protection</Badge>
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="blue">{item.brand}</Badge>
          <Badge tone={item.sellerType === "dealer" ? "green" : "amber"}>
            {item.sellerType === "dealer" ? "🏪 Dealer" : "👤 Particulier"}
          </Badge>
          <Badge tone="gray">{item.condition}</Badge>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {item.brand} {item.model}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Réf. {item.ref} · {item.year} · {item.location}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 pt-1">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Prix</p>
            <p className="text-2xl font-black text-slate-900">{money(item.price)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onOpen(item)}>Voir</Button>
            <Button size="sm" onClick={() => onAddToCart(item)}>+ Panier</Button>
          </div>
        </div>
      </div>
    </article>
  );
}