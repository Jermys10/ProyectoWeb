import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const EmailForm = () => {
  const [formData, setFormData] = useState({
    to_email: '',
    user_name: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_66hjlxc',     // Service ID
      'template_i3aakkh',    // Template ID
      formData,
      '2rVUPG1OyaWZJpvim'    // Public Key
    )
    .then((result) => {
      alert(' Mensaje enviado correctamente');
      console.log(result.text);
    })
    .catch((error) => {
      alert(' Error al enviar el mensaje');
      console.error(error.text);
    });
  };

  return (
    <form onSubmit={sendEmail}>
      <label>Correo del destinatario</label>
      <input
        type="email"
        name="to_email"
        value={formData.to_email}
        onChange={handleChange}
        required
      />

      <label>Nombre</label>
      <input
        type="text"
        name="user_name"
        value={formData.user_name}
        onChange={handleChange}
        required
      />

      <label>Mensaje</label>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
      />

      <button type="submit">Enviar Notificación</button>
    </form>
  );
};

export default EmailForm;
