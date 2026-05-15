import { useState } from "react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Textarea from "../ui/Textarea.jsx";
import Button from "../ui/Button.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function SellerForm() {
  const { user, createProduct } = useApp();

  const defaultSellerType = user?.role === "seller" ? "dealer" : "private";

  const initialForm = {
    brand: "",
    model: "",
    ref: "",
    price: "",
    year: new Date().getFullYear().toString(),
    condition: "Neuf",
    category: "Sport",
    location: user?.city || "",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
    description: "",
    stock: "1",
    sellerType: defaultSellerType,
  };

  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        year: Number(form.year),
        stock: Number(form.stock),
        buyerProtection: form.sellerType === "dealer",
        verified: form.sellerType === "dealer",
      });

      setSuccess(true);
      setForm({
        ...initialForm,
        sellerType: form.sellerType,
        location: user?.city || "",
      });

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || "Erreur lors de la publication de l'annonce");
    } finally {
      setLoading(false);
    }
  };

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <div className="rounded-4xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Publier une annonce</h2>
          <p className="mt-2 text-slate-500">
            Remplis tous les champs pour une annonce complète et visible.
          </p>
        </div>

        <div className="rounded-3xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          ✨ Astuce vendeur : ajoute une image propre et une référence exacte pour inspirer confiance.
        </div>
      </div>

      {success && (
        <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
          ✅ Annonce publiée ! Elle est visible dans le catalogue.
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Marque *" required placeholder="Ex: Rolex" {...f("brand")} />
          <Input label="Modèle *" required placeholder="Ex: Submariner" {...f("model")} />
          <Input label="Référence *" required placeholder="Ex: 126610LN" {...f("ref")} />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Input label="Prix (DZD) *" type="number" required placeholder="Ex: 1500000" {...f("price")} />
          <Input label="Année *" type="number" required {...f("year")} />
          <Input label="Stock" type="number" {...f("stock")} />
          <Input label="Ville *" required placeholder="Ex: Alger" {...f("location")} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="État"
            options={["Neuf", "Excellent état", "Très bon état", "Bon état"]}
            {...f("condition")}
          />
          <Select
            label="Catégorie"
            options={["Sport", "Plongée", "Chronographe", "Habillée", "Field", "Sport chic", "Collection"]}
            {...f("category")}
          />
          <Select
            label="Type vendeur"
            options={[
              { value: "dealer", label: "🏪 Dealer / Boutique" },
              { value: "private", label: "👤 Particulier" },
            ]}
            {...f("sellerType")}
          />
        </div>

        {form.sellerType === "dealer" && (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              🛡️ Buyer Protection activée
            </div>
            <div className="rounded-3xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              ✅ Badge vendeur vérifié
            </div>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              ⭐ Annonce plus rassurante pour l’acheteur
            </div>
          </div>
        )}

        <Input label="URL de l'image" placeholder="https://..." {...f("image")} />

        {form.image && (
          <div className="overflow-hidden rounded-3xl border border-line">
            <img src={form.image} alt="Aperçu" className="h-48 w-full object-cover" />
          </div>
        )}

        <Textarea
          label="Description *"
          required
          rows={5}
          placeholder="Décris l'état, la boîte, les papiers, les révisions effectuées..."
          {...f("description")}
        />

        {form.sellerType === "dealer" && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            🛡️ En tant que dealer, votre annonce bénéficiera automatiquement du badge <strong>Buyer Protection</strong> et <strong>Vendeur vérifié</strong>.
          </div>
        )}

        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Publication..." : "🚀 Publier l'annonce"}
        </Button>
      </form>
    </div>
  );
}