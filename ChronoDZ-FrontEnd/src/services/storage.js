const KEYS = {
  USERS: "chronodz_v2_users",
  SESSION: "chronodz_v2_session",
  PRODUCTS: "chronodz_v2_products",
  CART: "chronodz_v2_cart",
  FAVORITES: "chronodz_v2_favorites",
  ORDERS: "chronodz_v2_orders",
  MESSAGES: "chronodz_v2_messages",
};

export { KEYS };

export function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key) {
  localStorage.removeItem(key);
}

export function clear() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}