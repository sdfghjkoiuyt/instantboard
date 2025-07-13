import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loadBtn = document.getElementById("loadBtn");
const codeInput = document.getElementById("code");
const fileList = document.getElementById("file-list");

// Load files when button is clicked
loadBtn.addEventListener("click", () => {
  const rawCode = codeInput.value.trim().toLowerCase().replace(/\s+/g, '-');
  const section = prompt("Enter your class/section (e.g., fyit, syit):")?.trim().toLowerCase() || 'general';
  const code = `${rawCode}-${new Date().getFullYear()}-${section}`;
  loadFiles(code);
});

// Load file list from Firestore
async function loadFiles(code) {
  fileList.innerHTML = "";
  const q = query(collection(db, "files"), where("code", "==", code));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    fileList.innerHTML = "<li>No files found for this code.</li>";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = data.fileURL;
    a.textContent = data.fileName;
    a.target = "_blank";
    li.appendChild(a);
    fileList.appendChild(li);
  });
}
