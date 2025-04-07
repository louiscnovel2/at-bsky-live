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
# .env.exampleをコピーして.envファイルを作成
cp .env.example .env

# .envファイルを編集して必要な設定を行う
nano .env
```

`.env`ファイルに以下の設定を行います：
- `PORT`: サーバーのポート番号（デフォルト: 3000）
- `NODE_ENV`: 環境設定（development または production）
- `BLUESKY_SERVICE`: BlueskyのAPIエンドポイント
- `STUN_SERVER`: WebRTC用のSTUNサーバー
- `TURN_SERVER`: WebRTC用のTURNサーバー（必要に応じて）
- `SESSION_SECRET`: セッション管理用の秘密鍵
- `CORS_ORIGIN`: CORSの許可オリジン

4. Nginxの設定:
```bash
# Nginxの設定ディレクトリを作成
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

# 設定ファイルをコピー
sudo cp nginx/at-bsky-live.conf /etc/nginx/sites-available/

# シンボリックリンクを作成
sudo ln -s /etc/nginx/sites-available/at-bsky-live.conf /etc/nginx/sites-enabled/

# 設定のテスト
sudo nginx -t

# Nginxを再起動
sudo systemctl restart nginx
```

5. サービスの起動:
```bash
# スクリプトに実行権限を付与
sudo chmod +x start_atbskylive.sh

# スクリプトを実行
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