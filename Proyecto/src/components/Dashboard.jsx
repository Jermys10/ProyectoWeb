import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes llamar a auth.signOut() si usas Firebase Auth
    // auth.signOut().then(() => navigate('/login'));
    navigate("/login");
  };

  return (
    <div className="d-flex vh-100 flex-column">

      {/* Navbar superior */}
      <nav className="navbar navbar-dark bg-primary px-4">
        <span className="navbar-brand mb-0 h1">Panel de Administración</span>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Salir
        </button>
      </nav>

      <div className="d-flex flex-grow-1">

        {/* Sidebar */}
        <nav
          className="bg-light border-end d-none d-md-flex flex-column p-3"
          style={{ width: "220px" }}
        >
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item mb-2">
              <a href="#resumen" className="nav-link link-dark">
                Resumen
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#graficos" className="nav-link link-dark">
                Gráficos
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#usuarios" className="nav-link link-dark">
                Usuarios
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#configuracion" className="nav-link link-dark">
                Configuración
              </a>
            </li>
          </ul>
        </nav>

        {/* Contenido principal */}
        <main className="flex-grow-1 overflow-auto p-4">
          {/* Resumen */}
          <section id="resumen" className="mb-5">
            <h3>Resumen</h3>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card text-white bg-primary">
                  <div className="card-body">
                    <h5 className="card-title">Usuarios Registrados</h5>
                    <p className="card-text display-4">120</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-success">
                  <div className="card-body">
                    <h5 className="card-title">Ventas Hoy</h5>
                    <p className="card-text display-4">$4,500</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-warning">
                  <div className="card-body">
                    <h5 className="card-title">Tickets Pendientes</h5>
                    <p className="card-text display-4">8</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gráficos (placeholder) */}
          <section id="graficos" className="mb-5">
            <h3>Gráficos</h3>
            <div className="p-5 bg-light border rounded text-center">
              <p className="text-muted">Aquí puedes insertar gráficos (Chart.js, Recharts, etc.)</p>
            </div>
          </section>

          {/* Tabla de usuarios */}
          <section id="usuarios">
            <h3>Usuarios</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Ejemplo estático, reemplaza con datos reales */}
                  <tr>
                    <td>Ana Pérez</td>
                    <td>ana@example.com</td>
                    <td>Admin</td>
                    <td><span className="badge bg-success">Activo</span></td>
                  </tr>
                  <tr>
                    <td>Carlos Gómez</td>
                    <td>carlos@example.com</td>
                    <td>Usuario</td>
                    <td><span className="badge bg-secondary">Inactivo</span></td>
                  </tr>
                  <tr>
                    <td>Laura Martínez</td>
                    <td>laura@example.com</td>
                    <td>Usuario</td>
                    <td><span className="badge bg-success">Activo</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
