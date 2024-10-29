// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvDK536zGl5kv8ZONNkU5jSOQ26z6Vsdo",
  authDomain: "learnathon-2024.firebaseapp.com",
  projectId: "learnathon-2024",
  storageBucket: "learnathon-2024.appspot.com",
  messagingSenderId: "1052279169116",
  appId: "1:1052279169116:web:06ee102046cb9a182a0699",
  measurementId: "G-PVT25J7KV0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {
    db,
    storage,
    auth
};
