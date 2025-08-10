import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase-config";

/*1. Crear constante para la conleccion -> nombre */
const collectionStr = "contactos";

/**2. Crear y Export los metodos */

export const onFindAll = async () => {
  const result = await getDocs(query(collection(db, collectionStr)));

  return result;
};

export const onFindById = async (paramId) => {
  const result = await getDoc(doc(db, collectionStr, paramId));

  return result;
};

export const onInsert = async (documento) =>
  await addDoc(collection(db, collectionStr), documento);

export const onUpdate = async (paramId, newDoc) =>
  await updateDoc(doc(db, collectionStr, paramId), newDoc);

export const onDelete = async (paramId) =>
  await deleteDoc(doc(db, collectionStr, paramId));
