// src/components/RoleRoute.jsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function RoleRoute({ children, role }) {
  const [allowed, setAllowed] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role === role) {
        setAllowed(true);
      } else {
        navigate("/login");
      }
    };

    checkRole();
  }, [navigate, role]);

  if (allowed === null) return <div>Verificando rol...</div>;

  return <>{children}</>;
}
