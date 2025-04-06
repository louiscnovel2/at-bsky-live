#!/bin/bash

# 必要なパッケージのインストール
sudo apt-get update
sudo apt-get install -y nodejs npm nginx

# Node.jsのバージョン確認
node -v
npm -v

# プロジェクトの依存関係をインストール
npm install

# Nginxの設定
sudo tee /etc/nginx/sites-available/at-bsky-live.conf << EOF
server {
    listen 80;
    server_name at-bsky-live.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Nginxの設定を有効化
sudo ln -s /etc/nginx/sites-available/at-bsky-live.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# PM2のインストールと設定
sudo npm install -g pm2
pm2 start server.js --name "at-bsky-live"
pm2 save
pm2 startup

echo "ATBskyLiveのセットアップが完了しました！"
echo "サービスは自動的に起動し、システム起動時にも自動的に開始されます。" 