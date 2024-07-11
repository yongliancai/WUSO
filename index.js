// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4NzV-q4dBn_IytInpXlbbhEPaHJU9ULk",
  authDomain: "webavr-b9273.firebaseapp.com",
  databaseURL: "https://webavr-b9273-default-rtdb.firebaseio.com",
  projectId: "webavr-b9273",
  storageBucket: "webavr-b9273.appspot.com",
  messagingSenderId: "240463881336",
  appId: "1:240463881336:web:6642598bf894378f2ff98d",
  measurementId: "G-6Q7ZQ22WJN",
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
