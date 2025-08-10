import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { Card, Container, Spinner, Row, Col } from 'react-bootstrap';

const SharedPostsPage = () => {
  const [sharedPosts, setSharedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'sharedPosts'),
      where('sharedByUserId', '==', auth.currentUser.uid),
      orderBy('sharedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shares = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSharedPosts(shares);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!auth.currentUser) {
    return (
      <Container className="text-center my-5">
        <h5 className="text-danger">Debes iniciar sesión para ver tus publicaciones compartidas.</h5>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 fw-bold text-primary text-center">Mis publicaciones compartidas</h2>

      {sharedPosts.length === 0 ? (
        <p className="text-center text-secondary fs-5">No has compartido ninguna publicación aún.</p>
      ) : (
        <div className="d-flex flex-column gap-4">
          {sharedPosts.map((share) => (
            <Card key={share.id} className="shadow-sm border-0 rounded-4 d-flex flex-row align-items-center p-3" style={{ maxHeight: '150px' }}>
              {share.sharedImageUrl && (
                <img
                  src={share.sharedImageUrl}
                  alt="Imagen compartida"
                  className="rounded-4"
                  style={{
                    height: '120px',
                    width: '160px',
                    objectFit: 'cover',
                    flexShrink: 0,
                    marginRight: '20px',
                  }}
                />
              )}
              <div className="flex-grow-1 d-flex flex-column justify-content-between" style={{ minHeight: '120px' }}>
                <div>
                  <Card.Subtitle className="mb-2 text-muted fst-italic" style={{ fontSize: '0.9rem' }}>
                    Compartido el: {share.sharedAt?.toDate().toLocaleString() || 'Fecha no disponible'}
                  </Card.Subtitle>
                  <Card.Text style={{ fontSize: '1rem', lineHeight: '1.3', maxHeight: '72px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {share.sharedText || 'Sin contenido'}
                  </Card.Text>
                </div>
                <Card.Footer className="p-0 border-0 bg-transparent">
                  <small className="text-muted fst-italic">Compartido por: {share.sharedByUserName}</small>
                </Card.Footer>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default SharedPostsPage;








