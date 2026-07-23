import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <Routes>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/community" element={<h2>Community Page</h2>} />

        <Route path="/forum" element={<h2>Forum Page</h2>} />

        <Route path="/resources" element={<h2>Resources Page</h2>} />

        <Route path="/events" element={<h2>Events Page</h2>} />

        <Route path="/profile" element={<h2>Profile Page</h2>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />

    </Routes>
  );
}

export default App;