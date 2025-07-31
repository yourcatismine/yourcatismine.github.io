import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onChildAdded, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

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
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("visitor-table-body");
  const visitorCountElement = document.getElementById("visitor-count");
  const visitorsRef = ref(database, "visitors");

  onChildAdded(visitorsRef, snapshot => {
    const { ip, country, platform, city, region, timestamp, referrer } = snapshot.val();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ip}</td>
      <td>${platform}</td>
      <td>${country}</td>
      <td>${city}</td>
      <td>${region || 'N/A'}</td>
      <td>${new Date(timestamp).toLocaleString()}</td>
      <td>${referrer}</td>
    `;
    tbody.appendChild(tr);
  });

  onValue(visitorsRef, snapshot => {
    const data = snapshot.val() || {};
    const total = Object.keys(data).length;
    animateVisitorCount(0, total, 300);
  });

  function animateVisitorCount(start, end, duration) {
    const range = end - start;
    if (range <= 0) {
      visitorCountElement.textContent = end;
      return;
    }
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(start + Math.floor((progress / duration) * range), end);
      visitorCountElement.textContent = current;
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        visitorCountElement.textContent = end;
      }
    }
    window.requestAnimationFrame(step);
  }

  const counters = [
    { id: "projects-counter", target: 8, duration: 300 },
    { id: "languages-counter", target: 5, duration: 300 },
    { id: "github-counter", target: 3, duration: 300 }
  ];

  counters.forEach(({ id, target, duration }) => {
    const counterElement = document.getElementById(id);
    animateNumber(counterElement, target, duration);
  });

  function animateNumber(element, target, duration) {
    const start = 0;
    const range = target - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(start + Math.floor((progress / duration) * range), target);
      element.textContent = current;
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target;
      }
    }

    window.requestAnimationFrame(step);
  }
});