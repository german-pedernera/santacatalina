import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD3pFGNDHgdHAC31vweoZPf5Walhn2jsas",
  authDomain: "compraventa-ab9f1.firebaseapp.com",
  databaseURL: "https://compraventa-ab9f1-default-rtdb.firebaseio.com",
  projectId: "compraventa-ab9f1",
  storageBucket: "compraventa-ab9f1.firebasestorage.app",
  messagingSenderId: "811463317137",
  appId: "1:811463317137:web:0fb11ab55f4cc3a200d130",
  measurementId: "G-HYZSD7DVGC"
};

const app = initializeApp(firebaseConfig);

// Initialize Analytics safely
export let analytics;
isSupported().then(yes => {
  if (yes) analytics = getAnalytics(app);
}).catch(err => console.error("Analytics not supported:", err));

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
