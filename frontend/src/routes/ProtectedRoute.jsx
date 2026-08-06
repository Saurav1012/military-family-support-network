import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Check agar token exist hi nahi karta, ya null/undefined string format me save hai
  const isInvalidToken =
    !token ||
    token === "null" ||
    token === "undefined" ||
    token.trim() === "";

  if (isInvalidToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Sub-routes / DashboardLayout ko render karega
  return <Outlet />;
};

export default ProtectedRoute;