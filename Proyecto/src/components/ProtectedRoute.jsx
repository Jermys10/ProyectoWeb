import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Navigate } from "react-router-dom";

// Importa FontAwesomeIcon para renderizar íconos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const checkSuspended = async () => {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap.exists() && snap.data().suspended) {
            await auth.signOut();
            alert("Tu cuenta ha sido suspendida.");
            setUser(null);
          } else {
            setUser(currentUser);
          }
          setLoading(false);
        };
        checkSuspended();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

