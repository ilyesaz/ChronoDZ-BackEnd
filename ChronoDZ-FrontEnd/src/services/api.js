const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

if (!API_URL) {
  throw new Error("VITE_API_URL est manquante");
}

const TOKEN_KEY = "chrono_token";
const USER_KEY = "chrono_user";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(data) {
  if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
  if (data?.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || "Erreur serveur");
  }

  return data;
}

export const sessionApi = {
  getToken,
  getUser: getStoredUser,
  saveSession,
  clearSession,
  isAuthenticated: () => !!getToken(),
};

export const authApi = {
  login: async (credentials) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    saveSession(data);
    return data;
  },

  register: async (userData) => {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    saveSession(data);
    return data;
  },

  me: async () => {
    return request("/auth/me");
  },

  updateProfile: async (userId, userData) => {
    const data = await request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    if (data?.user) {
      const currentToken = getToken();
      saveSession({
        token: currentToken,
        user: data.user,
      });
    }

    return data;
  },

  logout: () => {
    clearSession();
  },
};

export const usersApi = {
  getAll: async () => {
    return request("/users");
  },

  updateMe: async (userId, userData) => {
    return authApi.updateProfile(userId, userData);
  },
};

export const productsApi = {
  getAll: async () => {
    return request("/products");
  },

  create: async (data) => {
    return request("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return request(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

export const ordersApi = {
  getAll: async () => {
    return request("/orders");
  },

  create: async (data) => {
    return request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id, status) => {
    return request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

export const favoritesApi = {
  getAll: async () => {
    return request("/favorites");
  },

  add: async (productId) => {
    return request("/favorites", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  remove: async (productId) => {
    return request(`/favorites/${productId}`, {
      method: "DELETE",
    });
  },
};

export const conversationsApi = {
  getAll: async () => {
    return request("/conversations");
  },

  create: async (productId) => {
    return request("/conversations", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  getMessages: async (conversationId) => {
    return request(`/conversations/${conversationId}/messages`);
  },

  sendMessage: async (conversationId, content) => {
    return request(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },
};

export const cartApi = {
  get: () => JSON.parse(localStorage.getItem("chrono_cart") || "[]"),
  save: (cart) => localStorage.setItem("chrono_cart", JSON.stringify(cart)),
  clear: () => localStorage.removeItem("chrono_cart"),
};