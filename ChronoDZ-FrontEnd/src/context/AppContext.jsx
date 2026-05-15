import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  productsApi,
  ordersApi,
  favoritesApi,
  authApi,
  usersApi,
  conversationsApi,
} from "../services/api.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("chrono_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("chrono_token") || null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);

      try {
        const productsData = await productsApi.getAll();
        setProducts(productsData);
      } catch (error) {
        console.error("Erreur chargement produits :", error);
        setProducts([]);
      }

      try {
        if (token) {
          const ordersData = await ordersApi.getAll();
          setOrders(ordersData);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Erreur chargement commandes :", error);
        setOrders([]);
      }

      try {
        if (token) {
          const favoritesData = await favoritesApi.getAll();
          setFavorites(favoritesData.map((fav) => fav.productId));
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Erreur chargement favoris :", error);
        setFavorites([]);
      }

      try {
        if (token) {
          const conversationsData = await conversationsApi.getAll();
          setConversations(conversationsData);

          const allMessages = conversationsData.flatMap((conv) =>
            (conv.messages || []).map((msg) => ({
              ...msg,
              conversationId: conv.id,
            }))
          );
          setMessages(allMessages);
        } else {
          setConversations([]);
          setMessages([]);
        }
      } catch (error) {
        console.error("Erreur chargement conversations :", error);
        setConversations([]);
        setMessages([]);
      }

      try {
        if (token && user?.role === "admin") {
          const usersData = await usersApi.getAll();
          setUsers(usersData);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Erreur chargement utilisateurs :", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [token, user?.role]);

  const openAuth = useCallback((mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("chrono_user", JSON.stringify(data.user));
    localStorage.setItem("chrono_token", data.token);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authApi.register(userData);

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("chrono_user", JSON.stringify(data.user));
    }

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("chrono_token", data.token);
    }

    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setOrders([]);
    setFavorites([]);
    setUsers([]);
    setConversations([]);
    setMessages([]);
    localStorage.removeItem("chrono_user");
    localStorage.removeItem("chrono_token");
  }, []);

  const createProduct = useCallback(async (data) => {
    const newProd = await productsApi.create(data);
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await productsApi.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const placeOrder = useCallback(
    async (data) => {
      try {
        const payload = user ? { ...data, userId: user.id } : data;
        const newOrder = await ordersApi.create(payload);
        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
      } catch (error) {
        console.error("Erreur lors de la création de la commande :", error);
        throw error;
      }
    },
    [user]
  );

  const updateOrderStatus = useCallback(async (id, status) => {
    try {
      const updatedOrder = await ordersApi.updateStatus(id, status);

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? updatedOrder : o))
      );

      return updatedOrder;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      throw error;
    }
  }, []);

  const toggleFavorite = useCallback(
    async (productId) => {
      if (!token) {
        throw new Error("Tu dois être connecté pour gérer tes favoris.");
      }

      const isFavorite = favorites.includes(productId);

      try {
        if (isFavorite) {
          await favoritesApi.remove(productId);
          setFavorites((prev) => prev.filter((id) => id !== productId));
        } else {
          await favoritesApi.add(productId);
          setFavorites((prev) => [...prev, productId]);
        }
      } catch (error) {
        console.error("Erreur favoris :", error);
        throw error;
      }
    },
    [favorites, token]
  );

  const createConversation = useCallback(async (productId) => {
    try {
      const conversation = await conversationsApi.create(productId);

      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversation.id);
        if (exists) {
          return prev.map((c) => (c.id === conversation.id ? conversation : c));
        }
        return [conversation, ...prev];
      });

      const conversationMessages = (conversation.messages || []).map((msg) => ({
        ...msg,
        conversationId: conversation.id,
      }));

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.conversationId !== conversation.id);
        return [...filtered, ...conversationMessages];
      });

      return conversation;
    } catch (error) {
      console.error("Erreur création conversation :", error);
      throw error;
    }
  }, []);

  const sendMessage = useCallback(async ({ conversationId, content }) => {
    try {
      const newMessage = await conversationsApi.sendMessage(conversationId, content);

      setMessages((prev) => [...prev, { ...newMessage, conversationId }]);

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                updatedAt: new Date().toISOString(),
                messages: [...(conv.messages || []), newMessage],
              }
            : conv
        )
      );

      return newMessage;
    } catch (error) {
      console.error("Erreur message :", error);
      throw error;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        users,
        products,
        orders,
        favorites,
        conversations,
        messages,
        loading,
        authOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        login,
        register,
        logout,
        createProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        toggleFavorite,
        createConversation,
        sendMessage,
        setUser,
        setProducts,
        setOrders,
        setUsers,
        setFavorites,
        setConversations,
        setMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}