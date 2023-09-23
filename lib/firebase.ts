// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBomm_HTJdb18yfBm3oEo9n6S6KT5OHtZ0",
  authDomain: "mind-jo.firebaseapp.com",
  projectId: "mind-jo",
  storageBucket: "mind-jo.appspot.com",
  messagingSenderId: "98472360003",
  appId: "1:98472360003:web:42953b3f10f4415ebd3cf6",
  measurementId: "G-X0Z1J57004",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
