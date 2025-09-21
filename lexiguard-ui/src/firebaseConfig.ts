// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhoNfD5UGBpmcALt-tlz7yr0aKChX5Ptk",
  authDomain: "lexiguide-standard-472716.firebaseapp.com",
  projectId: "lexiguide-standard-472716",
  storageBucket: "lexiguide-standard-472716.firebasestorage.app",
  messagingSenderId: "17700989139",
  appId: "1:17700989139:web:1935876246158a503fcc26",
  measurementId: "G-NGH3BTTMXF"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);