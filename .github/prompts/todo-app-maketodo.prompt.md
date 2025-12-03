---
agent: agent
description: TODOアプリの機能を実装するための1回限りの作業。基本セットアップ完了後に実行。
---

# TODOアプリ機能実装

## やりたいこと

.github/copilot-instructions.md の要件定義に基づき、TODOアプリの全機能を実装します。
初期プロジェクト構造が作成済みであることを前提とします。

---

## Phase 1: バックエンドAPI実装

### 1.1 データモデルの作成 (`server/src/models/Todo.ts`)
- Todo型の定義:
  - `id`: string (UUID)
  - `title`: string (必須)
  - `completed`: boolean (デフォルト: false)
  - `dueDate`: string | null (ISO 8601形式)
  - `createdAt`: string (ISO 8601形式)
  - `updatedAt`: string (ISO 8601形式)

### 1.2 インメモリストレージの実装 (`server/src/services/todoService.ts`)
- タスクデータを配列で管理
- CRUD操作メソッド:
  - `getAllTodos(filter?: string)`: フィルター機能付き取得
    - `today`: 今日期限のタスク
    - `inbox`: 期限未設定のタスク
    - `upcoming`: 期限が設定されているタスク
    - `all`: すべてのタスク (デフォルト)
  - `createTodo(title: string, dueDate?: string)`: 新規作成
  - `updateTodo(id: string, updates: Partial<Todo>)`: 更新
  - `deleteTodo(id: string)`: 削除
  - `getTodoById(id: string)`: ID検索
- UUID生成 (`crypto.randomUUID()`)
- 日付フィルタリングロジック (今日判定、期限順ソート)

### 1.3 APIルートの実装 (`server/src/routes/todoRoutes.ts`)
- `GET /api/todos?filter=today|inbox|upcoming|all`
  - クエリパラメータでフィルター
  - レスポンス: `{ todos: Todo[] }`
- `POST /api/todos`
  - リクエストボディ: `{ title: string, dueDate?: string }`
  - バリデーション: title必須チェック
  - レスポンス: 作成されたTodoオブジェクト
- `PUT /api/todos/:id`
  - リクエストボディ: `{ title?: string, completed?: boolean, dueDate?: string | null }`
  - 存在チェック、バリデーション
  - レスポンス: 更新されたTodoオブジェクト
- `DELETE /api/todos/:id`
  - 存在チェック
  - レスポンス: `{ message: "Todo deleted successfully" }`
- エラーハンドリング (404, 400, 500)

### 1.4 サーバーへのルート登録 (`server/src/server.ts`)
- todoRoutesをインポート
- `/api/todos` にマウント
- エラーハンドリングミドルウェア追加

---

## Phase 2: フロントエンド型定義

### 2.1 TypeScript型定義 (`client/src/types/Todo.ts`)
- バックエンドと同じTodo型を定義
- APIレスポンス型: `TodosResponse = { todos: Todo[] }`

### 2.2 ユーティリティ関数 (`client/src/utils/dateUtils.ts`)
- `isToday(dateString: string): boolean` - 今日判定
- `isPastDue(dateString: string): boolean` - 期限切れ判定
- `formatDate(dateString: string): string` - 日付表示用フォーマット

---

## Phase 3: フロントエンド基本機能

### 3.1 APIクライアント (`client/src/utils/api.ts`)
- fetch関数のラッパー
- エンドポイント:
  - `fetchTodos(filter?: string): Promise<Todo[]>`
  - `createTodo(title: string, dueDate?: string): Promise<Todo>`
  - `updateTodo(id: string, updates: Partial<Todo>): Promise<Todo>`
  - `deleteTodo(id: string): Promise<void>`
- エラーハンドリング

### 3.2 タスクフォームコンポーネント (`client/src/components/TodoForm.tsx`)
- タスクタイトル入力フィールド
- 期限日付ピッカー (`<input type="date">`)
- 追加ボタン (またはEnterキー)
- 入力バリデーション (空文字列チェック)
- Props: `onAddTodo: (title: string, dueDate?: string) => void`

### 3.3 タスクアイテムコンポーネント (`client/src/components/TodoItem.tsx`)
- Props: 
  - `todo: Todo`
  - `onToggleComplete: (id: string) => void`
  - `onDelete: (id: string) => void`
  - `onUpdateDueDate: (id: string, dueDate: string | null) => void`
- UI要素:
  - 完了チェックボックス
  - タスクタイトル (完了時は取り消し線)
  - 期限表示 (期限切れは赤色)
  - 期限編集用日付ピッカー
  - 削除ボタン
- 完了状態の視覚的区別 (グレーアウト)

### 3.4 確認ダイアログコンポーネント (`client/src/components/ConfirmDialog.tsx`)
- Props:
  - `isOpen: boolean`
  - `message: string`
  - `onConfirm: () => void`
  - `onCancel: () => void`
