<<<<<<< HEAD
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
=======
import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../services/UserService";
import AccessDenied from "../AccessDenied";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return element;
};

export default ProtectedRoute;
>>>>>>> dev-Dakay-merge-dev-Mark
