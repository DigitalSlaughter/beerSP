import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Degustaciones from "../pages/Degustaciones";
import ProtectedRoute from "../components/ProtectedRoute";
import VerifyEmail from "../pages/VerifyEmail";
import Galardones from "../pages/Galardones";


const AppRoutes: React.FC = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/home" replace /> : <Navigate to="/register" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:token" element={<VerifyEmail />} />

      {/* Rutas protegidas */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/degustaciones"
        element={
          <ProtectedRoute>
            <Degustaciones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/galardones"
        element={
          <ProtectedRoute>
            <Galardones />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
