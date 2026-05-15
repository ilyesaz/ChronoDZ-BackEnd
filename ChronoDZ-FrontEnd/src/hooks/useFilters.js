import { useState, useMemo } from "react";

const DEFAULT_FILTERS = {
  query: "",
  brand: "all",
  sellerType: "all",
  condition: "all",
  location: "all",
  maxPrice: "",
  buyerProtection: false,
  sort: "latest",
};

export function useFilters(products) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      result = result.filter((p) =>
        `${p.brand} ${p.model} ${p.ref} ${p.location} ${p.category}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (filters.brand !== "all") result = result.filter((p) => p.brand === filters.brand);
    if (filters.sellerType !== "all") result = result.filter((p) => p.sellerType === filters.sellerType);
    if (filters.condition !== "all") result = result.filter((p) => p.condition === filters.condition);
    if (filters.location !== "all") result = result.filter((p) => p.location === filters.location);
    if (filters.maxPrice) result = result.filter((p) => p.price <= Number(filters.maxPrice));
    if (filters.buyerProtection) result = result.filter((p) => p.buyerProtection);

    if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (filters.sort === "year_desc") result.sort((a, b) => b.year - a.year);
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [products, filters]);

  return { filters, setFilter, resetFilters, filtered };
}