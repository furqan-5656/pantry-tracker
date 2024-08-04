// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore, getfirestore}  from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8yHZ7ukaYnNxabcCHqyDBkLpGyJF5ndc",
  authDomain: "inventory-managment-6701e.firebaseapp.com",
  projectId: "inventory-managment-6701e",
  storageBucket: "inventory-managment-6701e.appspot.com",
  messagingSenderId: "744519166879",
  appId: "1:744519166879:web:bb17eb027887f2cc98ebaa",
  measurementId: "G-6MK4XRVMCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };