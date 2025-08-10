import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faPlus,
  faEnvelope,
  faIdCard,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase"; 
import { useNavigate, Link } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [notiCount, setNotiCount] = useState(0);

  const irALogin = () => {
    navigate("/login");
  };

  const cerrarSesion = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotiCount(0);
      return;
    }

    // Query para notificaciones no leídas del usuario actual
    const q = query(
      collection(db, "notificaciones"),
      where("uid", "==", user.uid),
      where("leido", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotiCount(snapshot.size); // número de docs que cumplen la condición
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div
      className="d-flex flex-column align-items-start p-3 bg-white shadow-sm vh-100"
      style={{ width: "220px" }}
    >
      {/* Logo */}
      <img
        src="https://img.freepik.com/free-vector/flat-design-friends-logo-design_23-2149513748.jpg?w=2000"
        alt="Logo"
        style={{ width: "120px", marginBottom: "30px" }}
      />

      {/* Navegación */}
      <Link to="/perfil" className="btn btn-light w-100 mb-2 text-start">
        <FontAwesomeIcon icon={faIdCard} className="me-2" /> Perfil
      </Link>

      <Link to="/home" className="btn btn-light w-100 mb-2 text-start">
        <FontAwesomeIcon icon={faEnvelope} className="me-2" /> Descubrir
      </Link>

      <Link to="/crearPublicacion" className="btn btn-light w-100 mb-2 text-start">
        <FontAwesomeIcon icon={faPlus} className="me-2" /> Publicar
      </Link>
      <Link to="/shared" className="btn btn-light w-100 mb-2 text-start">
        <FontAwesomeIcon icon={faPlus} className="me-2" /> Publicaciones compartidas
      </Link>

      <Link to="/notificacion" className="btn btn-light w-100 mb-2 text-start d-flex justify-content-between align-items-center">
        <span>
          <FontAwesomeIcon icon={faBell} className="me-2" /> Notificaciones
        </span>
        {notiCount > 0 && (
          <span className="badge bg-danger rounded-pill" style={{ fontSize: "0.75rem", minWidth: "20px", textAlign: "center" }}>
            {notiCount}
          </span>
        )}
      </Link>

      <Link to="/configuracion" className="btn btn-light w-100 mb-3 text-start">
        <FontAwesomeIcon icon={faGear} className="me-2" /> Configuración
      </Link>

      {/* Estado de sesión y botón de cerrar sesión */}
      <div className="w-100 mt-auto">
        {user ? (
          <>
            <div className="alert alert-success text-center p-2 small">
              Sesión iniciada como <strong>{user.email}</strong>
            </div>
            <button className="btn btn-danger w-100" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <button className="btn btn-primary w-100" onClick={irALogin}>
            Iniciar sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;


