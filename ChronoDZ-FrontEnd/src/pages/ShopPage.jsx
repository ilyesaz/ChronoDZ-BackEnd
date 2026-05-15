import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useFilters } from "../hooks/useFilters.js";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductDetailsModal from "../components/product/ProductDetailsModal.jsx";
import FiltersPanel from "../components/product/FiltersPanel.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import { money } from "../utils/helpers.js";

export default function ShopPage() {
  const { products, favorites, toggleFavorite, openAuth, user, loading } = useApp();
  const { addToCart } = useCart();
  const { filters, setFilter, resetFilters, filtered } = useFilters(products);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const stats = useMemo(
    () => ({
      total: products.length,
      protected: products.filter((p) => p.buyerProtection).length,
      dealers: products.filter((p) => p.sellerType === "dealer").length,
      avg: products.reduce((s, p) => s + p.price, 0) / (products.length || 1),
    }),
    [products]
  );

  if (loading) {
    return (
      <section className="rounded-4xl bg-white p-10 shadow-soft">
        <p className="text-lg font-semibold text-slate-900">Chargement des produits...</p>
        <p className="mt-2 text-slate-500">Patiente un instant.</p>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-8 py-14 text-white shadow-soft md:px-14 md:py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative grid gap-10 lg:grid-cols-[1.5fr,1fr]">
          <div>
            <Badge tone="blue">Marketplace horloger algérien</Badge>
            <h1 className="mt-5 font-headline text-5xl font-bold leading-tight md:text-6xl">
              Achetez & vendez des montres d'exception.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-slate-300">
              ChronoDZ connecte acheteurs et vendeurs passionnés d'horlogerie à travers toute l'Algérie.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white !text-slate-900 hover:bg-slate-100"
                onClick={() =>
                  document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                🔍 Explorer le catalogue
              </Button>

              {!user && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white/20 !text-white hover:bg-white/10"
                  onClick={() => openAuth("register")}
                >
                  Créer un compte gratuit
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 self-center">
            {[
              { label: "Montres", value: stats.total, icon: "⌚" },
              { label: "Buyer Protection", value: stats.protected, icon: "🛡️" },
              { label: "Dealers vérifiés", value: stats.dealers, icon: "🏪" },
              { label: "Prix moyen", value: money(stats.avg), icon: "💰" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="mt-2 text-xl font-black">{s.value}</p>
                <p className="text-xs text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogue" className="mt-8 grid gap-6 xl:grid-cols-[300px,1fr]">
        <FiltersPanel
          products={products}
          filters={filters}
          setFilter={setFilter}
          resetFilters={resetFilters}
        />

        <div>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Catalogue</h2>
              <p className="mt-1 text-slate-400">
                {filtered.length} résultat(s) sur {products.length} annonces
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="green">🛡️ {stats.protected} protégées</Badge>
              <Badge tone="blue">🏪 {stats.dealers} dealers</Badge>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-line bg-white p-16 text-center">
              <p className="mb-4 text-4xl">🔍</p>
              <p className="text-lg font-bold text-slate-900">Aucun résultat</p>
              <p className="mt-2 text-slate-400">Essaie de modifier les filtres.</p>
              <Button variant="secondary" className="mt-5" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {filtered.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onOpen={setSelectedProduct}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductDetailsModal
        open={!!selectedProduct}
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    </>
  );
}