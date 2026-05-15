import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "../../context/AppContext.jsx";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, openAuth } = useApp();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      openAuth("login");
    }
  }, [user, openAuth]);

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}