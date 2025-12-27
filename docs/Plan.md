# MiniSocial 実装計画書

**作成日**: 2025年12月27日
**基準ドキュメント**: RDdoc.md

---

## 目次

1. [Phase 1: MVP（投稿CRUD + いいね）](#phase-1-mvp)
2. [Phase 2: 投稿編集機能](#phase-2-投稿編集機能)
3. [Phase 3: コメント機能](#phase-3-コメント機能)
4. [Phase 4: 認証機能](#phase-4-認証機能)
5. [Phase 5: 発展機能](#phase-5-発展機能)

---

## Phase 1: MVP

### 1.1 環境構築

#### 1.1.1 プロジェクト初期化
- [ ] Next.js 15プロジェクトの作成（App Router、TypeScript、Tailwind CSS）
- [ ] 必要なパッケージのインストール（Supabaseクライアント等）
- [ ] ディレクトリ構造の整備

#### 1.1.2 Supabase設定
- [ ] Supabaseプロジェクトの作成
- [ ] 環境変数の設定（`.env.local`）
- [ ] `.gitignore`に`.env.local`を追加
- [ ] Supabaseクライアントの初期化ファイル作成

#### 1.1.3 データベース構築
- [ ] `posts`テーブルの作成
  ```sql
  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
  CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
  ```
- [ ] `likes`テーブルの作成
  ```sql
  CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
  CREATE INDEX idx_likes_post_id ON likes(post_id);
  ```
- [ ] サンプルデータの投入

---

### 1.2 バックエンド（API Routes）

#### 1.2.1 GET /api/posts - 投稿一覧取得
- [ ] エンドポイントの作成
- [ ] Supabaseからの投稿取得（いいね数含む）
- [ ] 新しい順でソート
- [ ] エラーハンドリング（500エラー）

#### 1.2.2 POST /api/posts - 投稿作成
- [ ] エンドポイントの作成
- [ ] リクエストボディのパース
- [ ] バリデーション実装
  - [ ] `content`未送信/null → 400
  - [ ] 空文字/空白のみ → 400
  - [ ] 280文字超過 → 400
  - [ ] 文字列以外 → 400
- [ ] データベースへの保存
- [ ] 201レスポンスの返却
- [ ] エラーハンドリング

#### 1.2.3 DELETE /api/posts/[id] - 投稿削除
- [ ] 動的ルートの作成
- [ ] パスパラメータの取得
- [ ] バリデーション実装
  - [ ] 数値以外/負の数 → 400
  - [ ] 存在しない投稿 → 404
- [ ] データベースからの削除
- [ ] 200レスポンスの返却
- [ ] エラーハンドリング

#### 1.2.4 POST /api/posts/[id]/like - いいね追加
- [ ] 動的ルートの作成
- [ ] パスパラメータの取得
- [ ] バリデーション実装
  - [ ] 数値以外/負の数 → 400
  - [ ] 存在しない投稿 → 404
- [ ] いいねのデータベース保存
- [ ] 更新後のいいね数取得
- [ ] 201レスポンスの返却
- [ ] エラーハンドリング

---

### 1.3 フロントエンド

#### 1.3.1 型定義
- [ ] `Post`型の定義（id, content, created_at, like_count）
- [ ] APIレスポンス型の定義

#### 1.3.2 ホームページ（`/`）
- [ ] ページコンポーネントの作成
- [ ] レイアウトの設計（ヘッダー、メインコンテンツ）

#### 1.3.3 投稿フォームコンポーネント
- [ ] テキストエリアの実装
  - [ ] プレースホルダー：「今何してる？」
  - [ ] 複数行入力対応
- [ ] 文字数カウント表示（オプション）
- [ ] 投稿ボタンの実装
  - [ ] 無効条件：空文字/280文字超過
- [ ] フロントエンドバリデーション
- [ ] API呼び出し（POST /api/posts）
- [ ] 成功時：一覧更新、フォームクリア
- [ ] エラー時：エラーメッセージ表示

#### 1.3.4 投稿一覧コンポーネント
- [ ] 投稿データの取得（useEffect + fetch）
- [ ] ローディング状態の表示
- [ ] 空状態の表示（「まだ投稿がありません...」）
- [ ] 投稿カードの繰り返し表示

#### 1.3.5 投稿カードコンポーネント
- [ ] 投稿内容の表示（改行保持）
- [ ] 投稿日時の表示（YYYY年MM月DD日 HH:MM形式）
- [ ] いいね数の表示
- [ ] いいねボタンの実装
  - [ ] アイコン切り替え（♡ / ❤️）
  - [ ] 連打防止
  - [ ] API呼び出し（POST /api/posts/[id]/like）
  - [ ] いいね数の即時更新
- [ ] 削除ボタンの実装
  - [ ] 確認ダイアログ（オプション）
  - [ ] API呼び出し（DELETE /api/posts/[id]）
  - [ ] 一覧からの即時削除

#### 1.3.6 スタイリング（Tailwind CSS）
- [ ] レスポンシブデザイン
- [ ] 投稿カードのスタイル
- [ ] ボタンのホバー/アクティブ状態
- [ ] エラーメッセージのスタイル
- [ ] ローディングスピナー

---

### 1.4 テスト・動作確認

- [ ] 投稿作成の動作確認
- [ ] 投稿一覧表示の動作確認
- [ ] いいね機能の動作確認
- [ ] 投稿削除の動作確認
- [ ] バリデーションエラーの動作確認
- [ ] DevToolsでのNetwork確認
- [ ] エラーハンドリングの確認

---

## Phase 2: 投稿編集機能

### 2.1 バックエンド
- [ ] PUT /api/posts/[id] エンドポイントの作成
- [ ] バリデーション（Phase 1と同様）
- [ ] UPDATE SQL文の実装
- [ ] `updated_at`の更新

### 2.2 フロントエンド
- [ ] 編集ボタンの追加
- [ ] 編集モードの実装（インライン or モーダル）
- [ ] 編集フォームの実装
- [ ] キャンセル機能
- [ ] 保存時のAPI呼び出し
- [ ] 一覧の即時更新

### 2.3 学習目標
- PUT/PATCHメソッドの理解
- UPDATE文の習得

---

## Phase 3: コメント機能

### 3.1 データベース
- [ ] `comments`テーブルの作成
  ```sql
  CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
  ```

### 3.2 バックエンド
- [ ] GET /api/posts/[id]/comments - コメント一覧取得
- [ ] POST /api/posts/[id]/comments - コメント作成
- [ ] DELETE /api/comments/[id] - コメント削除

### 3.3 フロントエンド
- [ ] 投稿詳細ページ（`/posts/[id]`）の作成
- [ ] コメント一覧表示
- [ ] コメント投稿フォーム
- [ ] コメント削除機能

### 3.4 学習目標
- テーブルのリレーション
- JOIN文の習得
- 動的ルーティング

---

## Phase 4: 認証機能

### 4.1 データベース
- [ ] `users`テーブルの作成
- [ ] 既存テーブルに`user_id`カラム追加
- [ ] 外部キー制約の設定

### 4.2 バックエンド
- [ ] Supabase Auth または NextAuth.js の導入
- [ ] POST /api/auth/signup - ユーザー登録
- [ ] POST /api/auth/login - ログイン
- [ ] POST /api/auth/logout - ログアウト
- [ ] セッション管理
- [ ] 認可ミドルウェア（自分の投稿のみ削除可能）

### 4.3 フロントエンド
- [ ] ログインページ（`/login`）
- [ ] サインアップページ（`/signup`）
- [ ] 認証状態の管理（Context）
- [ ] ヘッダーにログイン/ログアウトボタン
- [ ] 投稿者名の表示
- [ ] 認可によるUI制御（自分の投稿のみ削除ボタン表示）

### 4.4 セキュリティ
- [ ] レート制限の実装
- [ ] HTTPS通信（Vercelデプロイ）

### 4.5 学習目標
- Cookie/Sessionの理解
- 認証と認可の違い
- ログイン状態の維持

---

## Phase 5: 発展機能

### 5.1 プロフィール機能
- [ ] プロフィールページ（`/profile`）
- [ ] ユーザー情報の表示・編集
- [ ] プロフィール画像のアップロード

### 5.2 画像投稿機能
- [ ] 投稿への画像添付
- [ ] Supabase Storageの利用
- [ ] 画像のリサイズ/最適化

### 5.3 その他の発展機能（検討）
- [ ] いいね取り消し機能
- [ ] フォロー機能
- [ ] 通知機能
- [ ] 検索機能
- [ ] ページネーション
- [ ] 無限スクロール

---

## 実装優先順位

| 優先度 | 項目 | フェーズ |
|--------|------|---------|
| 1 | 環境構築 | Phase 1 |
| 2 | データベース構築 | Phase 1 |
| 3 | API実装（CRUD） | Phase 1 |
| 4 | フロントエンド実装 | Phase 1 |
| 5 | 動作確認・テスト | Phase 1 |
| 6 | 投稿編集機能 | Phase 2 |
| 7 | コメント機能 | Phase 3 |
| 8 | 認証機能 | Phase 4 |
| 9 | 発展機能 | Phase 5 |

---

## 技術的な注意事項

### セキュリティ
- 環境変数は`.env.local`で管理、`.gitignore`に追加必須
- SQLインジェクション対策：パラメータ化クエリを使用
- XSS対策：ReactのデフォルトエスケープをUse
- `dangerouslySetInnerHTML`は使用禁止

### コーディング規約
- TypeScriptで型安全に実装
- コンポーネントは機能ごとに分割
- API Routesはエラーハンドリングを徹底
- 適切なHTTPステータスコードを返却

---

**ドキュメント終了**
