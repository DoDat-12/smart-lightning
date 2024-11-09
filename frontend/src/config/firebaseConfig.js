import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAbAGV70x8WRn7F5VUeY42ORStAUcarZxQ",
    authDomain: "smart-lightning-f2539.firebaseapp.com",
    databaseURL: "https://smart-lightning-f2539-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smart-lightning-f2539",
    storageBucket: "smart-lightning-f2539.firebasestorage.app",
    messagingSenderId: "31406216539",
    appId: "1:31406216539:web:b4ff4d7abb0b1e7ad8367e",
    measurementId: "G-G34YE7GWDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };