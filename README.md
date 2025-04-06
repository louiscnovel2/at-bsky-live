# ATBskyLive

Blueskyアカウントを使用したライブ配信サービス

## 機能

- Blueskyアカウントでの認証
- カメラモードとラジオモードのライブ配信
- リアルタイムコメント機能
- 配信開始時の自動Bluesky投稿
- 低遅延WebRTC配信

## 必要条件

- Node.js 18以上
- Nginx
- Ubuntu 20.04以上
- Webカメラ（カメラモードの場合）

## セットアップ手順

1. リポジトリのクローン:
```bash
git clone https://github.com/yourusername/at-bsky-live.git
cd at-bsky-live
```

2. 依存関係のインストール:
```bash
npm install
```

3. 環境変数の設定:
```bash
cp .env.example .env
```
`.env`ファイルを編集し、必要な設定を行います。

4. Nginxの設定:
```bash
sudo cp nginx/at-bsky-live.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/at-bsky-live.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. サービスの起動:
```bash
sudo ./start_atbskylive.sh
```

## 開発者向け情報

### 開発サーバーの起動
```bash
npm run dev
```

### プロジェクト構造
- `public/`: フロントエンドの静的ファイル
- `server.js`: メインサーバーファイル
- `routes/`: APIルート
- `controllers/`: ビジネスロジック
- `utils/`: ユーティリティ関数

## ライセンス

MIT 