// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4NzV-q4dBn_IytInpXlbbhEPaHJU9ULk",
    authDomain: "webavr-b9273.firebaseapp.com",
    databaseURL: "https://webavr-b9273-default-rtdb.firebaseio.com",
    projectId: "webavr-b9273",
    storageBucket: "webavr-b9273.appspot.com",
    messagingSenderId: "240463881336",
    appId: "1:240463881336:web:6642598bf894378f2ff98d",
    measurementId: "G-6Q7ZQ22WJN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async user => {
    if (user) {
        const userId = user.uid;
        const userNameElement = document.getElementById('user-name');
        const userEmailElement = document.getElementById('user-email');
        const papersContainer = document.getElementById('papers-container');

        // 獲取用戶信息
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                userNameElement.textContent = `Name: ${userData.username}`;
                userEmailElement.textContent = `Email: ${userData.email}`;

                // 獲取並顯示上傳的資料
                if (userData.papers && Array.isArray(userData.papers)) {
                    papersContainer.innerHTML = ''; // 清空容器
                    for (const paperTitle of userData.papers) {
                        const paperSection = document.createElement('div');
                        paperSection.classList.add('paper-section');
                        const paperTitleElement = document.createElement('h2');
                        paperTitleElement.textContent = paperTitle;
                        paperSection.appendChild(paperTitleElement);

                        const paperDocsSnapshot = await db.collection('users').doc(userId).collection(paperTitle).get();
                        paperDocsSnapshot.forEach(doc => {
                            const data = doc.data();
                            const paperDetailElement = document.createElement('p');
                            paperDetailElement.textContent = `${data.type}: ${data.content || data.link}`;
                            paperSection.appendChild(paperDetailElement);
                        });

                        papersContainer.appendChild(paperSection);
                    }
                } else {
                    papersContainer.innerHTML = '<p>No papers uploaded yet.</p>';
                }
            } else {
                userNameElement.textContent = "Name: Unknown";
                userEmailElement.textContent = "Email: Unknown";
            }
        } catch (error) {
            console.error("Error getting user information: ", error);
        }
    } else {
        alert("No user is signed in.");
        window.location.href = "login.html"; // 如果用戶未登錄，重定向到登入頁面
    }

    // 監聽認證狀態變化
    auth.onAuthStateChanged(async user => {
        const loginLogoutLink = document.getElementById('login-logout');
        const usernameSpan = document.getElementById('username');

        if (user) {
            // 使用者已登入
            loginLogoutLink.textContent = '登出';
            loginLogoutLink.onclick = () => auth.signOut();
            
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    usernameSpan.textContent = `Hello, ${userData.username}`;
                }
            } catch (error) {
                console.error("Error getting user information: ", error);
            }
        } else {
            // 使用者未登入
            loginLogoutLink.textContent = '登入';
            loginLogoutLink.onclick = () => window.location.href = 'login.html';
            usernameSpan.textContent = '';
        }
    });
});
