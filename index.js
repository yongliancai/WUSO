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
auth.onAuthStateChanged(async (user) => {
  const loginLogoutLink = document.getElementById("login-logout");
  const usernameSpan = document.getElementById("username");

  if (user) {
    // 使用者已登入
    loginLogoutLink.textContent = "登出";
    loginLogoutLink.onclick = () => auth.signOut();

    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        usernameSpan.textContent = `Hello, ${userData.username}`;
      }
    } catch (error) {
      console.error("Error getting user information: ", error);
    }
  } else {
    // 使用者未登入
    loginLogoutLink.textContent = "登入";
    loginLogoutLink.onclick = () => (window.location.href = "login.html");
    usernameSpan.textContent = "";
  }
});
