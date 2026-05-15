import { useMemo } from "react";
import Select from "../ui/Select.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

export default function FiltersPanel({ products, filters, setFilter, resetFilters }) {
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);
  const cities = useMemo(() => Array.from(new Set(products.map((p) => p.location))), [products]);

  return (
    <aside className="h-fit rounded-4xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Filtres</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>Réinitialiser</Button>
      </div>

      <div className="mt-5 space-y-4">
        <Select label="Marque" value={filters.brand}
          onChange={(e) => setFilter("brand", e.target.value)}
          options={[{ value: "all", label: "Toutes les marques" }, ...brands.map((b) => ({ value: b, label: b }))]} />

        <Select label="Type vendeur" value={filters.sellerType}
          onChange={(e) => setFilter("sellerType", e.target.value)}
          options={[
            { value: "all", label: "Tous" },
            { value: "dealer", label: "🏪 Dealer vérifié" },
            { value: "private", label: "👤 Particulier" },
          ]} />

        <Select label="État" value={filters.condition}
          onChange={(e) => setFilter("condition", e.target.value)}
          options={[
            { value: "all", label: "Tous" },
            "Neuf", "Excellent état", "Très bon état", "Bon état",
          ]} />

        <Select label="Ville" value={filters.location}
          onChange={(e) => setFilter("location", e.target.value)}
          options={[{ value: "all", label: "Toutes" }, ...cities.map((c) => ({ value: c, label: c }))]} />

        <Input label="Budget maximum (DZD)" type="number" placeholder="Ex: 500000"
          value={filters.maxPrice}
          onChange={(e) => setFilter("maxPrice", e.target.value)} />

        <Select label="Trier par" value={filters.sort}
          onChange={(e) => setFilter("sort", e.target.value)}
          options={[
            { value: "latest", label: "Plus récent" },
            { value: "price_asc", label: "Prix croissant" },
            { value: "price_desc", label: "Prix décroissant" },
            { value: "year_desc", label: "Année récente" },
          ]} />

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-emerald-50 hover:border-emerald-200">
          <input type="checkbox" checked={filters.buyerProtection}
            onChange={(e) => setFilter("buyerProtection", e.target.checked)} />
          <span>🛡️ Buyer Protection uniquement</span>
        </label>
      </div>
    </aside>
  );
}