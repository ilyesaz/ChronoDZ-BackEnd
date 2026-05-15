import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import ProductDetailsModal from "../components/product/ProductDetailsModal.jsx";
import Button from "../components/ui/Button.jsx";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const { products, favorites, toggleFavorite } = useApp();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">❤️ Mes favoris</h1>
        <p className="mt-2 text-slate-400">
          {favoriteProducts.length} montre(s) sauvegardée(s).
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-line bg-white p-16 text-center">
          <p className="text-5xl mb-4">🤍</p>
          <p className="text-lg font-bold text-slate-900">Aucun favori</p>
          <p className="mt-2 text-slate-400">Clique sur ♡ sur une annonce pour l'ajouter ici.</p>
          <Link to="/">
            <Button className="mt-6">Retour au catalogue</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favoriteProducts.map((item) => (
            <ProductCard key={item.id} item={item}
              onOpen={setSelectedProduct}
              onAddToCart={addToCart}
              onToggleFavorite={toggleFavorite}
              isFavorite />
          ))}
        </div>
      )}

      <ProductDetailsModal open={!!selectedProduct} item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart} />
    </section>
  );
}