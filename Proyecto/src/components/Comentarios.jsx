import React, { useEffect, useState } from "react";
import {
  agregarComentario,
  suscribirseAComentarios,
} from "../services/publicaciones-service";

export default function Comentarios({ postId, user }) {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  useEffect(() => {
    const unsubscribe = suscribirseAComentarios(postId, (snapshot) => {
      setComentarios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [postId]);

  const handleAgregar = async () => {
    if (!nuevoComentario.trim()) return;
    await agregarComentario(postId, { autor: user.email, texto: nuevoComentario });
    setNuevoComentario("");
  };

  return (
    <div>
      <ul>
        {comentarios.map((c) => (
          <li key={c.id}>
            <strong>{c.autor}</strong>: {c.texto}
          </li>
        ))}
      </ul>
      <input
        value={nuevoComentario}
        onChange={(e) => setNuevoComentario(e.target.value)}
        placeholder="Escribe un comentario"
      />
      <button onClick={handleAgregar}>Agregar</button>
    </div>
  );
}

