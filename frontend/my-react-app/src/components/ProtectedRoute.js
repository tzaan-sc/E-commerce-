// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
