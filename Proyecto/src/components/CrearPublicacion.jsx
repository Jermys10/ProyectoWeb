import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import EmojiPicker from 'emoji-picker-react';
import emailjs from 'emailjs-com';

export default function CrearPublicacion() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [category, setCategory] = useState('Recomendacion');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setText((prevText) => prevText + emojiData.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para publicar.');
      return;
    }

    if (!text.trim() && !imageUrl.trim()) {
      alert('Debes escribir algo o incluir una imagen.');
      return;
    }

    try {
      // Crear publicación en Firestore
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: user.displayName || 'Anónimo',
        userEmail: user.email || 'Sin correo',
        text: text.trim(),
        mediaUrl: imageUrl.trim(),
        privacy,
        category,
        createdAt: serverTimestamp(),
      });

      // Enviar email notificando nueva publicación
      await emailjs.send(
        'service_66hjlxc',    // Tu Service ID
        'template_cp8pgmn',   // Tu Template ID
        {
          to_email: user.email,                // Email dinámico, usuario actual
          user_name: user.displayName || 'Anónimo',
          post_text: text.trim() || '(Imagen publicada)',
          category,
        },
        '2rVUPG1OyaWZJpvim'    // Tu Public Key
      );

      // Limpiar formulario
      setText('');
      setImageUrl('');
      setPrivacy('public');
      setCategory('Recomendacion');
      setShowEmojiPicker(false);

      alert('Publicación creada y correo enviado con éxito.');
    } catch (error) {
      console.error('Error al crear publicación o enviar correo:', error);
      alert('Hubo un error al publicar o enviar la notificación.');
    }
  };

  return (
    <div className="container mt-4">
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded bg-white shadow-sm position-relative"
      >
        <div className="mb-3">
          <label htmlFor="postText" className="form-label">Texto</label>
          <textarea
            id="postText"
            className="form-control"
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué estás pensando?"
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary mt-2"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            {showEmojiPicker ? 'Cerrar emojis' : 'Agregar emoji'}
          </button>
          {showEmojiPicker && (
            <div style={{ position: 'absolute', zIndex: 1000 }}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">URL de Imagen</label>
          <input
            type="text"
            id="imageUrl"
            className="form-control"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="category" className="form-label">Categoría</label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Recomendacion">Recomendación</option>
              <option value="Ropa">Ropa</option>
              <option value="Comida">Comida</option>
              <option value="Maquillaje">Maquillaje</option>
              <option value="Película">Película</option>
              <option value="Trabajo">Trabajo</option>
              <option value="Emociones">Emociones</option>
              <option value="Hogar">Hogar</option>
              <option value="Juegos">Juegos</option>
              <option value="Viajes">Viajes</option>
              <option value="Fitness">Fitness</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="privacy" className="form-label">Privacidad</label>
            <select
              id="privacy"
              className="form-select"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value="public">Público</option>
              <option value="private">Privado</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Publicar
        </button>
      </form>
    </div>
  );
}











