// AT Protocolクライアントの初期化
const agent = new BskyAgent({
    service: 'https://bsky.social'
});

// DOM要素の取得
const loginBtn = document.getElementById('loginBtn');
const cameraModeBtn = document.getElementById('cameraMode');
const radioModeBtn = document.getElementById('radioMode');
const streamTitle = document.getElementById('streamTitle');
const startStreamBtn = document.getElementById('startStream');
const localVideo = document.getElementById('localVideo');
const radioImage = document.getElementById('radioImage');
const imageUpload = document.getElementById('imageUpload');
const chatInput = document.getElementById('chatInput');
const sendCommentBtn = document.getElementById('sendComment');
const chatMessages = document.getElementById('chatMessages');

// ソケット接続
const socket = io();

// 状態管理
let currentMode = 'camera';
let isLoggedIn = false;
let isStreaming = false;
let currentStream = null;
let rootPostUri = null;

// ログイン処理
loginBtn.addEventListener('click', async () => {
    try {
        await agent.login({
            identifier: prompt('Blueskyのユーザー名を入力してください'),
            password: prompt('パスワードを入力してください')
        });
        
        isLoggedIn = true;
        loginBtn.textContent = 'ログアウト';
        startStreamBtn.disabled = false;
        chatInput.disabled = false;
        sendCommentBtn.disabled = false;
    } catch (error) {
        console.error('Login failed:', error);
        alert('ログインに失敗しました');
    }
});

// モード切り替え
cameraModeBtn.addEventListener('click', () => {
    currentMode = 'camera';
    cameraModeBtn.classList.add('active');
    radioModeBtn.classList.remove('active');
    localVideo.classList.remove('hidden');
    radioImage.classList.add('hidden');
    setupCamera();
});

radioModeBtn.addEventListener('click', () => {
    currentMode = 'radio';
    radioModeBtn.classList.add('active');
    cameraModeBtn.classList.remove('active');
    localVideo.classList.add('hidden');
    radioImage.classList.remove('hidden');
    stopCamera();
});

// カメラの設定
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = stream;
        currentStream = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('カメラへのアクセスに失敗しました');
    }
}

function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
}

// 配信開始
startStreamBtn.addEventListener('click', async () => {
    if (!streamTitle.value) {
        alert('配信タイトルを入力してください');
        return;
    }

    try {
        const username = agent.session?.handle;
        socket.emit('startStream', {
            title: streamTitle.value,
            username: username,
            mode: currentMode
        });

        isStreaming = true;
        startStreamBtn.textContent = '配信終了';
        streamTitle.disabled = true;
    } catch (error) {
        console.error('Error starting stream:', error);
        alert('配信の開始に失敗しました');
    }
});

// コメント送信
sendCommentBtn.addEventListener('click', () => {
    if (!chatInput.value || !rootPostUri) return;

    socket.emit('comment', {
        comment: chatInput.value,
        rootPostUri: rootPostUri,
        parentPostUri: rootPostUri
    });

    chatInput.value = '';
});

// ソケットイベントの処理
socket.on('streamStarted', (data) => {
    rootPostUri = data.postUri;
    alert('配信を開始しました！');
});

socket.on('newComment', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.comment}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('error', (data) => {
    alert(data.message);
});

// 画像アップロード
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            radioImage.querySelector('img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}); 