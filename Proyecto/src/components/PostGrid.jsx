import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import PostDetail from './PostDetail';
import Topbar from './Topbar';
import { containsInappropriateContent } from '../moderation';

const PostGrid = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postList = [];
      for (const docSnap of querySnapshot.docs) {
        const data = { id: docSnap.id, ...docSnap.data() };
        if (containsInappropriateContent(data.text)) {
          await deleteDoc(doc(db, 'posts', docSnap.id));
          continue;
        }
        postList.push(data);
      }
      setPosts(postList);
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const handleLike = async (post, liked) => {
    if (!auth.currentUser) {
      alert('Debes iniciar sesión para dar like');
      return;
    }
    const postRef = doc(db, 'posts', post.id);
    try {
      if (liked) {
        await updateDoc(postRef, {
          likesCount: increment(-1),
          likedUsers: arrayRemove(auth.currentUser.uid),
          likedUserNames: arrayRemove(auth.currentUser.displayName || 'Anónimo'),
        });
      } else {
        await updateDoc(postRef, {
          likesCount: increment(1),
          likedUsers: arrayUnion(auth.currentUser.uid),
          likedUserNames: arrayUnion(auth.currentUser.displayName || 'Anónimo'),
        });
      }
      await fetchPosts();
      const updatedPost = posts.find((p) => p.id === post.id);
      setSelectedPost(updatedPost);
    } catch (error) {
      console.error('Error al actualizar like:', error);
    }
  };

  // Función para compartir publicación
  const handleShare = async (post, shareComment) => {
    if (!auth.currentUser) {
      alert('Debes iniciar sesión para compartir esta publicación.');
      return;
    }
    try {
      await addDoc(collection(db, 'sharedPosts'), {
        originalPostId: post.id,
        sharedByUserId: auth.currentUser.uid,
        sharedByUserName: auth.currentUser.displayName || 'Anónimo',
        sharedAt: serverTimestamp(),
        sharedImageUrl: post.mediaUrl || null,
        sharedText: shareComment || '',
      });
      alert('Publicación compartida con éxito.');
    } catch (error) {
      console.error('Error al compartir publicación:', error);
      alert('Error al compartir la publicación.');
    }
  };

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  return (
    <>
      <Topbar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchText={''} // opcional: implementar búsqueda
        onSearchTextChange={() => {}}
      />

      <div className="container mt-4">
        <div className="row">
          {filteredPosts.length === 0 ? (
            <p className="text-center">No hay publicaciones que coincidan.</p>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="col-12 col-md-4 mb-4"
                onClick={() => handleOpenPost(post)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card shadow-sm h-100">
                  <img
                    src={post.mediaUrl || '/placeholder.jpg'}
                    className="card-img-top"
                    alt="Publicación"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.userName || 'Usuario anónimo'}</h5>
                    <p className="card-text text-muted mb-1">
                      <small>{post.userEmail || 'Sin correo'}</small>
                    </p>
                    <p className="card-text">
                      <strong>Categoría:</strong> {post.category || 'Sin categoría'}
                    </p>
                    <p className="card-text">{post.text?.slice(0, 60)}...</p>
                    <p className="card-text">
                      <small>Likes: {post.likesCount || 0}</small>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <PostDetail
          show={showModal}
          handleClose={handleCloseModal}
          post={selectedPost}
          onLike={handleLike}
          onShare={handleShare} 
        />
      </div>
    </>
  );
};

export default PostGrid;



