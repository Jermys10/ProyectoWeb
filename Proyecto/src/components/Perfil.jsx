import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { Form, Button, Image, Spinner, Row, Col } from "react-bootstrap";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState([]);
  

  const opcionesDeIntereses = [
    "Tecnología", "Deportes", "Música", "Viajes", "Lectura",
    "Cine", "Arte", "Ciencia", "Fotografía", "Gastronomía",
    "Videojuegos", "Moda", "Medio ambiente", "Política", "Negocios",
    "Salud y bienestar", "Educación", "Emprendimiento", "Historia", "Idiomas",
    "Mascotas", "Escritura", "Astronomía", "Finanzas personales", "Diseño gráfico",
    "Animación", "Psicología", "Jardinería"
  ];

  const navigate = useNavigate();

  // Función para dividir array en chunks
  function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (usuario) => {
      setUser(usuario);
      if (usuario) {
        try {
          const docRef = doc(db, "usuarios", usuario.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBio(data.bio || "");
            setGender(data.gender || "");
            setImageUrl(data.profileImageUrl || "");
            setPreview(data.profileImageUrl || usuario.photoURL || null);
            setInterests(data.interests || []);
            setAge(data.age || []);
          } else {
            setPreview(usuario.photoURL || null);
            setInterests([]);
          }
        } catch (error) {
          console.error("Error al cargar datos del perfil:", error);
          setPreview(usuario.photoURL || null);
          setInterests([]);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreview(url);
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setInterests((prev) => {
      let updated;
      if (checked) {
        updated = [...new Set([...prev, value])];
      } else {
        updated = prev.filter((i) => i !== value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const formData = {
      bio,
      gender,
      profileImageUrl: imageUrl || "",
      email: user.email,
      uid: user.uid,
      displayName: user.displayName || "",
      interests,
      age,
    };

    try {
      await setDoc(doc(db, "usuarios", user.uid), formData, { merge: true });

      if (imageUrl) {
        await updateProfile(auth.currentUser, { photoURL: imageUrl });
        setUser({ ...user, photoURL: imageUrl });
      }
         // Agregar notificación en colección "notificaciones"
    await addDoc(collection(db, "notificaciones"), {
      uid: user.uid,
      mensaje: "Tu perfil fue actualizado correctamente.",
      fecha: serverTimestamp(),
      leido: false,
    });

      alert("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al guardar en Firestore o actualizar perfil:", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  if (!user)
    return <div className="container mt-5">No hay usuario autenticado.</div>;

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" /> Cargando datos...
      </div>
    );

    

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Configuración del Perfil</h2>

      <div
        className="container my-4"
        style={{ maxWidth: 650, textAlign: "center" }}
      >
        {preview ? (
          <img
            src={preview}
            alt={user.displayName || "Foto perfil"}
            className="rounded-circle"
            style={{
              width: 150,
              height: 150,
              objectFit: "cover",
              marginBottom: 16,
            }}
          />
        ) : (
          <div
            className="bg-secondary rounded-circle mx-auto"
            style={{ width: 150, height: 150, marginBottom: 16 }}
            title="Sin foto de perfil"
          />
        )}
        <h2>{user.displayName || "Nombre no disponible"}</h2>
        <p>
          <strong>Email:</strong> {user.email || "Email no disponible"}
        </p>

        {/* Mostrar intereses debajo de la foto */}
        <div style={{ marginBottom: 16 }}>
          {interests.length > 0 ? (
            <>
              {interests.map((interest) => (
                <span
                  key={interest}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "15px",
                    fontSize: 12,
                    marginRight: 6,
                    marginTop: 4,
                  }}
                >
                  {interest}
                </span>
              ))}
            </>
          ) : (
            <span style={{ color: "#666" }}>No tienes intereses seleccionados</span>
          )}
        </div>
      </div>

      <hr />

      <Form onSubmit={handleSubmit}>
        {/* Intereses */}
        <Form.Group className="mb-3">
          <Form.Label>
            <strong>Intereses</strong>
          </Form.Label>
          <hr />
          {chunkArray(opcionesDeIntereses, 6).map((grupo, idx) => (
            <Row key={idx} className="mb-2">
              {grupo.map((interest) => (
                <Col xs={6} md={4} lg={2} key={interest}>
                  <Form.Check
                    type="checkbox"
                    id={`interest-${interest}`}
                    label={interest}
                    value={interest}
                    checked={interests.includes(interest)}
                    onChange={handleInterestChange}
                  />
                </Col>
              ))}
            </Row>
          ))}
        </Form.Group>

        {/* URL foto */}
        <Form.Group className="mb-3">
          <Form.Label>
            <strong>URL de la foto de perfil</strong>
          </Form.Label>
          <hr />
          {preview ? (
            <Image
              src={preview}
              roundedCircle
              width={100}
              height={100}
              className="mb-2"
            />
          ) : (
            <div className="mb-2 text-secondary">
              No hay URL válida para mostrar imagen
            </div>
          )}
          <Form.Control
            type="text"
            placeholder="https://ejemplo.com/mi-foto.jpg"
            value={imageUrl}
            onChange={handleImageUrlChange}
          />
        </Form.Group>

        {/* Bio */}
        <Form.Group className="mb-3">
          <Form.Label>Presentación</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            maxLength={150}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Ej. "La tecnología hace que todo sea posible."'
          />
          <Form.Text muted>{bio.length} / 150 caracteres</Form.Text>
        </Form.Group>

        {/* Género */}
        <Form.Group className="mb-3">
          <Form.Label>Género</Form.Label>
          <Form.Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </Form.Select>
          <Form.Text muted>No se incluirá en tu perfil público.</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
  <Form.Label>Edad</Form.Label>
  <Form.Control
    type="number"
    placeholder="Ingrese su edad"
    value={age}
    onChange={(e) => setAge(e.target.value)}
    min={0}
    max={120}
  />
  <Form.Text muted>Debe ser mayor de 0 años.</Form.Text>
</Form.Group>

        <Button type="submit" variant="primary">
          Guardar
        </Button>
        <Button className="m-3" variant="secondary" onClick={() => navigate("/")}>
          Volver al Home
        </Button>
      </Form>
    </div>
  );
}
