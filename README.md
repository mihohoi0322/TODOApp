# TODO アプリ

VSCode + GitHub Copilot ワークショップ用デモアプリケーション

## 技術スタック

- **フロントエンド**: React 19.2+ / TypeScript 5.9+ / Vite 6+
- **バックエンド**: Node.js 24/25 / Express 5.1+ / TypeScript 5.9+
- **データストレージ**: インメモリストレージ (開発用)

## セットアップ

### 前提条件
- Node.js 24 LTS または 25+ がインストールされていること

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd TODOApp
```

2. クライアントの依存関係をインストール
```bash
cd client
npm install
```

3. サーバーの依存関係をインストール
```bash
cd ../server
npm install
```

4. 環境変数を設定（オプショナル）
```bash
cp .env.example .env
```

### 開発サーバーの起動

1. サーバーを起動 (ターミナル1)
```bash
cd server
npm run dev
```

2. クライアントを起動 (ターミナル2)
```bash
cd client
npm run dev
```

3. ブラウザで http://localhost:3000 を開く

## 機能

- ✅ タスクの追加・削除・完了切り替え
- ✅ 期限付きタスク管理
- ✅ Today / InBox / 近日予定 ページ
- ✅ 削除時の確認ダイアログ
- ✅ インメモリストレージによるデータ保存

## プロジェクト構造

詳細は `.github/copilot-instructions.md` を参照してください。

## 開発

- クライアント側のコードは `client/src/` に配置
- サーバー側のコードは `server/src/` に配置
- 型定義は `client/src/types/` と `server/src/models/` に配置

## 注意事項

- このアプリはインメモリストレージを使用しているため、サーバー再起動時にデータがリセットされます
- 本番環境では適切なデータベースを使用することを推奨します
