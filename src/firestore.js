import firebase from 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyCxbUqSlq5dwIjyBwCPl5gpRVC8PP1iNJE",
    authDomain: "lhs-schedule-app.firebaseapp.com",
    databaseURL: "https://lhs-schedule-app-default-rtdb.firebaseio.com",
    projectId: "lhs-schedule-app",
    storageBucket: "lhs-schedule-app.appspot.com",
    messagingSenderId: "92484074852",
    appId: "1:92484074852:web:6df58923c87e8a99d84e71",
    measurementId: "G-PR4HESYWTG"
});

let db = firebase.firestore();

export default {
    firebase, db
}