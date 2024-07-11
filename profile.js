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
