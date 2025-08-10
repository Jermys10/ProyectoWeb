import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const collectionStr = "usuarios"; // colección para perfiles

// Obtener perfil por uid
export const onGetProfile = async (uid) => {
  const docRef = doc(db, collectionStr, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null; // No existe perfil
  }
};

// Crear o actualizar perfil (setDoc reemplaza o crea)
export const onSaveProfile = async (uid, profileData) => {
  const docRef = doc(db, collectionStr, uid);
  await setDoc(docRef, profileData);
};

// Eliminar perfil
export const onDeleteProfile = async (uid) => {
  const docRef = doc(db, collectionStr, uid);
  await deleteDoc(docRef);
};
