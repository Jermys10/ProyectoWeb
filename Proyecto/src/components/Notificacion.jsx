import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Badge, Button, Card, Container, Spinner, Form } from "react-bootstrap";
export default function Notificacion() {
  const [user, setUser] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todo"); // Opciones: "todo", "leidas", "noLeidas"
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notificaciones"),
      where("uid", "==", user.uid),
      orderBy("fecha", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notis = [];
      querySnapshot.forEach((doc) => {
        notis.push({ id: doc.id, ...doc.data() });
      });
      setNotificaciones(notis);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const marcarComoLeido = async (id) => {
    await updateDoc(doc(db, "notificaciones", id), { leido: true });
  };

  const notisNoLeidas = notificaciones.filter((n) => !n.leido);

  const notificacionesFiltradas = notificaciones.filter((n) => {
    // Filtrar por estado
    if (filtro === "leidas" && !n.leido) return false;
    if (filtro === "noLeidas" && n.leido) return false;
    // Filtrar por texto de búsqueda (en mensaje)
    if (
      buscar.trim() !== "" &&
      !n.mensaje.toLowerCase().includes(buscar.toLowerCase())
    )
      return false;

    return true;
  });

  if (!user)
    return (
      <Container className="mt-4">
        <p>Por favor inicia sesión para ver tu buzón.</p>
      </Container>
    );

  if (loading)
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" />
        <p>Cargando notificaciones...</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      <h4>
        Notificaciones{" "}
        <Badge pill bg={notisNoLeidas.length > 0 ? "danger" : "secondary"}>
          {notisNoLeidas.length}
        </Badge>
      </h4>

      <Form className="mb-3 d-flex gap-2">
        <Form.Select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ maxWidth: 150 }}
        >
          <option value="todo">Todas</option>
          <option value="leidas">Leídas</option>
          <option value="noLeidas">No Leídas</option>
        </Form.Select>

        <Form.Control
          type="search"
          placeholder="Buscar..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
      </Form>

      {notificacionesFiltradas.length === 0 && (
        <p className="mt-3">No hay notificaciones que coincidan con el filtro.</p>
      )}

      {notificacionesFiltradas.map(({ id, mensaje, fecha, leido }) => (
        <Card
          key={id}
          bg={leido ? "light" : "success"}
          text={leido ? "dark" : "white"}
          className="mb-3"
          border={leido ? "secondary" : "success"}
        >
          <Card.Body>
            <Card.Text>{mensaje}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">
              {fecha?.toDate().toLocaleString()}
            </Card.Subtitle>
            {!leido && (
              <Button
                size="sm"
                variant="outline-light"
                onClick={() => marcarComoLeido(id)}
              >
                Marcar como leído
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}






