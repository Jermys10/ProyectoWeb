import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Perfil from "./components/Perfil";
import EmailForm from "./components/EmailForm";
import Notificacion from "./components/Notificacion";
import CrearPublicacion from "./components/CrearPublicacion";
import SharedPostPage from "./components/SharedPostPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirigir raíz a /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />

        {/* Rutas protegidas */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emailform"
          element={
            <ProtectedRoute>
              <EmailForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notificacion"
          element={
            <ProtectedRoute>
              <Notificacion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crearPublicacion"
          element={
            <ProtectedRoute>
              <CrearPublicacion />
            </ProtectedRoute>
          }
        />

        <Route
  path="/shared"
  element={
    <ProtectedRoute>
      <SharedPostPage />
    </ProtectedRoute>
  }
/>

        {/* Ruta para administradores */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <Dashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Ruta para no encontrados */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
