# 簡易SNSアプリ（MiniSocial）要件定義書 Phase 1: MVP

**作成日**: 2025年12月27日  
**バージョン**: 1.0  
**ステータス**: Phase 1（MVP）

---

## 目次

1. [アプリ概要](#1-アプリ概要)
2. [アーキテクチャ（使う技術）](#2-アーキテクチャ使う技術)
3. [ユーザージャーニー](#3-ユーザージャーニー)
4. [ページ構成](#4-ページ構成)
5. [機能要件](#5-機能要件)
6. [API要件](#6-api要件)
7. [データベース設計](#7-データベース設計)
8. [バリデーションエラー定義](#8-バリデーションエラー定義)
9. [セキュリティ定義](#9-セキュリティ定義)
10. [学習目標](#10-学習目標)

---

## 1. アプリ概要

### 1.1 アプリ名
**MiniSocial**（仮称）

### 1.2 概要
シンプルなSNSアプリケーション。ユーザーは短い投稿（ポスト）を作成し、他のユーザーの投稿を閲覧できる。投稿に「いいね」をつけることで共感を表現できる。

### 1.3 開発目的
Web開発の基礎技術（フロントエンド・バックエンド・データベース）を実践的に学習するための教材アプリケーション。

### 1.4 対象ユーザー
- 主な利用者：開発者本人（学習者）
- Phase 1では認証機能なし（全ユーザーが同じデータを共有）
- Phase 4以降で複数ユーザー対応予定

### 1.5 主な機能（Phase 1）
- 投稿の作成
- 投稿の一覧表示
- 投稿の削除
- いいね機能

### 1.6 開発フェーズ

| フェーズ | 主な機能 | ステータス |
|---------|---------|-----------|
| Phase 1 | 投稿CRUD + いいね | 🔵 本ドキュメント対象 |
| Phase 2 | 投稿編集機能追加 | 予定 |
| Phase 3 | コメント機能追加 | 予定 |
| Phase 4 | 認証機能追加 | 予定 |

---

## 2. アーキテクチャ（使う技術）

### 2.1 技術スタック

#### フロントエンド
- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS** (UIスタイリング)
- **TypeScript** (型安全性)

#### バックエンド
- **Next.js API Routes** (RESTful API)

#### データベース
- **Supabase** (PostgreSQL)
- **生SQL** (直接SQL文を記述)

#### 開発環境
- **Node.js** 20以上
- **npm** または **pnpm**
- **VS Code** (推奨エディタ)
- **Git** / **GitHub** (バージョン管理)

### 2.2 デプロイ環境（Phase 1では未実施）
- **Vercel** (フロントエンド・バックエンド)
- **Supabase** (データベース)

### 2.3 アーキテクチャ図

```
┌─────────────────────────────────────┐
│         ブラウザ (Client)            │
│  Next.js (React + Tailwind CSS)     │
└──────────────┬──────────────────────┘
               │ HTTP Request/Response
               │
┌──────────────▼──────────────────────┐
│       Next.js API Routes             │
│         (Backend)                    │
└──────────────┬──────────────────────┘
               │ SQL Query
               │
┌──────────────▼──────────────────────┐
│       Supabase (PostgreSQL)          │
│         (Database)                   │
└──────────────────────────────────────┘
```

---

## 3. ユーザージャーニー

### 3.1 ユーザーストーリー1：投稿を作成して共有する

1. ユーザーがブラウザで `http://localhost:3000` にアクセス
2. ホーム画面が表示される（投稿一覧 + 投稿フォーム）
3. 既存の投稿が新しい順に一覧表示される
4. ユーザーがテキストエリアに投稿内容を入力（最大280文字）
5. 「投稿する」ボタンをクリック
6. 投稿が一覧の最上部に追加される
7. 投稿内容、投稿日時、いいね数、アクションボタンが表示される

### 3.2 ユーザーストーリー2：投稿にいいねをする

1. ユーザーが気に入った投稿の「いいね」ボタンをクリック
2. いいね数が即座に +1 される
3. ボタンの見た目が変化（視覚的フィードバック）
4. いいねが記録される

### 3.3 ユーザーストーリー3：投稿を削除する

1. ユーザーが投稿の「削除」ボタンをクリック
2. 確認ダイアログが表示される（オプション）
3. 「OK」を押すと投稿が一覧から即座に削除される
4. データベースからも削除される

---

## 4. ページ構成

### 4.1 Phase 1のページ一覧

| ページ名 | パス | 説明 | 実装優先度 |
|---------|------|------|-----------|
| ホーム | `/` | 投稿一覧表示 + 新規投稿フォーム | 必須 |

### 4.2 Phase 2以降のページ（参考）

| ページ名 | パス | 説明 | 実装時期 |
|---------|------|------|---------|
| 投稿詳細 | `/posts/[id]` | 個別投稿 + コメント一覧 | Phase 3 |
| ログイン | `/login` | ログインフォーム | Phase 4 |
| サインアップ | `/signup` | 新規登録フォーム | Phase 4 |

---

## 5. 機能要件

### 5.1 ホームページ（`/`）

#### 5.1.1 表示要素

**A. 投稿フォーム**

| 要素 | 仕様 |
|------|------|
| テキストエリア | - 複数行入力可能<br>- プレースホルダー：「今何してる？」<br>- 最大文字数：280文字<br>- リアルタイム文字数カウント表示（オプション） |
| 投稿ボタン | - ラベル：「投稿する」<br>- 無効条件：テキストが空または280文字超過<br>- スタイル：プライマリカラー |

**B. 投稿一覧**

投稿カード（繰り返し表示）：

| 要素 | 仕様 |
|------|------|
| 投稿内容 | - テキスト形式で表示<br>- 改行を保持 |
| 投稿日時 | - フォーマット：「YYYY年MM月DD日 HH:MM」<br>- 例：「2025年12月27日 14:30」 |
| いいね数 | - フォーマット：「N いいね」<br>- 0の場合も「0 いいね」と表示 |
| いいねボタン | - アイコン：❤️（いいね済み）/ ♡（未いいね）<br>- クリックでいいね追加<br>- Phase 1では取り消し機能なし |
| 削除ボタン | - アイコン：🗑️ または「削除」テキスト<br>- クリックで投稿削除 |

**C. 空状態**
- 投稿が0件の場合：「まだ投稿がありません。最初の投稿をしてみましょう！」を中央に表示

**D. ローディング状態**
- データ取得中：スピナーまたは「読み込み中...」を表示

#### 5.1.2 操作フロー

**A. 投稿作成フロー**

```
1. ユーザーがテキストエリアに内容を入力
   ↓
2. 「投稿する」ボタンをクリック
   ↓
3. フロントエンドでバリデーション
   ├─ エラーあり → エラーメッセージ表示、処理中断
   └─ エラーなし → 次へ
   ↓
4. API `POST /api/posts` を呼び出し
   ↓
5. レスポンス処理
   ├─ 成功 (201)
   │   ├─ 投稿一覧の最上部に新しい投稿を追加
   │   ├─ テキストエリアをクリア
   │   └─ 成功メッセージ表示（オプション）
   └─ 失敗 (4xx/5xx)
       └─ エラーメッセージ表示
```

**B. いいね追加フロー**

```
1. ユーザーが「いいね」ボタンをクリック
   ↓
2. ボタンを無効化（連打防止）
   ↓
3. API `POST /api/posts/[id]/like` を呼び出し
   ↓
4. レスポンス処理
   ├─ 成功 (201)
   │   ├─ いいね数を +1
   │   ├─ ボタンの見た目を変更（ハート塗りつぶし）
   │   └─ ボタンを再度有効化
   └─ 失敗 (4xx/5xx)
       ├─ エラーメッセージ表示
       └─ ボタンを再度有効化
```

**C. 投稿削除フロー**

```
1. ユーザーが「削除」ボタンをクリック
   ↓
2. 確認ダイアログ表示：「この投稿を削除しますか？」（オプション）
   ├─ キャンセル → 処理中断
   └─ OK → 次へ
   ↓
3. API `DELETE /api/posts/[id]` を呼び出し
   ↓
4. レスポンス処理
   ├─ 成功 (200)
   │   └─ 投稿を一覧から削除（アニメーション付きが望ましい）
   └─ 失敗 (4xx/5xx)
       └─ エラーメッセージ表示
```

**D. 初回読み込みフロー**

```
1. ページがマウントされる（useEffect発火）
   ↓
2. ローディング状態を表示
   ↓
3. API `GET /api/posts` を呼び出し
   ↓
4. レスポンス処理
   ├─ 成功 (200)
   │   ├─ 投稿一覧をStateに保存
   │   ├─ 投稿一覧を表示
   │   └─ ローディング状態を解除
   └─ 失敗 (5xx)
       ├─ エラーメッセージ表示
       └─ ローディング状態を解除
```

---

## 6. API要件

### 6.1 共通仕様

#### リクエストヘッダー
```
Content-Type: application/json
```

#### レスポンス形式
- 全てのレスポンスはJSON形式
- 成功時と失敗時で一貫した構造

#### エラーレスポンス共通構造
```json
{
  "error": "エラーメッセージ"
}
```

---

### 6.2 GET /api/posts

#### 概要
投稿一覧を取得する（新しい順、いいね数含む）

#### リクエスト

**メソッド**: GET

**パラメータ**: なし

**例**:
```
GET http://localhost:3000/api/posts
```

#### レスポンス

**成功時 (200 OK)**
```json
{
  "posts": [
    {
      "id": 1,
      "content": "Hello World!",
      "created_at": "2025-12-27T05:30:00.000Z",
      "like_count": 3
    },
    {
      "id": 2,
      "content": "今日はいい天気ですね！",
      "created_at": "2025-12-27T06:00:00.000Z",
      "like_count": 0
    }
  ]
}
```

**失敗時 (500 Internal Server Error)**
```json
{
  "error": "投稿の取得に失敗しました"
}
```

#### SQL
```sql
SELECT 
  p.id,
  p.content,
  p.created_at,
  COUNT(l.id) as like_count
FROM posts p
LEFT JOIN likes l ON p.id = l.post_id
GROUP BY p.id, p.content, p.created_at
ORDER BY p.created_at DESC;
```

---

### 6.3 POST /api/posts

#### 概要
新しい投稿を作成する

#### リクエスト

**メソッド**: POST

**ヘッダー**:
```
Content-Type: application/json
```

**ボディ**:
```json
{
  "content": "投稿内容"
}
```

**例**:
```
POST http://localhost:3000/api/posts
Content-Type: application/json

{
  "content": "今日のランチは美味しかった！"
}
```

#### レスポンス

**成功時 (201 Created)**
```json
{
  "post": {
    "id": 3,
    "content": "今日のランチは美味しかった！",
    "created_at": "2025-12-27T07:00:00.000Z"
  }
}
```

**失敗時 (400 Bad Request) - バリデーションエラー**
```json
{
  "error": "投稿内容を入力してください"
}
```

**失敗時 (500 Internal Server Error)**
```json
{
  "error": "投稿の作成に失敗しました"
}
```

#### バリデーション
- `content`が未送信 → 400エラー
- `content`が空文字 → 400エラー
- `content`が280文字超過 → 400エラー
- `content`が文字列以外 → 400エラー

#### SQL
```sql
INSERT INTO posts (content) 
VALUES ($1) 
RETURNING id, content, created_at;
```

---

### 6.4 DELETE /api/posts/[id]

#### 概要
指定したIDの投稿を削除する

#### リクエスト

**メソッド**: DELETE

**パス**: `/api/posts/{id}`

**例**:
```
DELETE http://localhost:3000/api/posts/123
```

#### レスポンス

**成功時 (200 OK)**
```json
{
  "message": "投稿を削除しました"
}
```

**失敗時 (404 Not Found) - 投稿が存在しない**
```json
{
  "error": "投稿が見つかりません"
}
```

**失敗時 (400 Bad Request) - 無効なID**
```json
{
  "error": "無効な投稿IDです"
}
```

**失敗時 (500 Internal Server Error)**
```json
{
  "error": "投稿の削除に失敗しました"
}
```

#### バリデーション
- `id`が数値以外 → 400エラー
- 該当する投稿が存在しない → 404エラー

#### SQL
```sql
DELETE FROM posts 
WHERE id = $1
RETURNING id;
```

**注**: 外部キー制約（ON DELETE CASCADE）により、関連するlikesレコードも自動削除される

---

### 6.5 POST /api/posts/[id]/like

#### 概要
指定した投稿にいいねを追加する

#### リクエスト

**メソッド**: POST

**パス**: `/api/posts/{id}/like`

**例**:
```
POST http://localhost:3000/api/posts/123/like
```

#### レスポンス

**成功時 (201 Created)**
```json
{
  "message": "いいねしました",
  "like_count": 4
}
```

**失敗時 (404 Not Found) - 投稿が存在しない**
```json
{
  "error": "投稿が見つかりません"
}
```

**失敗時 (400 Bad Request) - 無効なID**
```json
{
  "error": "無効な投稿IDです"
}
```

**失敗時 (500 Internal Server Error)**
```json
{
  "error": "いいねの追加に失敗しました"
}
```

#### バリデーション
- `id`が数値以外 → 400エラー
- 該当する投稿が存在しない → 404エラー

#### SQL
```sql
-- 1. いいね追加
INSERT INTO likes (post_id) 
VALUES ($1)
RETURNING id;

-- 2. 更新後のいいね数取得
SELECT COUNT(*) as like_count
FROM likes
WHERE post_id = $1;
```

**注**: Phase 1では同じユーザーが複数回いいねできる（重複チェックなし）

---

## 7. データベース設計

### 7.1 テーブル一覧

| テーブル名 | 説明 | レコード例 |
|-----------|------|-----------|
| posts | 投稿データ | ~100件（想定） |
| likes | いいねデータ | ~500件（想定） |

---

### 7.2 postsテーブル

#### テーブル定義

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | SERIAL | PRIMARY KEY | 自動採番 | 投稿ID |
| content | TEXT | NOT NULL | - | 投稿内容（最大280文字） |
| created_at | TIMESTAMP | NOT NULL | NOW() | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | NOW() | 更新日時 |

#### インデックス
- **PRIMARY KEY**: `id`
- **INDEX**: `created_at DESC`（一覧取得の高速化）

#### SQL（テーブル作成）
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### サンプルデータ
```sql
INSERT INTO posts (content) VALUES
('Hello World! これが最初の投稿です。'),
('今日は良い天気ですね！'),
('Web開発の勉強を頑張っています💪');
```

---

### 7.3 likesテーブル

#### テーブル定義

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | SERIAL | PRIMARY KEY | 自動採番 | いいねID |
| post_id | INTEGER | NOT NULL, FOREIGN KEY | - | 投稿ID（postsテーブル参照） |
| created_at | TIMESTAMP | NOT NULL | NOW() | いいねした日時 |

#### 外部キー制約
- **post_id** → **posts.id**
  - ON DELETE CASCADE（投稿削除時、関連いいねも自動削除）
  - ON UPDATE CASCADE

#### インデックス
- **PRIMARY KEY**: `id`
- **INDEX**: `post_id`（JOIN高速化）

#### SQL（テーブル作成）
```sql
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_likes_post_id ON likes(post_id);
```

#### サンプルデータ
```sql
-- post_id=1に3つのいいね
INSERT INTO likes (post_id) VALUES (1), (1), (1);

-- post_id=2に1つのいいね
INSERT INTO likes (post_id) VALUES (2);
```

---

### 7.4 ER図

```
┌──────────────────────┐
│       posts          │
├──────────────────────┤
│ id (PK)       SERIAL │←────┐
│ content       TEXT   │     │
│ created_at TIMESTAMP │     │ 1
│ updated_at TIMESTAMP │     │
└──────────────────────┘     │
                             │
                             │ 1:N (一対多)
                             │
┌──────────────────────┐     │
│       likes          │     │
├──────────────────────┤     │
│ id (PK)       SERIAL │     │
│ post_id (FK) INTEGER │─────┘ N
│ created_at TIMESTAMP │
└──────────────────────┘
```

#### 関係性の説明
- **1つの投稿（posts）**: 複数のいいね（likes）を持つ（1対多）
- **1つのいいね（likes）**: 1つの投稿（posts）に属する（多対1）

---

### 7.5 Phase 2以降のテーブル（参考）

#### usersテーブル（Phase 4で追加）
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### commentsテーブル（Phase 3で追加）
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 8. バリデーションエラー定義

### 8.1 フロントエンド側のバリデーション

#### 投稿作成時（POST /api/posts）

| 検証項目 | 条件 | エラーメッセージ | 表示方法 |
|---------|------|----------------|---------|
| content | 空文字（未入力） | 「投稿内容を入力してください」 | テキストエリア下に赤文字 |
| content | 280文字超過 | 「投稿は280文字以内で入力してください（現在: N文字）」 | テキストエリア下に赤文字 |
| content | 空白のみ | 「投稿内容を入力してください」 | テキストエリア下に赤文字 |

#### 実装例（React）
```typescript
const [content, setContent] = useState('');
const [error, setError] = useState('');

const handleSubmit = () => {
  setError('');
  
  if (!content.trim()) {
    setError('投稿内容を入力してください');
    return;
  }
  
  if (content.length > 280) {
    setError(`投稿は280文字以内で入力してください（現在: ${content.length}文字）`);
    return;
  }
  
  // API呼び出し
};
```

---

### 8.2 バックエンド側のバリデーション

#### POST /api/posts

| 検証項目 | 条件 | ステータスコード | エラーメッセージ |
|---------|------|-----------------|-----------------|
| content | 未送信（フィールドなし） | 400 | 「投稿内容が必要です」 |
| content | null | 400 | 「投稿内容が必要です」 |
| content | 空文字 | 400 | 「投稿内容を入力してください」 |
| content | 空白のみ | 400 | 「投稿内容を入力してください」 |
| content | 280文字超過 | 400 | 「投稿は280文字以内で入力してください」 |
| content | 文字列以外（数値、配列等） | 400 | 「投稿内容は文字列である必要があります」 |

#### DELETE /api/posts/[id]

| 検証項目 | 条件 | ステータスコード | エラーメッセージ |
|---------|------|-----------------|-----------------|
| id | 数値以外（文字列等） | 400 | 「無効な投稿IDです」 |
| id | 負の数 | 400 | 「無効な投稿IDです」 |
| id | 該当レコードなし | 404 | 「投稿が見つかりません」 |

#### POST /api/posts/[id]/like

| 検証項目 | 条件 | ステータスコード | エラーメッセージ |
|---------|------|-----------------|-----------------|
| post_id | 数値以外 | 400 | 「無効な投稿IDです」 |
| post_id | 負の数 | 400 | 「無効な投稿IDです」 |
| post_id | 該当投稿なし | 404 | 「投稿が見つかりません」 |

---

### 8.3 データベース制約エラー

| 制約 | エラー発生条件 | 処理方法 |
|------|--------------|---------|
| NOT NULL制約 | contentがNULL | 500エラー、ログ記録 |
| 外部キー制約 | 存在しないpost_idへのいいね | 404エラー「投稿が見つかりません」 |

---

## 9. セキュリティ定義

### 9.1 Phase 1のセキュリティ対策

#### 9.1.1 環境変数の管理

**保存場所**: `.env.local`

**必要な環境変数**:
```bash
# Supabase接続情報
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# サーバーサイド専用（フロントエンドでは使用禁止）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要事項**:
- ✅ `.env.local`を`.gitignore`に追加（必須）
- ✅ `NEXT_PUBLIC_*`はフロントエンドで使用可能（公開鍵）
- ❌ `SUPABASE_SERVICE_ROLE_KEY`は**絶対にフロントエンドで使用しない**
- ❌ 環境変数をGitHubにpushしない
- ❌ スクリーンショットやログに環境変数を含めない

**検証方法**:
```bash
# .gitignoreに含まれているか確認
cat .gitignore | grep .env.local
```

---

#### 9.1.2 SQLインジェクション対策

**原則**: **パラメータ化クエリ（プリペアドステートメント）を必ず使用**

**❌ 危険な実装例**:
```javascript
// 直接文字列連結 → SQLインジェクションの脆弱性
const query = `SELECT * FROM posts WHERE id = ${id}`;
const query = `INSERT INTO posts (content) VALUES ('${content}')`;
```

**✅ 安全な実装例**:
```javascript
// パラメータ化クエリ
const query = 'SELECT * FROM posts WHERE id = $1';
const values = [id];

const query = 'INSERT INTO posts (content) VALUES ($1)';
const values = [content];
```

**Supabaseクライアント使用時**:
```javascript
// Supabase側で自動的にエスケープされる
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('id', id);
```

---

#### 9.1.3 XSS（クロスサイトスクリプティング）対策

**対策**:
- ✅ **Reactのデフォルトエスケープを活用**
  - `{post.content}`は自動的にエスケープされる
- ❌ `dangerouslySetInnerHTML`は使用しない
- ❌ `eval()`や`Function()`は使用しない

**安全な実装例**:
```jsx
// ✅ 安全（自動エスケープ）
<p>{post.content}</p>

// ❌ 危険（エスケープされない）
<p dangerouslySetInnerHTML={{ __html: post.content }} />
```

---

#### 9.1.4 CORS（Cross-Origin Resource Sharing）設定

**Phase 1の方針**:
- Next.js API Routesはデフォルトで**同一オリジンのみ許可**
- 追加のCORS設定は不要

**Phase 4以降**:
- 必要に応じてCORSヘッダーを設定
```javascript
export async function POST(request: Request) {
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': 'https://example.com',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE',
    },
  });
}
```

---

#### 9.1.5 レート制限

**Phase 1**: 未実装

**Phase 4以降の検討事項**:
- 1分間に10回までの投稿制限
- 1秒間に5回までのいいね制限
- IPアドレスベースまたはユーザーIDベースの制限

---

#### 9.1.6 入力値のサニタイゼーション

**対策**:
- ✅ 文字数制限の強制（280文字）
- ✅ トリム処理（前後の空白削除）
- ✅ 型チェック（文字列であることを確認）

**実装例**:
```javascript
// バックエンド
const content = String(body.content).trim();

if (content.length > 280) {
  return NextResponse.json(
    { error: '投稿は280文字以内で入力してください' },
    { status: 400 }
  );
}
```

---

### 9.2 Phase 4以降のセキュリティ（参考）

#### 9.2.1 認証方式
- **Supabase Auth** または **NextAuth.js**を使用
- セッション管理：**Cookie（httpOnly, secure, sameSite）**
- トークン方式：JWT

#### 9.2.2 認可（Authorization）
- ユーザーは**自分の投稿のみ削除可能**
- API Routes内でセッション情報を検証

```javascript
// 例：削除前の所有者チェック
const { data: post } = await supabase
  .from('posts')
  .select('user_id')
  .eq('id', postId)
  .single();

if (post.user_id !== session.user.id) {
  return NextResponse.json(
    { error: '権限がありません' },
    { status: 403 }
  );
}
```

#### 9.2.3 パスワード管理
- **bcrypt**でハッシュ化（Supabase Authが自動処理）
- 平文保存は絶対にしない
- ソルトラウンド：10以上

#### 9.2.4 HTTPS通信
- 本番環境では**HTTPS必須**
- Vercelデプロイで自動対応
- 開発環境（localhost）はHTTPで可

---

### 9.3 セキュリティチェックリスト

| 項目 | Phase 1 | 実装方法 | 確認方法 |
|------|---------|---------|---------|
| 環境変数を.gitignoreに追加 | ✅ 必須 | `.gitignore`に`.env.local`追加 | `git status`で確認 |
| SQLインジェクション対策 | ✅ 必須 | パラメータ化クエリ使用 | コードレビュー |
| XSS対策 | ✅ 必須 | Reactのデフォルトエスケープ | `dangerouslySetInnerHTML`を使用しない |
| CORS設定 | ✅ 自動 | Next.jsデフォルト設定 | - |
| 入力値バリデーション | ✅ 必須 | 文字数・型チェック | テストケース実行 |
| レート制限 | ❌ Phase 4 | - | - |
| 認証・認可 | ❌ Phase 4 | - | - |
| HTTPS通信 | ❌ Phase 4 | Vercel自動対応 | - |

---

## 10. 学習目標

このアプリケーションを通じて学べる項目を以下に示す。

### 10.1 知識項目

#### C. Web基礎（19項目）
- [ ] クライアントとサーバーの役割を説明できる ← Phase 1
- [ ] HTTPとHTTPSの違いを説明できる ← Phase 1
- [ ] リクエストとレスポンスの流れを説明できる ← Phase 1
- [ ] URLの構造を説明できる ← Phase 1
- [ ] localhostとは何かを説明できる ← Phase 1
- [ ] ポート番号とは何かを説明できる ← Phase 1
- [ ] GET、POST、PUT、DELETEの違いを説明できる ← Phase 1-2
- [ ] 200、400、401、403、404、500の意味を説明できる ← Phase 1-4
- [ ] リクエストヘッダーとボディの違いを説明できる ← Phase 1
- [ ] Cookieとは何かを説明できる ← Phase 4
- [ ] Sessionとは何かを説明できる ← Phase 4
- [ ] なぜCookie/Sessionが必要かを説明できる ← Phase 4
- [ ] ログイン状態がどのように維持されるかを説明できる ← Phase 4
- [ ] CORSとは何かを説明できる ← Phase 1
- [ ] CORSエラーが発生する原因を説明できる ← Phase 1
- [ ] DevToolsの各タブの役割を説明できる ← Phase 1
- [ ] ドメインとは何かを説明できる ← Phase 1
- [ ] DNSの役割を説明できる ← Phase 1
- [ ] SSL/TLSとは何かを説明できる ← Phase 1

#### D. フロントエンド（20項目）
- [ ] HTMLとCSSの役割の違いを説明できる ← Phase 1
- [ ] よく使うHTMLタグを説明できる ← Phase 1
- [ ] `id`と`class`の違いを説明できる ← Phase 1
- [ ] CSSのセレクタの書き方を説明できる ← Phase 1
- [ ] Tailwind CSSとは何かを説明できる ← Phase 1
- [ ] ユーティリティクラスとは何かを説明できる ← Phase 1
- [ ] Reactとは何か、なぜ使うかを説明できる ← Phase 1
- [ ] コンポーネントとは何かを説明できる ← Phase 1
- [ ] JSXとは何かを説明できる ← Phase 1
- [ ] PropsとStateの違いを説明できる ← Phase 1
- [ ] Stateが変更されるとUIが再描画されることを説明できる ← Phase 1
- [ ] useStateの役割を説明できる ← Phase 1
- [ ] useEffectの役割を説明できる ← Phase 1
- [ ] 依存配列とは何か、なぜ必要かを説明できる ← Phase 1
- [ ] Next.jsとは何か、なぜ使うかを説明できる ← Phase 1
- [ ] App Routerとは何かを説明できる ← Phase 1
- [ ] ファイルベースルーティングの仕組みを説明できる ← Phase 1
- [ ] page.tsxとlayout.tsxの役割を説明できる ← Phase 1
- [ ] Server ComponentとClient Componentの違いを説明できる ← Phase 1
- [ ] Next.jsプロジェクトの基本的なディレクトリ構造を説明できる ← Phase 1

#### E. バックエンド（6項目）
- [ ] APIとは何かを説明できる ← Phase 1
- [ ] RESTとは何かを説明できる ← Phase 1
- [ ] エンドポイントとは何かを説明できる ← Phase 1
- [ ] CRUDとHTTPメソッドの対応を説明できる ← Phase 1
- [ ] API Routesとは何かを説明できる ← Phase 1
- [ ] route.tsの基本構造を説明できる ← Phase 1

#### F. データベース（6項目）
- [ ] RDBとは何かを説明できる ← Phase 1
- [ ] テーブル、カラム、レコードの関係を説明できる ← Phase 1
- [ ] 主キーとは何か、なぜ必要かを説明できる ← Phase 1
- [ ] 外部キーとは何かを説明できる ← Phase 1-3
- [ ] CRUD操作とSQLの対応を説明できる ← Phase 1-2
- [ ] WHERE句の役割を説明できる ← Phase 1

#### G. 認証（1項目）
- [ ] 認証と認可の違いを説明できる ← Phase 4

#### H. セキュリティ（2項目）
- [ ] コードにパスワードやAPIキーを直接書いてはいけない理由を説明できる ← Phase 1
- [ ] GitHubにAPIキーをpushしてしまった場合のリスクを説明できる ← Phase 1

---

### 10.2 経験項目

#### C. Web基礎（6項目）
- [ ] DevToolsを開ける ← Phase 1
- [ ] ElementsタブでHTML/CSSを確認できる ← Phase 1
- [ ] Consoleタブでログやエラーを確認できる ← Phase 1
- [ ] Networkタブでリクエスト/レスポンスを確認できる ← Phase 1
- [ ] Networkタブでステータスコードを確認できる ← Phase 1
- [ ] Networkタブでレスポンスボディを確認できる ← Phase 1

#### D. フロントエンド（24項目）
- [ ] HTMLでページの構造を作成できる ← Phase 1
- [ ] CSSでスタイルを適用できる ← Phase 1
- [ ] クラスを使ってスタイルを適用できる ← Phase 1
- [ ] Tailwindのユーティリティクラスを使える ← Phase 1
- [ ] Tailwindのドキュメントでクラスを調べて使える ← Phase 1
- [ ] 関数コンポーネントを作成できる ← Phase 1
- [ ] JSXでHTMLライクな記法を書ける ← Phase 1
- [ ] Propsを受け取るコンポーネントを作成できる ← Phase 1
- [ ] 親から子へPropsを渡せる ← Phase 1
- [ ] 条件分岐で表示を切り替えられる ← Phase 1
- [ ] 配列を`map()`でリスト表示できる ← Phase 1
- [ ] `key`属性を設定できる ← Phase 1
- [ ] useStateでStateを定義できる ← Phase 1
- [ ] setState関数でStateを更新できる ← Phase 1
- [ ] useEffectで初回マウント時の処理を書ける ← Phase 1
- [ ] useEffectでState変更時の処理を書ける ← Phase 1
- [ ] 依存配列を正しく設定できる ← Phase 1
- [ ] `create-next-app`でプロジェクトを作成できる ← Phase 1
- [ ] `npm run dev`で開発サーバーを起動できる ← Phase 1
- [ ] 新しいページを作成できる ← Phase 3
- [ ] Linkコンポーネントでページ遷移を実装できる ← Phase 3
- [ ] Imageコンポーネントで画像を表示できる ← Phase 1
- [ ] Client Componentを作成できる ← Phase 1
- [ ] 既存プロジェクトのディレクトリ構造を把握できる ← Phase 1

#### E. バックエンド（8項目）
- [ ] GETエンドポイントを作成できる ← Phase 1
- [ ] POSTエンドポイントを作成できる ← Phase 1
- [ ] リクエストからパラメータを取得できる ← Phase 1
- [ ] NextResponseでJSONレスポンスを返せる ← Phase 1
- [ ] ステータスコードを指定してレスポンスを返せる ← Phase 1
- [ ] `request.json()`でリクエストボディをパースできる ← Phase 1
- [ ] 適切なステータスコードでレスポンスを返せる ← Phase 1
- [ ] エラー時に適切なエラーメッセージを返せる ← Phase 1

#### F. データベース（9項目）
- [ ] SELECT文でデータを取得できる ← Phase 1
- [ ] WHERE句で条件を指定できる ← Phase 1
- [ ] INSERT文でデータを追加できる ← Phase 1
- [ ] UPDATE文でデータを更新できる ← Phase 2
- [ ] DELETE文でデータを削除できる ← Phase 1
- [ ] DBクライアントをインストールできる ← Phase 1
- [ ] データベースに接続できる ← Phase 1
- [ ] テーブルの内容を確認できる ← Phase 1
- [ ] データを直接編集できる ← Phase 1

#### H. セキュリティ（4項目）
- [ ] APIキーを.envファイルに保存できる ← Phase 1
- [ ] コードから環境変数を読み込める ← Phase 1
- [ ] .envが.gitignoreに含まれていることを確認できる ← Phase 1
- [ ] 機密情報を環境変数で管理できる ← Phase 1

---

### 10.3 フェーズ別の学習項目まとめ

| フェーズ | 主な学習内容 |
|---------|-------------|
| Phase 1 | Web基礎、React/Next.js、REST API、SQL基本操作、環境変数管理 |
| Phase 2 | PUTメソッド、UPDATE文 |
| Phase 3 | テーブルリレーション、動的ルーティング、Linkコンポーネント |
| Phase 4 | Cookie/Session、認証と認可、ログイン状態維持、401/403エラー |

---

## 付録

### A. 開発環境セットアップ手順（別ドキュメント参照）
### B. APIテスト方法（別ドキュメント参照）
### C. デプロイ手順（Phase 1では未実施）
### D. トラブルシューティング（別ドキュメント参照）

---

**ドキュメント終了**