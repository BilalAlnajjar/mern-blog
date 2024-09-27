// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mearn-blog-2f9c0.firebaseapp.com",
    projectId: "mearn-blog-2f9c0",
    storageBucket: "mearn-blog-2f9c0.appspot.com",
    messagingSenderId: "260488069613",
    appId: "1:260488069613:web:435df4650e22f1d9a2a7e4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);