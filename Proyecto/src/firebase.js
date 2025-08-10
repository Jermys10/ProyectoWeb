import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDHKdTzbgIHjrw5AZy6uJ2VX_id2Ecv1KU",
  authDomain: "friendup-a7720.firebaseapp.com",
  projectId: "friendup-a7720",
  storageBucket: "friendup-a7720.appspot.com",
  messagingSenderId: "69681166055",
  appId: "1:69681166055:web:cf50f63bbbdd297623d442",
};

const app = initializeApp(firebaseConfig);

// 🔹 Exportaciones correctas
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // << ESTA LÍNEA ES CLAVE
export const storage = getStorage(app);