- モーダル表示
- 「キャンセル」と「削除」ボタン

### 3.5 タスクリストコンポーネント (`client/src/components/TodoList.tsx`)
- Props: 
  - `todos: Todo[]`
  - `onToggleComplete: (id: string) => void`
  - `onDelete: (id: string) => void`
  - `onUpdateDueDate: (id: string, dueDate: string | null) => void`
- タスクを作成日時の新しい順に表示
- 空状態のメッセージ表示

### 3.6 ナビゲーションコンポーネント (`client/src/components/Navigation.tsx`)
- Props: `currentFilter: string, onFilterChange: (filter: string) => void`
- タブまたはボタンUI:
  - InBox (受信箱)
  - Today (今日)
  - Upcoming (近日予定)
- アクティブなタブのハイライト

---

## Phase 4: メインアプリケーション

### 4.1 App.tsx の実装
- 状態管理 (React Hooks):
  - `todos: Todo[]` - タスクリスト
  - `currentFilter: 'inbox' | 'today' | 'upcoming'` - 現在のフィルター (デフォルト: 'inbox')
  - `loading: boolean` - ローディング状態
  - `error: string | null` - エラーメッセージ
  - `confirmDialog: { isOpen: boolean, todoId: string | null }` - 削除確認ダイアログ状態

- 初回ロード (`useEffect`):
  - マウント時にfetchTodos(currentFilter)を実行
  - ローディング、エラーハンドリング

- イベントハンドラ:
  - `handleAddTodo(title: string, dueDate?: string)`: 新規タスク作成
  - `handleToggleComplete(id: string)`: 完了状態切り替え
  - `handleDeleteClick(id: string)`: 削除確認ダイアログ表示
  - `handleDeleteConfirm()`: 削除実行
  - `handleDeleteCancel()`: 削除キャンセル
  - `handleUpdateDueDate(id: string, dueDate: string | null)`: 期限更新
  - `handleFilterChange(filter: string)`: フィルター変更

- UIレイアウト:
  - ヘッダー: アプリタイトル
  - Navigation コンポーネント
  - TodoForm コンポーネント
  - ローディングインジケーター
  - エラーメッセージ表示
  - TodoList コンポーネント
  - ConfirmDialog コンポーネント

---

## Phase 5: スタイリング

### 5.1 App.css の拡張
- レスポンシブデザイン:
  - モバイル: 縦スクロール、フルワイド
  - デスクトップ: 中央寄せ、最大幅設定
- カラースキーム:
  - プライマリ色、セカンダリ色
  - 完了タスク: グレーアウト、取り消し線
  - 期限切れタスク: 赤色アクセント
  - 今日期限タスク: オレンジ色アクセント
- インタラクション:
  - ホバー効果
  - フォーカス状態
  - ボタンのアクティブ状態
- モーダルダイアログ:
  - オーバーレイ背景
  - 中央配置
  - アニメーション

### 5.2 各コンポーネントのスタイル
- 必要に応じてCSS Modulesまたは追加CSSファイル作成
- アクセシビリティ考慮 (十分なコントラスト、フォーカスインジケーター)

---

## Phase 6: 動作確認とエラー修正

### 6.1 開発サーバー起動
- サーバー: `cd server && npm run dev` (ポート5000)
- クライアント: `cd client && npm run dev` (ポート3000)

### 6.2 機能テスト (.github/copilot-instructions.md の9.1参照)
- [ ] タスクを追加できる (期限あり/なし)
- [ ] タスクを完了/未完了に切り替えられる
- [ ] InBox ページに期限未設定のタスクのみ表示
- [ ] Today ページに今日期限のタスクのみ表示
- [ ] Upcoming ページに期限付きタスクが期限順に表示
- [ ] 期限切れタスクが赤色で表示
- [ ] タスクの期限を編集できる
- [ ] 期限をクリアするとInBoxに移動
- [ ] 削除ボタンで確認ダイアログが表示
- [ ] キャンセルで削除されない
- [ ] 削除で正常に削除される

### 6.3 エラーが発生した場合
- TypeScriptエラー: 型定義を修正
- APIエラー: エンドポイント、リクエスト/レスポンス形式を確認
- UI不具合: コンポーネントのstate、propsを確認
- スタイル問題: CSSセレクター、レスポンシブブレークポイントを確認
- **エラーが解決するまで繰り返し修正**

### 6.4 TypeScriptビルド確認
- `cd client && npm run build`
- `cd server && npm run build`
- ビルドエラーがないことを確認

---

## 注意事項

- **このプロンプトは機能実装時に1回だけ使用**
- すべての要件は `.github/copilot-instructions.md` に基づく
- Phase順に実装することを推奨 (バックエンド → 型定義 → フロントエンド)
- エラーが発生したら必ず解決してから次のPhaseへ
- 各コンポーネントは再利用可能で、テスト可能な設計にする
- コードの可読性と保守性を重視

