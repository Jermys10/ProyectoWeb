import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "posts"));
    setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => navigate("/login"));
  };

  const handleToggleSuspend = async (user) => {
    await updateDoc(doc(db, "users", user.id), {
      suspended: !user.suspended,
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, suspended: !u.suspended } : u
      )
    );
  };

  const handleDeletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="d-flex vh-100 flex-column">
      <nav className="navbar navbar-dark bg-primary px-4">
        <span className="navbar-brand mb-0 h1">Panel de Administración</span>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Salir
        </button>
      </nav>

      <div className="d-flex flex-grow-1">
        <nav
          className="bg-light border-end d-none d-md-flex flex-column p-3"
          style={{ width: "220px" }}
        >
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item mb-2">
              <a href="#usuarios" className="nav-link link-dark">
                Usuarios
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#posts" className="nav-link link-dark">
                Publicaciones
              </a>
            </li>
          </ul>
        </nav>

        <main className="flex-grow-1 overflow-auto p-4">
          <section id="usuarios" className="mb-5">
            <h3>Usuarios</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{`${u.nombre || ""} ${u.apellido || ""}`}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.suspended ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {u.suspended ? "Suspendido" : "Activo"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleToggleSuspend(u)}
                        >
                          {u.suspended ? "Reactivar" : "Suspender"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="posts">
            <h3>Publicaciones</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Autor</th>
                    <th>Contenido</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.userName || "Usuario anónimo"}</td>
                      <td>{p.text?.slice(0, 50)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeletePost(p.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

