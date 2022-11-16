import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: "yt-clone-69.firebaseapp.com",
    projectId: "yt-clone-69",
    storageBucket: "yt-clone-69.appspot.com",
    messagingSenderId: "784049895280",
    appId: "1:784049895280:web:fc429fcd503637dcb881b5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
