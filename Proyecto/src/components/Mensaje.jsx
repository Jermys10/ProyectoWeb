import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

export default function Mensaje({ tipo = "info", texto = "", duracion = 3000, onClose }) {
  useEffect(() => {
    if (!texto) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duracion);
    return () => clearTimeout(timer);
  }, [texto, duracion, onClose]);

  if (!texto) return null;

  return (
    <Alert variant={tipo} onClose={onClose} dismissible>
      {texto}
    </Alert>
  );
}
