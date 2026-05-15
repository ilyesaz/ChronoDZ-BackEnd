import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import AuthModal from "./components/auth/AuthModal.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";
import CheckoutModal from "./components/cart/CheckoutModal.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

import ShopPage from "./pages/ShopPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import SellPage from "./pages/SellPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function InnerApp() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-8xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/favoris" element={<FavoritesPage />} />

          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/commandes"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendre"
            element={
              <ProtectedRoute roles={["seller", "admin"]}>
                <SellPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <AuthModal />
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <CartProvider>
        <InnerApp />
      </CartProvider>
    </AppProvider>
  );
}