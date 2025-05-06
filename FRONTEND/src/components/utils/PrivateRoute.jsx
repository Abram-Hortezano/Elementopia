// utils/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = user?.role || localStorage.getItem("role");

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
