// db.js
import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

export async function logToFirebase(visitorData) {
  const visitorsRef = ref(db, "visitors");
  await push(visitorsRef, visitorData);
}
