// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import getFirebase from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI915XK1PUafEochFcSk7i5wIdl42Ovw0",
  authDomain: "flashcardsaas-f0183.firebaseapp.com",
  projectId: "flashcardsaas-f0183",
  storageBucket: "flashcardsaas-f0183.appspot.com",
  messagingSenderId: "558703402738",
  appId: "1:558703402738:web:fd2493127fbed368203a6b",
  measurementId: "G-4ZCWN2BGQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirebase(app);

export {db}