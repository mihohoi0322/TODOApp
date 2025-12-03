---
agent: agent
description: TODOアプリの初期プロジェクト構造を作成するための1回限りの作業。
---

# TODOアプリ初期セットアップ

## やりたいこと

.github/copilot-instructions.md に記載された要件に基づき、TODOアプリの初期プロジェクト構造を作成します。

### 1. プロジェクト構造を作成
- `client/` ディレクトリ (フロントエンド用)
  - `src/components/` - Reactコンポーネント
  - `src/types/` - TypeScript型定義
  - `src/utils/` - ユーティリティ関数
  - `src/App.tsx` - メインコンポーネント
  - `src/App.css` - スタイル
  - `src/main.tsx` - エントリーポイント
  - `public/` - 静的ファイル
  - 各種設定ファイル (package.json, tsconfig.json, vite.config.ts)

- `server/` ディレクトリ (バックエンド用)
  - `src/routes/` - APIルート
  - `src/models/` - データモデル
  - `src/services/` - ビジネスロジック
  - `src/config/` - 設定ファイル
  - `src/server.ts` - サーバーエントリーポイント
  - 各種設定ファイル (package.json, tsconfig.json)

### 2. フロントエンド (client) のセットアップ
- React 19.2+ を使用
- TypeScript 5.9+ で型安全性を確保
- Vite 6+ をビルドツールとして使用
- 必要な依存関係をインストール (react, react-dom, @vitejs/plugin-react)
- 開発用依存関係も設定 (@types/react, typescript, vite, eslint)

### 3. バックエンド (server) のセットアップ
- Node.js 24/25 を使用
- Express 5.1+ でAPIサーバーを構築
- TypeScript 5.9+ で型安全性を確保
- CORS設定を含む
- 開発時の自動リロード (tsx watch) を設定

### 4. TypeScript設定
- クライアント側: React JSX対応、モダンなESモジュール設定
- サーバー側: Node.js環境、CommonJS互換性
- strict モード有効化で型安全性を最大化

### 5. Vite設定
- 開発サーバーをポート3000で起動
- `/api` へのリクエストをバックエンド (localhost:5000) にプロキシ
- React プラグインを有効化

### 6. 環境変数管理
- `.env.example` を作成 (テンプレート)
  - サーバー設定 (PORT, NODE_ENV)
- `.gitignore` で `.env` ファイルをコミット対象外に

### 7. プロジェクト全体の設定
- ルートの `.gitignore` を作成
  - node_modules, ビルド成果物, 環境変数ファイルを除外
- `README.md` を作成
  - プロジェクト概要、技術スタック、セットアップ手順を記載

### 8. 初回セットアップ手順
- 両方のディレクトリで `npm install` を実行
- 開発サーバーを起動 (client: `npm run dev`, server: `npm run dev`)

## 注意事項
- このプロンプトは初期セットアップ時に1回だけ使用
- 以降の開発は `.github/copilot-instructions.md` の要件定義に従う

