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
  
  const documentsContainer = document.getElementById("documents-container");
  
  async function loadAllDocuments() {
    try {
      const usersSnapshot = await db.collection("users").get();
      documentsContainer.innerHTML = ""; // 清空容器
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
  
        if (userData.papers && Array.isArray(userData.papers)) {
          for (const paperTitle of userData.papers) {
            const collectionRef = db
              .collection("users")
              .doc(userId)
              .collection(paperTitle);
            const paperDocsSnapshot = await collectionRef.get();
  
            // 創建一個區域來顯示這個集合的所有文檔
            const documentSection = document.createElement("div");
            documentSection.classList.add("document-section");
            documentSection.innerHTML = `<h2>${paperTitle}</h2><p><strong>Uploaded by:</strong> ${userData.username}</p>`;
  
            paperDocsSnapshot.forEach((doc) => {
              const data = doc.data();
              const paperDetailElement = document.createElement("p");
              paperDetailElement.innerHTML = `<strong>${data.type}:</strong> ${
                data.content || data.link
              }`;
              documentSection.appendChild(paperDetailElement);
            });
  
            documentsContainer.appendChild(documentSection);
          }
        }
      }
    } catch (error) {
      console.error("Error loading documents: ", error);
    }
  }
  
  loadAllDocuments();
  // 監聽認證狀態變化
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
  