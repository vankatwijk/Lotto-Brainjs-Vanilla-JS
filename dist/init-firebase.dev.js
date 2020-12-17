"use strict";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDp1yF5-PsVi4FjhSCtOc4hw7xPHNhN52k",
  authDomain: "super-orange-app.firebaseapp.com",
  projectId: "super-orange-app",
  storageBucket: "super-orange-app.appspot.com",
  messagingSenderId: "989993684913",
  appId: "1:989993684913:web:7912015257912ee6b9b790",
  measurementId: "G-CGJCS4C3JZ"
}; // Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();