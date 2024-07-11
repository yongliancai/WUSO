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
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const username = userData.username;
                console.log("username：" + username); // 打印用戶名到控制台
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document: ", error);
        }

        let currentStep = 0;
        let paperTitle = "";

        const sections = document.querySelectorAll('.section');
        const progressBar = document.getElementById('progress-bar');
        const updateProgressBar = (step) => {
            const percentage = (step / sections.length) * 100;
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${Math.round(percentage)}%`;
        };

        const showSection = (step) => {
            sections.forEach((section, index) => {
                section.classList.toggle('active', index === step);
            });
        };

        const uploadData = async (data, step) => {
            try {
                const userDocRef = db.collection('users').doc(userId);
                await userDocRef.collection(paperTitle).doc(data.type).set(data);

                // 保存論文集合名稱
                await userDocRef.set({
                    papers: firebase.firestore.FieldValue.arrayUnion(paperTitle)
                }, { merge: true });

                currentStep++;
                updateProgressBar(currentStep);
                if (currentStep < sections.length) {
                    showSection(currentStep);
                } else {
                    alert("All data uploaded successfully!");
                    window.location.href = "public.html";
                }
            } catch (error) {
                console.error("Error uploading data: ", error);
                alert("Error uploading data: " + error.message);
            }
        };

        document.getElementById('upload-title-button').addEventListener('click', () => {
            paperTitle = document.getElementById('paper-title').value.trim();
            if (paperTitle === "") {
                alert("Please enter a paper title.");
                return;
            }
            uploadData({ type: 'title', content: paperTitle, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, currentStep);
        });

        document.getElementById('upload-abstract-button').addEventListener('click', () => {
            const abstract = document.getElementById('abstract').value.trim();
            if (abstract === "") {
                alert("Please enter an abstract.");
                return;
            }
            uploadData({ type: 'abstract', content: abstract, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, currentStep);
        });

        document.getElementById('back-abstract-button').addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateProgressBar(currentStep);
                showSection(currentStep);
            }
        });

        document.getElementById('upload-tts-link-button').addEventListener('click', () => {
            const ttsLink = document.getElementById('tts-link').value.trim();
            if (ttsLink === "") {
                alert("Please enter a Text to Speech link.");
                return;
            }
            uploadData({ type: 'tts-link', link: ttsLink, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, currentStep);
        });

        document.getElementById('back-tts-link-button').addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateProgressBar(currentStep);
                showSection(currentStep);
            }
        });

        document.getElementById('upload-ai-video-link-button').addEventListener('click', () => {
            const aiVideoLink = document.getElementById('ai-video-link').value.trim();
            if (aiVideoLink === "") {
                alert("Please enter an AI Video link.");
                return;
            }
            uploadData({ type: 'ai-video-link', link: aiVideoLink, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, currentStep);
        });

        document.getElementById('back-ai-video-link-button').addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateProgressBar(currentStep);
                showSection(currentStep);
            }
        });

        document.getElementById('upload-ppt-link-button').addEventListener('click', () => {
            const pptLink = document.getElementById('ppt-link').value.trim();
            if (pptLink === "") {
                alert("Please enter a PPT link.");
                return;
            }
            uploadData({ type: 'ppt-link', link: pptLink, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, currentStep);
        });

        document.getElementById('back-ppt-link-button').addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateProgressBar(currentStep);
                showSection(currentStep);
            }
        });

        updateProgressBar(currentStep);
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
