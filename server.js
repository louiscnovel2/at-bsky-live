require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { BskyAgent } = require('@atproto/api');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ミドルウェアの設定
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// AT Protocolクライアントの初期化
const agent = new BskyAgent({
  service: 'https://bsky.social'
});

// ソケット接続の処理
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('startStream', async (data) => {
    try {
      // Blueskyへの投稿
      const post = await agent.post({
        text: `${data.title}\n\n配信URL: https://at-bsky-live.com/stream/${data.username}`
      });
      
      socket.emit('streamStarted', { postUri: post.uri });
    } catch (error) {
      console.error('Error posting to Bluesky:', error);
      socket.emit('error', { message: 'Blueskyへの投稿に失敗しました' });
    }
  });

  socket.on('comment', async (data) => {
    try {
      // コメントをBlueskyに投稿
      await agent.post({
        text: data.comment,
        reply: {
          root: { uri: data.rootPostUri },
          parent: { uri: data.parentPostUri }
        }
      });
      
      io.emit('newComment', data);
    } catch (error) {
      console.error('Error posting comment:', error);
      socket.emit('error', { message: 'コメントの投稿に失敗しました' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// WebRTCシグナリング用のエンドポイント
app.post('/api/signaling', (req, res) => {
  const { to, from, signal } = req.body;
  io.to(to).emit('signal', { from, signal });
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 