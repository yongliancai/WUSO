// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdjW4ZZIZ4wVVfE0iOaFNJ3CwDh09breA",
    authDomain: "wuso-41655.firebaseapp.com",
    projectId: "wuso-41655",
    storageBucket: "wuso-41655.appspot.com",
    messagingSenderId: "633187861207",
    appId: "1:633187861207:web:0e81f6a40f11b2c691e692",
    measurementId: "G-1YLXMG04FV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  // 切換顯示登入和註冊表單
  document.getElementById("show-register").addEventListener("click", () => {
      document.getElementById("login-section").classList.remove("active");
      document.getElementById("register-section").classList.add("active");
  });

  document.getElementById("show-login").addEventListener("click", () => {
      document.getElementById("register-section").classList.remove("active");
      document.getElementById("login-section").classList.add("active");
  });

  // 註冊功能
  document.getElementById("register-button").addEventListener("click", async () => {
      const username = document.getElementById("register-username").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const confirmPassword = document.getElementById("register-confirm-password").value;

      if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
      }

      try {
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          const user = userCredential.user;

          await db.collection("users").doc(user.uid).set({
              username: username,
              email: email,
              password: password,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });

          alert("User registered successfully!");
          document.getElementById("show-login").click();
      } catch (error) {
          console.error("Error registering user: ", error);
          alert("Error registering user: " + error.message);
      }
  });

  // 登入功能
  document.getElementById("login-button").addEventListener("click", async () => {
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
          const userCredential = await auth.signInWithEmailAndPassword(email, password);
          const user = userCredential.user;

          await db.collection("users").doc(user.uid).update({
              lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          });

          alert("User logged in successfully!");
          window.location.href = "index.html";
      } catch (error) {
          console.error("Error logging in user: ", error);
          alert("Error logging in user: " + error.message);
      }
  });
});
