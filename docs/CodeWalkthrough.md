# MiniSocial コードウォークスルー

Phase 1のコードを読みながら、学習目標のチェック項目を埋めていくためのガイド。

---

## 目次

1. [このドキュメントの使い方](#1-このドキュメントの使い方)
2. [プロジェクト全体像](#2-プロジェクト全体像)
3. [Web基礎を理解する](#3-web基礎を理解する)
4. [フロントエンドを理解する](#4-フロントエンドを理解する)
5. [バックエンドを理解する](#5-バックエンドを理解する)
6. [データベースを理解する](#6-データベースを理解する)
7. [セキュリティを理解する](#7-セキュリティを理解する)
8. [実践：DevToolsで確認する](#8-実践devtoolsで確認する)

---

## 1. このドキュメントの使い方

### 進め方

1. 各セクションを順番に読む
2. 「📁 該当ファイル」に記載されたファイルを実際に開いて確認する
3. 「✅ チェック項目」を理解できたらチェックを入れる
4. 「🔍 確認してみよう」の課題を実際に試す

### 準備

```bash
# 開発サーバーを起動しておく
npm run dev
```

ブラウザで http://localhost:3000 を開いておく。

---

## 2. プロジェクト全体像

### 2.1 ディレクトリ構造

```
test_1/
├── docs/                    # ドキュメント
│   ├── RDdoc.md            # 要件定義書
│   ├── Plan.md             # 実装計画書
│   └── CodeWalkthrough.md  # このファイル
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # APIエンドポイント
│   │   │   └── posts/
│   │   │       ├── route.ts           # GET/POST /api/posts
│   │   │       └── [id]/
│   │   │           ├── route.ts       # DELETE /api/posts/[id]
│   │   │           └── like/
│   │   │               └── route.ts   # POST /api/posts/[id]/like
│   │   ├── globals.css     # グローバルスタイル
│   │   ├── layout.tsx      # ルートレイアウト
│   │   └── page.tsx        # ホームページ
│   ├── components/         # Reactコンポーネント
│   │   ├── PostForm.tsx    # 投稿フォーム
│   │   ├── PostCard.tsx    # 投稿カード
│   │   └── PostList.tsx    # 投稿一覧
│   ├── lib/
│   │   └── supabase.ts     # Supabaseクライアント
│   └── types/
│       └── index.ts        # 型定義
├── supabase/
│   └── schema.sql          # データベーススキーマ
├── .env.local.example      # 環境変数テンプレート
├── .env.local              # 環境変数（Git管理外）
└── package.json            # プロジェクト設定
```

### ✅ チェック項目
- [x] Next.jsプロジェクトの基本的なディレクトリ構造を説明できる
- [x] 既存プロジェクトのディレクトリ構造を把握できる

### 🔍 確認してみよう
1. 上記のディレクトリ構造と、実際のプロジェクトを見比べてみよう
2. `src/app/` 配下のファイルがURLとどう対応しているか考えてみよう

---

## 3. Web基礎を理解する

### 3.1 クライアントとサーバー

```
┌─────────────────────────────────────┐
│         ブラウザ (Client)            │  ← あなたのPC
│  - HTMLを表示する                    │
│  - ユーザーの操作を受け付ける          │
└──────────────┬──────────────────────┘
               │ HTTPリクエスト
               │ (「この投稿一覧をください」)
               ▼
┌─────────────────────────────────────┐
│       Next.js サーバー (Server)      │  ← localhost:3000
│  - リクエストを受け取る               │
│  - データベースからデータを取得        │
│  - レスポンスを返す                   │
└──────────────┬──────────────────────┘
               │ HTTPレスポンス
               │ (投稿データのJSON)
               ▼
          ブラウザに表示
```

**クライアント（Client）**: リクエストを送る側（ブラウザ）
**サーバー（Server）**: リクエストを受けて処理する側（Next.js）

### ✅ チェック項目
- [x] クライアントとサーバーの役割を説明できる

---

### 3.2 リクエストとレスポンス

📁 **該当ファイル**: `src/app/page.tsx`

```typescript
// 26行目あたり
const fetchPosts = async () => {
  try {
    const response = await fetch('/api/posts');  // ← リクエストを送信
    const data = await response.json();          // ← レスポンスを受信
```

**リクエスト**: クライアントからサーバーへの要求
- 「投稿一覧をください」→ `GET /api/posts`
- 「この内容で投稿を作成して」→ `POST /api/posts`

**レスポンス**: サーバーからクライアントへの応答
- 投稿データ（JSON形式）
- ステータスコード（200, 400, 404, 500など）

### ✅ チェック項目
- [x] リクエストとレスポンスの流れを説明できる

---

### 3.3 URL の構造

```
http://localhost:3000/api/posts/123/like
│      │         │    │    │    │   │
│      │         │    │    │    │   └─ パス（エンドポイントの一部）
│      │         │    │    │    └───── パスパラメータ（動的な値）
│      │         │    │    └────────── パス
│      │         │    └─────────────── パス
│      │         └──────────────────── ポート番号
│      └────────────────────────────── ホスト名（ドメイン）
└───────────────────────────────────── プロトコル
```

| 要素 | 例 | 説明 |
|------|-----|------|
| プロトコル | `http://` | 通信方式。`https://`は暗号化あり |
| ホスト名 | `localhost` | サーバーの場所。本番では`example.com`など |
| ポート番号 | `3000` | サーバーの入り口番号 |
| パス | `/api/posts` | サーバー内のどの機能を呼ぶか |

### 3.4 localhost とポート番号

**localhost**: 自分のPC自身を指す特別なホスト名
- `localhost` = `127.0.0.1`（自分自身のIPアドレス）
- 開発中は自分のPCがサーバーになる

**ポート番号**: サーバーへの入り口番号
- 1つのPCで複数のサーバーを動かせる
- Next.jsはデフォルトで`3000`番を使用
- 例: 3000番 = Next.js、5432番 = PostgreSQL

### ✅ チェック項目
- [x] URLの構造を説明できる
- [x] localhostとは何かを説明できる
- [x] ポート番号とは何かを説明できる

---

### 3.5 HTTPメソッド（GET, POST, DELETE）

📁 **該当ファイル**: `src/app/api/posts/route.ts`

```typescript
// GETメソッド: データを取得する
export async function GET() {
  // 投稿一覧を取得して返す
}

// POSTメソッド: データを作成する
export async function POST(request: Request) {
  // 新しい投稿を作成する
}
```

📁 **該当ファイル**: `src/app/api/posts/[id]/route.ts`

```typescript
// DELETEメソッド: データを削除する
export async function DELETE(request: Request, { params }: Params) {
  // 指定されたIDの投稿を削除する
}
```

| メソッド | 用途 | 例 |
|---------|------|-----|
| GET | データを取得 | 投稿一覧を取得 |
| POST | データを作成 | 新しい投稿を作成 |
| PUT | データを更新（全体） | 投稿を編集（Phase 2） |
| DELETE | データを削除 | 投稿を削除 |

### ✅ チェック項目
- [x] GET、POST、PUT、DELETEの違いを説明できる

---

### 3.6 HTTPステータスコード

📁 **該当ファイル**: `src/app/api/posts/route.ts`

```typescript
// 成功: 201 Created
return NextResponse.json({ post }, { status: 201 });

// クライアントエラー: 400 Bad Request
return NextResponse.json(
  { error: '投稿内容を入力してください' },
  { status: 400 }
);

// サーバーエラー: 500 Internal Server Error
return NextResponse.json(
  { error: '投稿の作成に失敗しました' },
  { status: 500 }
);
```

📁 **該当ファイル**: `src/app/api/posts/[id]/route.ts`

```typescript
// 404 Not Found
return NextResponse.json(
  { error: '投稿が見つかりません' },
  { status: 404 }
);
```

| コード | 意味 | いつ使う？ |
|-------|------|----------|
| 200 | OK（成功） | 正常にデータ取得・更新・削除できた |
| 201 | Created（作成成功） | 新しいデータを作成できた |
| 400 | Bad Request | リクエストの形式が間違っている |
| 401 | Unauthorized | ログインしていない（Phase 4） |
| 403 | Forbidden | 権限がない（Phase 4） |
| 404 | Not Found | 指定したデータが存在しない |
| 500 | Internal Server Error | サーバー側でエラーが発生 |

### ✅ チェック項目
- [x] 200、400、401、403、404、500の意味を説明できる

---

### 3.7 リクエストヘッダーとボディ

📁 **該当ファイル**: `src/components/PostForm.tsx`

```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',  // ← リクエストヘッダー
  },
  body: JSON.stringify({ content }),     // ← リクエストボディ
});
```

**ヘッダー（Header）**: リクエストの「メタ情報」
- `Content-Type`: ボディのデータ形式（JSON、HTMLなど）
- `Authorization`: 認証情報（Phase 4）
- `Cookie`: セッション情報（Phase 4）

**ボディ（Body）**: リクエストの「本体データ」
- POSTやPUTで送るデータ本体
- 例: `{ "content": "今日は良い天気！" }`

### ✅ チェック項目
- [x] リクエストヘッダーとボディの違いを説明できる

---

### 3.8 HTTPとHTTPS

| 項目 | HTTP | HTTPS |
|-----|------|-------|
| 暗号化 | なし | あり（SSL/TLS） |
| ポート | 80 | 443 |
| 用途 | 開発環境 | 本番環境 |
| URL | `http://` | `https://` |

**開発中**（localhost）: HTTPでOK
**本番環境**: HTTPSが必須（通信が暗号化される）

**SSL/TLS**: 通信を暗号化する技術
- 第三者に通信内容を盗み見られない
- Vercelにデプロイすると自動でHTTPSになる

### ✅ チェック項目
- [x] HTTPとHTTPSの違いを説明できる
- [x] SSL/TLSとは何かを説明できる

---

### 3.9 ドメインとDNS

**ドメイン**: 人間が読みやすいサーバーの名前
- `google.com`、`twitter.com`など
- 実際はIPアドレス（例: `142.250.196.110`）に変換される

**DNS（Domain Name System）**: ドメイン名をIPアドレスに変換する仕組み
```
ブラウザ: 「google.comのIPアドレスは？」
    ↓
DNSサーバー: 「142.250.196.110 です」
    ↓
ブラウザ: そのIPアドレスに接続
```

**localhost**の場合:
- DNSを使わず、直接 `127.0.0.1`（自分自身）に接続

### ✅ チェック項目
- [x] ドメインとは何かを説明できる
- [x] DNSの役割を説明できる

---

### 3.10 CORS（Cross-Origin Resource Sharing）

**オリジン（Origin）**: プロトコル + ホスト + ポート の組み合わせ
- `http://localhost:3000` と `http://localhost:3001` は**別オリジン**
- `http://example.com` と `https://example.com` も**別オリジン**

**CORS**: 異なるオリジン間でのリクエストを制御する仕組み

```
http://localhost:3000 (フロントエンド)
        ↓ リクエスト
http://localhost:8080 (別のAPIサーバー)  ← 別オリジン！
```

**CORSエラーが発生する原因**:
- ブラウザがセキュリティのため、異なるオリジンへのリクエストをブロック
- サーバー側で許可設定が必要

**MiniSocialではCORSエラーが起きない理由**:
- フロントエンドとAPIが同じオリジン（`http://localhost:3000`）
- Next.js API Routesは同一オリジンで動作

### ✅ チェック項目
- [x] CORSとは何かを説明できる
- [x] CORSエラーが発生する原因を説明できる

---

## 4. フロントエンドを理解する

### 4.1 HTMLとCSS

📁 **該当ファイル**: `src/app/page.tsx`

```tsx
return (
  <div className="min-h-screen bg-gray-50">        {/* HTML: div要素 */}
    <header className="bg-white border-b ...">     {/* CSS: Tailwindクラス */}
      <h1 className="text-2xl font-bold text-blue-500">MiniSocial</h1>
    </header>
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* コンテンツ */}
    </main>
  </div>
);
```

**HTML**: ページの「構造」を定義
- `<div>`: 汎用的なコンテナ
- `<header>`: ヘッダー領域
- `<main>`: メインコンテンツ
- `<h1>`: 見出し
- `<p>`: 段落
- `<button>`: ボタン
- `<form>`: フォーム
- `<input>`, `<textarea>`: 入力欄

**CSS**: ページの「見た目」を定義
- 色、サイズ、配置などを指定

### ✅ チェック項目
- [x] HTMLとCSSの役割の違いを説明できる
- [x] よく使うHTMLタグを説明できる

---

### 4.2 idとclass

```html
<!-- id: ページ内で一意（1つだけ） -->
<div id="main-content">

<!-- class: 複数の要素に同じスタイルを適用 -->
<div class="card">
<div class="card">
```

**Tailwind CSS**ではほぼ `class` のみを使用:

```tsx
<button className="px-6 py-2 bg-blue-500 text-white rounded-full">
```

### ✅ チェック項目
- [x] `id`と`class`の違いを説明できる

---

### 4.3 Tailwind CSS

📁 **該当ファイル**: `src/components/PostCard.tsx`

```tsx
<article className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
```

**Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- クラス名でスタイルを直接指定
- CSSファイルを別途書く必要がない

**ユーティリティクラス**: 1つのCSSプロパティに対応するクラス

| クラス | 意味 | CSSに相当 |
|-------|------|----------|
| `p-4` | padding: 1rem | `padding: 16px` |
| `bg-white` | 背景色: 白 | `background-color: white` |
| `text-blue-500` | 文字色: 青 | `color: #3b82f6` |
| `rounded-lg` | 角丸: 大 | `border-radius: 8px` |
| `hover:shadow-md` | ホバー時に影 | `:hover { box-shadow: ... }` |

### 🔍 確認してみよう
Tailwindのドキュメント（https://tailwindcss.com/docs）で`flex`や`grid`を調べてみよう

### ✅ チェック項目
- [x] Tailwind CSSとは何かを説明できる
- [x] ユーティリティクラスとは何かを説明できる
- [x] CSSのセレクタの書き方を説明できる
- [x] Tailwindのユーティリティクラスを使える
- [x] Tailwindのドキュメントでクラスを調べて使える

---

### 4.4 React とコンポーネント

📁 **該当ファイル**: `src/components/PostCard.tsx`

```tsx
// 関数コンポーネントの定義
export default function PostCard({ post, onDelete, onLike }: Props) {
  return (
    <article className="p-4 bg-white ...">
      <p>{post.content}</p>
      {/* ... */}
    </article>
  );
}
```

**React**: UIを構築するためのJavaScriptライブラリ
- コンポーネントを組み合わせてUIを作る
- 状態（State）が変わると自動で再描画

**コンポーネント**: 再利用可能なUIの部品
- `PostCard`: 1つの投稿を表示する部品
- `PostList`: 投稿カードを並べる部品
- `PostForm`: 投稿フォームの部品

**なぜReactを使うのか？**
1. コンポーネントで分割して管理しやすい
2. 状態が変わると自動で画面更新
3. 同じ部品を再利用できる

### ✅ チェック項目
- [x] Reactとは何か、なぜ使うかを説明できる
- [x] コンポーネントとは何かを説明できる
- [x] 関数コンポーネントを作成できる

---

### 4.5 JSX

📁 **該当ファイル**: `src/components/PostCard.tsx`

```tsx
return (
  <article className="p-4 bg-white border">
    {/* JSX内でJavaScriptを使う場合は {} で囲む */}
    <p>{post.content}</p>
    <p>{formatDate(post.created_at)}</p>

    {/* 条件分岐 */}
    <span>{hasLiked ? '❤️' : '♡'}</span>

    {/* イベントハンドラ */}
    <button onClick={handleLike}>いいね</button>
  </article>
);
```

**JSX**: JavaScript内でHTMLライクな記法を書ける構文
- `className`（HTMLの`class`に相当）
- `{}`内でJavaScript式を埋め込める
- `onClick`などでイベントを処理

**HTMLとの違い**:
| HTML | JSX |
|------|-----|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |

### ✅ チェック項目
- [x] JSXとは何かを説明できる
- [x] JSXでHTMLライクな記法を書ける
- [x] HTMLでページの構造を作成できる
- [x] CSSでスタイルを適用できる
- [x] クラスを使ってスタイルを適用できる

---

### 4.6 Props

📁 **該当ファイル**: `src/components/PostCard.tsx`

```tsx
// Propsの型定義
type Props = {
  post: Post;
  onDelete: (id: number) => void;
  onLike: (id: number, newLikeCount: number) => void;
};

// Propsを受け取る
export default function PostCard({ post, onDelete, onLike }: Props) {
  // post, onDelete, onLike が使える
}
```

📁 **該当ファイル**: `src/components/PostList.tsx`

```tsx
// 親から子へPropsを渡す
{posts.map((post) => (
  <PostCard
    key={post.id}
    post={post}           // ← Propsとして渡す
    onDelete={onDelete}   // ← Propsとして渡す
    onLike={onLike}       // ← Propsとして渡す
  />
))}
```

**Props**: 親コンポーネントから子コンポーネントへ渡すデータ
- 読み取り専用（子で変更できない）
- 親から子への一方通行

### ✅ チェック項目
- [x] Propsを受け取るコンポーネントを作成できる
- [x] 親から子へPropsを渡せる

---

### 4.7 State と useState

📁 **該当ファイル**: `src/app/page.tsx`

```tsx
'use client';  // Client Componentであることを宣言

import { useState } from 'react';

export default function Home() {
  // State の定義
  const [posts, setPosts] = useState<Post[]>([]);      // 投稿一覧
  const [isLoading, setIsLoading] = useState(true);    // ローディング状態
  const [error, setError] = useState('');              // エラーメッセージ

  // State の更新
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);  // 新しい投稿を先頭に追加
  };
```

**State**: コンポーネントが持つ「状態」
- 値が変わると自動で再描画される
- `useState`で定義する

**useState の使い方**:
```tsx
const [値, 更新関数] = useState(初期値);

// 例
const [count, setCount] = useState(0);
setCount(count + 1);  // countが1になり、画面も更新される
```

**Props と State の違い**:
| Props | State |
|-------|-------|
| 親から渡される | 自分で管理 |
| 読み取り専用 | 変更可能 |
| 外部からのデータ | 内部の状態 |

### ✅ チェック項目
- [x] PropsとStateの違いを説明できる
- [x] Stateが変更されるとUIが再描画されることを説明できる
- [x] useStateの役割を説明できる
- [x] useStateでStateを定義できる
- [x] setState関数でStateを更新できる

---

### 4.8 useEffect と依存配列

📁 **該当ファイル**: `src/app/page.tsx`

```tsx
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  // 投稿一覧を取得する関数
  const fetchPosts = async () => {
    const response = await fetch('/api/posts');
    const data = await response.json();
    setPosts(data.posts);
  };

  // 初回マウント時に実行
  useEffect(() => {
    fetchPosts();
  }, []);  // ← 依存配列が空 = 初回のみ実行
```

**useEffect**: 副作用（データ取得、DOM操作など）を扱うHook

**依存配列**: useEffectがいつ実行されるかを制御
```tsx
useEffect(() => {
  // 処理
}, [依存する値]);

// パターン
useEffect(() => { ... }, []);      // 初回マウント時のみ
useEffect(() => { ... }, [count]); // countが変わるたび
useEffect(() => { ... });          // 毎回（非推奨）
```

**なぜ依存配列が必要？**
- 不要な再実行を防ぐ
- 無限ループを防ぐ
- パフォーマンスの最適化

### ✅ チェック項目
- [x] useEffectの役割を説明できる
- [x] 依存配列とは何か、なぜ必要かを説明できる
- [x] useEffectで初回マウント時の処理を書ける
- [x] useEffectでState変更時の処理を書ける
- [x] 依存配列を正しく設定できる

---

### 4.9 条件分岐とリスト表示

📁 **該当ファイル**: `src/components/PostList.tsx`

```tsx
export default function PostList({ posts, isLoading, onDelete, onLike }: Props) {
  // 条件分岐で表示を切り替え
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (posts.length === 0) {
    return <p>まだ投稿がありません。</p>;
  }

  // 配列をmap()でリスト表示
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}  // ← key属性は必須
          post={post}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
```

**条件分岐**: `if`文や三項演算子で表示を切り替え
```tsx
{isLoading ? <Spinner /> : <Content />}
{error && <ErrorMessage />}
```

**key属性**: リスト表示時に各要素を識別するために必須
- Reactが効率的に再描画するために使用
- 一意な値（通常はID）を指定

### ✅ チェック項目
- [x] 条件分岐で表示を切り替えられる
- [x] 配列を`map()`でリスト表示できる
- [x] `key`属性を設定できる

---

### 4.10 Next.jsとApp Router

📁 **該当ファイル**: `src/app/page.tsx`, `src/app/layout.tsx`

**Next.js**: Reactベースのフレームワーク
- ファイルベースルーティング
- API Routes（バックエンド機能）
- 最適化（画像、フォントなど）

**App Router**: Next.js 13以降の新しいルーティング方式
- `src/app/` 配下にファイルを置くだけでルートが作られる

**ファイルベースルーティング**:
```
src/app/
├── page.tsx           → /
├── layout.tsx         → 全ページ共通のレイアウト
└── posts/
    └── [id]/
        └── page.tsx   → /posts/123 など（Phase 3）
```

**page.tsx と layout.tsx の役割**:

📁 **該当ファイル**: `src/app/layout.tsx`
```tsx
// layout.tsx: 共通のレイアウト（ヘッダー、フッターなど）
export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>  {/* ← ここにpage.tsxの内容が入る */}
    </html>
  );
}
```

📁 **該当ファイル**: `src/app/page.tsx`
```tsx
// page.tsx: そのルートのコンテンツ
export default function Home() {
  return <div>ホームページの内容</div>;
}
```

### ✅ チェック項目
- [x] Next.jsとは何か、なぜ使うかを説明できる
- [x] App Routerとは何かを説明できる
- [x] ファイルベースルーティングの仕組みを説明できる
- [x] page.tsxとlayout.tsxの役割を説明できる
- [x] `create-next-app`でプロジェクトを作成できる
- [x] `npm run dev`で開発サーバーを起動できる

---

### 4.11 Server Component と Client Component

📁 **該当ファイル**: `src/app/page.tsx`

```tsx
'use client';  // ← これがあるとClient Component

import { useState, useEffect } from 'react';
```

**Server Component**（デフォルト）:
- サーバー側でレンダリング
- `useState`, `useEffect` は使えない
- データ取得を直接書ける

**Client Component**:
- ブラウザ側でレンダリング
- `'use client'` を先頭に書く
- `useState`, `useEffect`, イベントハンドラが使える

**MiniSocialでClient Componentを使う理由**:
- `useState` で投稿一覧を管理
- `useEffect` でデータ取得
- ボタンのクリックイベントを処理

### ✅ チェック項目
- [x] Server ComponentとClient Componentの違いを説明できる
- [x] Client Componentを作成できる

---

## 5. バックエンドを理解する

### 5.1 API とは

**API（Application Programming Interface）**: プログラム同士が通信するための窓口

MiniSocialの場合:
```
フロントエンド ←→ API ←→ データベース
（React）      （Next.js API Routes）  （Supabase）
```

**REST API**: HTTPメソッドとURLでリソースを操作する設計スタイル
- `GET /api/posts` → 投稿一覧を取得
- `POST /api/posts` → 投稿を作成
- `DELETE /api/posts/123` → ID:123の投稿を削除

### ✅ チェック項目
- [x] APIとは何かを説明できる
- [x] RESTとは何かを説明できる

---

### 5.2 エンドポイント

**エンドポイント**: APIの各機能にアクセスするためのURL

| エンドポイント | メソッド | 機能 |
|--------------|---------|------|
| `/api/posts` | GET | 投稿一覧取得 |
| `/api/posts` | POST | 投稿作成 |
| `/api/posts/[id]` | DELETE | 投稿削除 |
| `/api/posts/[id]/like` | POST | いいね追加 |

### ✅ チェック項目
- [x] エンドポイントとは何かを説明できる

---

### 5.3 CRUD と HTTPメソッド

| CRUD | 意味 | HTTPメソッド | SQL |
|------|------|-------------|-----|
| Create | 作成 | POST | INSERT |
| Read | 読み取り | GET | SELECT |
| Update | 更新 | PUT/PATCH | UPDATE |
| Delete | 削除 | DELETE | DELETE |

### ✅ チェック項目
- [x] CRUDとHTTPメソッドの対応を説明できる

---

### 5.4 API Routes（route.ts）の構造

📁 **該当ファイル**: `src/app/api/posts/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/posts
export async function GET() {
  try {
    // 1. データベースからデータ取得
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*');

    // 2. エラーチェック
    if (error) {
      return NextResponse.json(
        { error: '投稿の取得に失敗しました' },
        { status: 500 }
      );
    }

    // 3. 成功レスポンスを返す
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: '投稿の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: Request) {
  try {
    // 1. リクエストボディを取得
    const body = await request.json();
    const { content } = body;

    // 2. バリデーション
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: '投稿内容を入力してください' },
        { status: 400 }
      );
    }

    // 3. データベースに保存
    const { data: post, error } = await supabase
      .from('posts')
      .insert({ content: content.trim() })
      .select()
      .single();

    // 4. レスポンスを返す
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: '投稿の作成に失敗しました' },
      { status: 500 }
    );
  }
}
```

**route.ts の基本構造**:
1. 関数名がHTTPメソッドに対応（`GET`, `POST`, `PUT`, `DELETE`）
2. `NextResponse.json()` でJSONレスポンスを返す
3. `status` でステータスコードを指定
4. `request.json()` でリクエストボディを取得

### ✅ チェック項目
- [x] API Routesとは何かを説明できる
- [x] route.tsの基本構造を説明できる
- [x] GETエンドポイントを作成できる
- [x] POSTエンドポイントを作成できる
- [x] リクエストからパラメータを取得できる
- [x] NextResponseでJSONレスポンスを返せる
- [x] ステータスコードを指定してレスポンスを返せる
- [x] `request.json()`でリクエストボディをパースできる
- [x] 適切なステータスコードでレスポンスを返せる
- [x] エラー時に適切なエラーメッセージを返せる

---

## 6. データベースを理解する

### 6.1 RDB（リレーショナルデータベース）

📁 **該当ファイル**: `supabase/schema.sql`

```sql
-- postsテーブル
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- likesテーブル
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**RDB**: データを「テーブル」という表形式で管理するデータベース
- Excel のシートのようなイメージ
- テーブル同士を「関連付け」できる

**テーブル、カラム、レコード**:
```
posts テーブル
┌────┬─────────────────┬─────────────────────┐
│ id │ content         │ created_at          │  ← カラム（列）
├────┼─────────────────┼─────────────────────┤
│ 1  │ Hello World!    │ 2025-12-27 10:00:00 │  ← レコード（行）
│ 2  │ 今日は良い天気   │ 2025-12-27 11:00:00 │  ← レコード（行）
└────┴─────────────────┴─────────────────────┘
```

### ✅ チェック項目
- [x] RDBとは何かを説明できる
- [x] テーブル、カラム、レコードの関係を説明できる

---

### 6.2 主キーと外部キー

📁 **該当ファイル**: `supabase/schema.sql`

```sql
-- 主キー（PRIMARY KEY）
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,  -- ← 主キー：各レコードを一意に識別
  ...
);

-- 外部キー（REFERENCES）
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  --                       ↑ 外部キー：postsテーブルのidを参照
  ...
);
```

**主キー（Primary Key）**:
- 各レコードを一意に識別する値
- 重複しない、NULLにならない
- 通常は `id` カラム

**外部キー（Foreign Key）**:
- 他のテーブルのレコードを参照する
- テーブル同士の「関連」を表現

```
posts                    likes
┌────┬─────────┐        ┌────┬─────────┐
│ id │ content │        │ id │ post_id │
├────┼─────────┤        ├────┼─────────┤
│ 1  │ Hello   │◄───────│ 1  │ 1       │
│    │         │◄───────│ 2  │ 1       │
│ 2  │ 今日は  │◄───────│ 3  │ 2       │
└────┴─────────┘        └────┴─────────┘
```

### ✅ チェック項目
- [x] 主キーとは何か、なぜ必要かを説明できる
- [x] 外部キーとは何かを説明できる

---

### 6.3 SQL の基本操作

📁 **該当ファイル**: `src/app/api/posts/route.ts`

**SELECT（読み取り）**:
```typescript
// Supabaseでの書き方
const { data } = await supabase
  .from('posts')
  .select('id, content, created_at')
  .order('created_at', { ascending: false });

// 相当するSQL
// SELECT id, content, created_at FROM posts ORDER BY created_at DESC;
```

**INSERT（作成）**:
```typescript
// Supabaseでの書き方
const { data } = await supabase
  .from('posts')
  .insert({ content: '新しい投稿' })
  .select()
  .single();

// 相当するSQL
// INSERT INTO posts (content) VALUES ('新しい投稿') RETURNING *;
```

**DELETE（削除）**:
```typescript
// Supabaseでの書き方
const { data } = await supabase
  .from('posts')
  .delete()
  .eq('id', 123);

// 相当するSQL
// DELETE FROM posts WHERE id = 123;
```

**WHERE句**: 条件を指定してレコードを絞り込む
```typescript
.eq('id', 123)      // WHERE id = 123
.gt('likes', 10)    // WHERE likes > 10
.like('content', '%キーワード%')  // WHERE content LIKE '%キーワード%'
```

### ✅ チェック項目
- [ ] CRUD操作とSQLの対応を説明できる
- [ ] WHERE句の役割を説明できる
- [ ] SELECT文でデータを取得できる
- [ ] WHERE句で条件を指定できる
- [ ] INSERT文でデータを追加できる
- [ ] DELETE文でデータを削除できる
- [ ] DBクライアントをインストールできる
- [ ] データベースに接続できる
- [ ] テーブルの内容を確認できる
- [ ] データを直接編集できる

---

## 7. セキュリティを理解する

### 7.1 環境変数

📁 **該当ファイル**: `.env.local.example`

```bash
# Supabase接続情報
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

📁 **該当ファイル**: `src/lib/supabase.ts`

```typescript
// 環境変数を読み込む
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
```

**なぜ環境変数を使うのか？**
1. **セキュリティ**: APIキーをコードに直接書くと漏洩リスク
2. **環境ごとの設定**: 開発・本番で異なる値を使える
3. **Git管理外**: `.gitignore` で除外できる

### ✅ チェック項目
- [x] コードにパスワードやAPIキーを直接書いてはいけない理由を説明できる
- [x] APIキーを.envファイルに保存できる
- [x] コードから環境変数を読み込める

---

### 7.2 .gitignore

📁 **該当ファイル**: `.gitignore`

```
# env files (can opt-in for committing if needed)
.env*
```

**GitHubにAPIキーをpushしてしまった場合のリスク**:
1. 第三者にAPIキーを悪用される
2. 課金されるサービスなら金銭的被害
3. データを削除・改ざんされる可能性
4. 一度公開されるとGitの履歴に残る

### 🔍 確認してみよう
```bash
# .gitignore に .env.local が含まれているか確認
cat .gitignore | grep env
```

### ✅ チェック項目
- [x] GitHubにAPIキーをpushしてしまった場合のリスクを説明できる
- [x] .envが.gitignoreに含まれていることを確認できる
- [x] 機密情報を環境変数で管理できる

---

## 8. 実践：DevToolsで確認する

### 8.1 DevTools を開く

**開き方**:
- Windows: `F12` または `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`
- 右クリック →「検証」

### 8.2 Elements タブ

- HTMLの構造を確認できる
- CSSのスタイルを確認・編集できる
- 要素をクリックして選択できる

**やってみよう**:
1. 投稿カードをクリックして選択
2. 右側のStyles欄でCSSを確認
3. 色を変更してみる（リロードすると元に戻る）

### 8.3 Console タブ

- `console.log()` の出力を確認
- JavaScriptエラーを確認
- JavaScriptを直接実行できる

**やってみよう**:
1. Consoleタブを開く
2. エラーが出ていないか確認
3. `console.log('Hello')` と入力してEnter

### 8.4 Network タブ

- すべてのHTTPリクエストを確認できる
- リクエスト/レスポンスの詳細を見られる

**やってみよう**:
1. Networkタブを開く
2. ページをリロード（または投稿を作成）
3. `posts` というリクエストをクリック
4. 以下を確認:
   - **Headers**: リクエストメソッド、ステータスコード
   - **Response**: レスポンスボディ（JSON）

### ✅ チェック項目
- [ ] DevToolsを開ける
- [ ] DevToolsの各タブの役割を説明できる
- [ ] ElementsタブでHTML/CSSを確認できる
- [ ] Consoleタブでログやエラーを確認できる
- [ ] Networkタブでリクエスト/レスポンスを確認できる
- [ ] Networkタブでステータスコードを確認できる
- [ ] Networkタブでレスポンスボディを確認できる

---

## チェックリスト総まとめ

### 知識項目

#### C. Web基礎
- [ ] クライアントとサーバーの役割を説明できる
- [ ] HTTPとHTTPSの違いを説明できる
- [ ] リクエストとレスポンスの流れを説明できる
- [ ] URLの構造を説明できる
- [ ] localhostとは何かを説明できる
- [ ] ポート番号とは何かを説明できる
- [ ] GET、POST、PUT、DELETEの違いを説明できる
- [ ] 200、400、401、403、404、500の意味を説明できる
- [ ] リクエストヘッダーとボディの違いを説明できる
- [ ] CORSとは何かを説明できる
- [ ] CORSエラーが発生する原因を説明できる
- [ ] DevToolsの各タブの役割を説明できる
- [ ] ドメインとは何かを説明できる
- [ ] DNSの役割を説明できる
- [ ] SSL/TLSとは何かを説明できる

#### D. フロントエンド
- [ ] HTMLとCSSの役割の違いを説明できる
- [ ] よく使うHTMLタグを説明できる
- [ ] `id`と`class`の違いを説明できる
- [ ] CSSのセレクタの書き方を説明できる
- [ ] Tailwind CSSとは何かを説明できる
- [ ] ユーティリティクラスとは何かを説明できる
- [ ] Reactとは何か、なぜ使うかを説明できる
- [ ] コンポーネントとは何かを説明できる
- [ ] JSXとは何かを説明できる
- [ ] PropsとStateの違いを説明できる
- [ ] Stateが変更されるとUIが再描画されることを説明できる
- [ ] useStateの役割を説明できる
- [ ] useEffectの役割を説明できる
- [ ] 依存配列とは何か、なぜ必要かを説明できる
- [ ] Next.jsとは何か、なぜ使うかを説明できる
- [ ] App Routerとは何かを説明できる
- [ ] ファイルベースルーティングの仕組みを説明できる
- [ ] page.tsxとlayout.tsxの役割を説明できる
- [ ] Server ComponentとClient Componentの違いを説明できる
- [ ] Next.jsプロジェクトの基本的なディレクトリ構造を説明できる

#### E. バックエンド
- [ ] APIとは何かを説明できる
- [ ] RESTとは何かを説明できる
- [ ] エンドポイントとは何かを説明できる
- [ ] CRUDとHTTPメソッドの対応を説明できる
- [ ] API Routesとは何かを説明できる
- [ ] route.tsの基本構造を説明できる

#### F. データベース
- [ ] RDBとは何かを説明できる
- [ ] テーブル、カラム、レコードの関係を説明できる
- [ ] 主キーとは何か、なぜ必要かを説明できる
- [ ] 外部キーとは何かを説明できる
- [ ] CRUD操作とSQLの対応を説明できる
- [ ] WHERE句の役割を説明できる

#### H. セキュリティ
- [ ] コードにパスワードやAPIキーを直接書いてはいけない理由を説明できる
- [ ] GitHubにAPIキーをpushしてしまった場合のリスクを説明できる

---

### 経験項目

#### C. Web基礎
- [ ] DevToolsを開ける
- [ ] ElementsタブでHTML/CSSを確認できる
- [ ] Consoleタブでログやエラーを確認できる
- [ ] Networkタブでリクエスト/レスポンスを確認できる
- [ ] Networkタブでステータスコードを確認できる
- [ ] Networkタブでレスポンスボディを確認できる

#### D. フロントエンド
- [ ] HTMLでページの構造を作成できる
- [ ] CSSでスタイルを適用できる
- [ ] クラスを使ってスタイルを適用できる
- [ ] Tailwindのユーティリティクラスを使える
- [ ] Tailwindのドキュメントでクラスを調べて使える
- [ ] 関数コンポーネントを作成できる
- [ ] JSXでHTMLライクな記法を書ける
- [ ] Propsを受け取るコンポーネントを作成できる
- [ ] 親から子へPropsを渡せる
- [ ] 条件分岐で表示を切り替えられる
- [ ] 配列を`map()`でリスト表示できる
- [ ] `key`属性を設定できる
- [ ] useStateでStateを定義できる
- [ ] setState関数でStateを更新できる
- [ ] useEffectで初回マウント時の処理を書ける
- [ ] useEffectでState変更時の処理を書ける
- [ ] 依存配列を正しく設定できる
- [ ] `create-next-app`でプロジェクトを作成できる
- [ ] `npm run dev`で開発サーバーを起動できる
- [ ] Client Componentを作成できる
- [ ] 既存プロジェクトのディレクトリ構造を把握できる

#### E. バックエンド
- [ ] GETエンドポイントを作成できる
- [ ] POSTエンドポイントを作成できる
- [ ] リクエストからパラメータを取得できる
- [ ] NextResponseでJSONレスポンスを返せる
- [ ] ステータスコードを指定してレスポンスを返せる
- [x] `request.json()`でリクエストボディをパースできる
- [ ] 適切なステータスコードでレスポンスを返せる
- [ ] エラー時に適切なエラーメッセージを返せる

#### F. データベース
- [ ] SELECT文でデータを取得できる
- [ ] WHERE句で条件を指定できる
- [ ] INSERT文でデータを追加できる
- [ ] DELETE文でデータを削除できる
- [ ] DBクライアントをインストールできる
- [ ] データベースに接続できる
- [ ] テーブルの内容を確認できる
- [ ] データを直接編集できる

#### H. セキュリティ
- [ ] APIキーを.envファイルに保存できる
- [ ] コードから環境変数を読み込める
- [ ] .envが.gitignoreに含まれていることを確認できる
- [ ] 機密情報を環境変数で管理できる

---

**ドキュメント終了**
