import React, { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup, Alert } from "react-bootstrap";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { auth } from "../firebase";
import emailjs from "emailjs-com";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // Asegúrate que el path sea correcto

const PostDetail = ({ show, handleClose, post, onLike, onShare }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post?.comments || []);
  const [shareComment, setShareComment] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setComments(post?.comments || []);
    setCommentText("");
    setShareComment("");
    setCopied(false);
  }, [post]);

  if (!post) return null;

  const liked = post.likedUsers?.includes(auth.currentUser?.uid);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments([...comments, { id: Date.now(), text: commentText }]);
    setCommentText("");
  };

  const handleShare = () => {
    if (!onShare) {
      console.error("onShare no es una función");
      return;
    }
    onShare(post, shareComment);
    setShareComment("");
  };

  const handleReportPost = async () => {
    if (!auth.currentUser) {
      alert('Debes iniciar sesión para reportar.');
      return;
    }
    try {
      await addDoc(collection(db, 'reports'), {
        type: 'post',
        targetId: post.id,
        reporterId: auth.currentUser.uid,
        reporterName: auth.currentUser.displayName || 'Anónimo',
        reportedUserId: post.userId,
        createdAt: serverTimestamp(),
      });
      alert('Publicación reportada.');
    } catch (error) {
      console.error('Error al reportar publicación:', error);
      alert('Error al reportar publicación.');
    }
  };

  const handleReportUser = async () => {
    if (!auth.currentUser) {
      alert('Debes iniciar sesión para reportar.');
      return;
    }
    try {
      await addDoc(collection(db, 'reports'), {
        type: 'user',
        targetId: post.userId,
        reporterId: auth.currentUser.uid,
        reporterName: auth.currentUser.displayName || 'Anónimo',
        createdAt: serverTimestamp(),
      });
      alert('Usuario reportado.');
    } catch (error) {
      console.error('Error al reportar usuario:', error);
      alert('Error al reportar usuario.');
    }
  };

  
 const handleLike = async (post, liked) => {
  const user = auth.currentUser;
  if (!user || !post) return;

  try {
    // Si aún no ha dado like
    if (!liked) {
      // 1. Enviar correo con EmailJS
      await emailjs.send(
        "service_66hjlxc",
        "template_cp8pgmn",
        {
          to_email: post.userEmail,
          liker_name: user.displayName || "Alguien",
          post_text: post.text || "(sin contenido)",
        },
        "2rVUPG1OyaWZJpvim"
      );

      // 2. Guardar notificación en Firestore
      if (user.uid !== post.userId) {
        await addDoc(collection(db, "notificaciones"), {
          uid: post.userId, // usuario que recibirá la notificación
          mensaje: `${user.displayName || "Alguien"} le dio like a tu publicación.`,
          fecha: serverTimestamp(),
          leido: false,
        });
      }
    }
  } catch (error) {
    console.error("Error al enviar notificación:", error);
  }
};


  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Publicación de {post.userName || "Usuario anónimo"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={post.mediaUrl || "https://via.placeholder.com/600x300"}
          className="img-fluid mb-3"
          alt="Publicación"
        />
        <p>
          <strong>Correo:</strong> {post.userEmail || "Sin correo"}
        </p>
        <p>{post.text}</p>
        <p>
          <strong>Likes ({post.likesCount || 0}):</strong>
        </p>
        <ListGroup
          className="mb-3"
          style={{ maxHeight: "100px", overflowY: "auto" }}
        >
          {post.likedUserNames?.length > 0 ? (
            post.likedUserNames.map((userName, idx) => (
              <ListGroup.Item key={idx}>{userName}</ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No hay likes aún.</ListGroup.Item>
          )}
        </ListGroup>

        <div className="d-flex justify-content-start gap-2 mt-3 mb-3">
          <Button
            variant={liked ? "danger" : "outline-danger"}
            size="sm"
            onClick={async () => {
              await handleLike(post, liked);     // 🔔 Notificación + email
              onLike(post, liked);               // ❤️ Actualiza likes en base de datos
            }}
          >
            <FaHeart className="me-1" />
            {liked ? "Te gusta" : "Me gusta"}
          </Button>

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => document.getElementById("comment-input").focus()}
          >
            <FaRegComment className="me-1" />
            Comentar
          </Button>
        </div>

        <Form.Group controlId="comment-input" className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Escribe un comentario..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddComment}
            className="mt-2"
          >
            Publicar comentario
          </Button>
        </Form.Group>

        <ListGroup variant="flush" className="mb-3">
          {comments.length === 0 ? (
            <ListGroup.Item>No hay comentarios aún.</ListGroup.Item>
          ) : (
            comments.map((c) => (
              <ListGroup.Item key={c.id}>{c.text}</ListGroup.Item>
            ))
          )}
        </ListGroup>

        <hr />

        <Form.Group controlId="share-comment" className="mb-3">
          <Form.Label>Comentario para compartir (opcional):</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Escribe un comentario para compartir esta publicación"
            value={shareComment}
            onChange={(e) => setShareComment(e.target.value)}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleShare}
            className="mt-2"
          >
            Compartir publicación
            <FaShare className="ms-2" />
          </Button>
        </Form.Group>

        {copied && (
          <Alert variant="success">¡Texto copiado al portapapeles!</Alert>
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="warning" size="sm" onClick={handleReportPost}>
            Reportar publicación
          </Button>
          <Button variant="warning" size="sm" onClick={handleReportUser}>
            Reportar usuario
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PostDetail;

