// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBo1P9Y6ri-_081vf0ENIYB6yMGDib_JHY",
  authDomain: "dompim-family.firebaseapp.com",
  projectId: "dompim-family",
  storageBucket: "dompim-family.firebasestorage.app",
  messagingSenderId: "655896592958",
  appId: "1:655896592958:web:ba81649176c92166af476f",
  measurementId: "G-94KLMKLBWX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Only initialize analytics if in the browser and it's supported
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export const db = getFirestore(app);