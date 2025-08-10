import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import emailjs from 'emailjs-com';

export default function SignUp() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");




  


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nombre,
        apellido,
        email: user.email,
        role: "user",
        suspended: false,
        createdAt: new Date(),
      });
      sendWelcomeEmail();

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const sendWelcomeEmail = () => {
    const templateParams = {
      //to_email: "flusheng26@gmail.com", email de probación
      to_email: email,
      user_name: `${nombre} ${apellido}`,
      message: `¡Bienvenido/a ${nombre} a nuestra aplicación!`,
    };

    emailjs
      .send(
        "service_66hjlxc",      // Reemplaza con tu Service ID
        "template_i3aakkh",     // Reemplaza con tu Template ID
        templateParams,
        "2rVUPG1OyaWZJpvim"    // Reemplaza con tu Public Key
      )
      .then(() => {
        console.log("Correo de bienvenida enviado");
      })
      .catch((err) => {
        console.error("Error al enviar correo:", err);
      });
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-4" style={{ letterSpacing: "2px" }}>
          CREAR CUENTA
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 mb-3">
            CREAR CUENTA
          </button>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex justify-content-between">
          <Link to="/forgot-password" className="text-primary">
            ¿OLVIDÓ SU CONTRASEÑA?
          </Link>
          <Link to="/login" className="text-primary">
            ¿YA TIENE CUENTA?
          </Link>
        </div>
      </div>
    </div>
  );
}

