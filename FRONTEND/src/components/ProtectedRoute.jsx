import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../services/UserService";
import AccessDenied from "./AccessDenied";

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
