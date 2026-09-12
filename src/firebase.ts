import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAoMugVPCSLdoPCfDFweSfsHMs5mBlvBzA",
  authDomain: "skillsbridge-a78b8.firebaseapp.com",
  projectId: "skillsbridge-a78b8",
  storageBucket: "skillsbridge-a78b8.firebasestorage.app",
  messagingSenderId: "122669371074",
  appId: "1:122669371074:web:9573868fd8e7ebda6b755b",
  measurementId: "G-XGKY1D1RV4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);