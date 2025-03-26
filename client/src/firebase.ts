// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMrgtbBJ3C64l5UEFIf5ex_ISIgaBVD98",
  authDomain: "assignment-20833.firebaseapp.com",
  projectId: "assignment-20833",
  storageBucket: "assignment-20833.firebasestorage.app",
  messagingSenderId: "606483627579",
  appId: "1:606483627579:web:7d939e6e64fa54fb72e61e",
  measurementId: "G-3D63C6Y9VN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const signinWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return {
    email: result.user.email,
    name: result.user.displayName,
    uid: result.user.uid,
  };
};
