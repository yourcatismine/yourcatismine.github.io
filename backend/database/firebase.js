// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvwcNbu9RAedOgPWcgrCk814r9eSQs0FE",
  authDomain: "ender-9b93f.firebaseapp.com",
  databaseURL: "https://ender-9b93f-default-rtdb.firebaseio.com",
  projectId: "ender-9b93f",
  storageBucket: "ender-9b93f.firebasestorage.app",
  messagingSenderId: "350732174553",
  appId: "1:350732174553:web:3dae26f9bbcb59cebc2ac8",
  measurementId: "G-JEC55ZPJC9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
