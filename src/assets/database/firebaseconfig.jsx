// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializa Firebase
const appfirebase = initializeApp(firebaseConfig);

// Inicializa Storage
const storage = getStorage(appfirebase);

// Inicializa Auth
const auth = getAuth(appfirebase);

// Inicializa Firestore
const db = getFirestore(appfirebase);

// Habilitar la persistencia de IndexedDB en Firestore
enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Persistencia de IndexedDB habilitada.");
  })
  .catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("La persistencia solo está disponible en una pestaña a la vez.");
    } else if (err.code === "unimplemented") {
      console.warn("El navegador no soporta persistencia offline.");
    } else {
      console.error("Error al habilitar la persistencia:", err);
    }
  });

export { appfirebase, db, auth, storage };
