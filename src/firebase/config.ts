import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXBpIe4FgVqFiA7-nlX05xIieuOwBec8I",
  authDomain: "voiast.firebaseapp.com",
  projectId: "voiast",
  storageBucket: "voiast.firebasestorage.app",
  messagingSenderId: "255166202632",
  appId: "1:255166202632:web:8504461f31fe0e4db1a2bd",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
