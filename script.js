// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// DOM Elements
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("file");
const codeInput = document.getElementById("code");
const fileList = document.getElementById("file-list");

// Upload file to Firebase
uploadBtn.addEventListener("click", async () => {
  const rawCode = codeInput.value.trim().toLowerCase().replace(/\s+/g, '-');
  const section = prompt("Enter your class/section (e.g., fyit, syit):")?.trim().toLowerCase() || 'general';
  const code = `${rawCode}-${new Date().getFullYear()}-${section}`;
  const file = fileInput.files[0];

  if (!rawCode || !file) {
    alert("Please enter a code and select a file.");
    return;
  }

  const filePath = `${code}/${Date.now()}-${file.name}`;
  const fileRef = storageRef(storage, filePath);

  try {
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, "files"), {
      code,
      fileName: file.name,
      fileURL: downloadURL,
      uploadedAt: new Date()
    });

    alert("File uploaded successfully.");
    fileInput.value = "";
    loadFiles(code);
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed. Check console for errors.");
  }
});

// Load uploaded files by code
async function loadFiles(code) {
  fileList.innerHTML = "";
  const q = query(collection(db, "files"), where("code", "==", code));
  const snapshot = await getDocs(q);

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

// Load files when user leaves code input
codeInput.addEventListener("blur", () => {
  const rawCode = codeInput.value.trim().toLowerCase().replace(/\s+/g, '-');
  const section = prompt("Enter class/section to view uploaded files (e.g., fyit):")?.trim().toLowerCase() || 'general';
  const code = `${rawCode}-${new Date().getFullYear()}-${section}`;
  if (code) loadFiles(code);
});
