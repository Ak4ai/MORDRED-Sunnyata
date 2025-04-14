  // Firebase Modular Imports
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

  // Configuração do Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBTqNSXSGTD0uA7GtjdF-6oQsETq61YgUs",
    authDomain: "mordred-f7ea1.firebaseapp.com",
    projectId: "mordred-f7ea1",
    storageBucket: "mordred-f7ea1.firebasestorage.app",
    messagingSenderId: "248130349710",
    appId: "1:248130349710:web:b2b3b0af3528627de7f7df",
    measurementId: "G-GC5Z4S28R2"
  };

  // Inicialização
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const musicRef = db.collection("sync").doc("music");


  console.log("Firebase carregado com sucesso!");