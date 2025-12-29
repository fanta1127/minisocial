# MiniSocial コードリーディングガイド

このドキュメントは、プロジェクト全体のコードを把握するための**読む順番**と**ポイント**をまとめたものです。

---

## 📚 推奨する読み順

### Step 1: 設定ファイルから始める
プロジェクトの「外枠」を理解します。

| ファイル | 確認ポイント |
|---------|-------------|
| `package.json` | 使用ライブラリ (next, react, supabase-js, tailwindcss) を確認 |
| `tsconfig.json` | `@/*` パスエイリアス（`@/` = `src/`）の設定を確認。これにより深い階層からでも `import ... from '@/components/...'` のように書けます。 |
| `.env.local.example` | 必要な環境変数（Supabase URL, Anon Key）を確認 |

### Step 2: データベース設計を理解する
アプリが扱うデータを「データベース」側でどう定義しているか確認します。
`supabase/` ディレクトリはアプリ本体とは独立した、DBの設計図置き場です。

| ファイル | 確認ポイント |
|---------|-------------|
| `supabase/schema.sql` | `posts` と `likes` テーブルの構造を確認 |
| `src/types/index.ts` | TypeScriptでの型定義を確認 |

### Step 3: バックエンド（API層）を読む
**`src/app/` の中には、フロントエンドだけでなくバックエンドも同居しています。**
`api/` ディレクトリ配下がバックエンドの役割（データの入出力）を担います。

| ファイル | 確認ポイント |
|---------|-------------|
| `src/lib/supabase.ts` | Supabaseクライアントの初期化方法 |
| `src/services/postService.ts` | **★重要** DB操作ロジック（CRUD）の実装 |
| `src/app/api/posts/route.ts` | GET (一覧取得), POST (投稿作成) |
| `src/app/api/posts/[id]/route.ts` | DELETE (削除) |
| `src/app/api/posts/[id]/like/route.ts` | POST (いいね追加) |

### Step 4: フロントエンド（UI層）を読む
ユーザーが操作する画面のコードです。`src/app/` 直下のファイルが担当します。

| ファイル | 確認ポイント |
|---------|-------------|
| `src/app/layout.tsx` | 全ページ共通のレイアウト（html, body） |
| `src/app/page.tsx` | **★重要** メインページ。State管理とAPI呼び出し |
| `src/components/PostForm.tsx` | 投稿フォームのUI。`fetch` でPOST送信 |
| `src/components/PostList.tsx` | 投稿一覧の表示。条件分岐とmap |
| `src/components/PostCard.tsx` | 個別投稿カード。いいね・削除ボタンの処理 |

---

## 🔍 コードを読むときのポイント

### 1. データの流れを追う
```
ユーザー操作 → Component (useState) → fetch API → postService → Supabase
```
この流れを意識しながら、各ファイルがどの役割を担っているか確認してください。

### 2. 型定義を先に見る
`src/types/index.ts` の `Post` 型を理解すると、他のコードが読みやすくなります。

### 3. Service Layer パターン
**最近のリファクタリング**で導入したパターンです：
- **API Route** (`route.ts`): HTTPリクエスト/レスポンスの処理のみ
- **Service** (`postService.ts`): ビジネスロジックとDB操作

これにより、APIルートがシンプルになり、ロジックが再利用しやすくなっています。

---

## 📂 ディレクトリ構造

`src/app/` の中にフロントエンドとバックエンドが混在している点に注目してください。

```
Projects/test_1/
├── src/
│   ├── app/                # フロントエンドとバックエンドが同居
│   │   ├── api/            # 🔵 Backend (APIエンドポイント)
│   │   │   └── posts/
│   │   │       └── ...
│   │   ├── layout.tsx      # 🟢 Frontend (共通レイアウト)
│   │   └── page.tsx        # 🟢 Frontend (メインページ)
│   ├── components/         # 🟢 Frontend (UIパーツ)
│   ├── lib/
│   └── services/           # 🔵 Backend (DB操作ロジック)
├── supabase/               # 🟡 Database (DB設計図)
│   └── schema.sql
└── types/                  # 型定義
```

---

## 📖 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [CodeWalkthrough.md](./CodeWalkthrough.md) | 詳細なコード解説とチェック項目 |
| [RDdoc.md](./RDdoc.md) | 要件定義書 |
| [Plan.md](./Plan.md) | 実装計画書 |

---

## 🚀 開発サーバーの起動

```bash
npm install       # 依存関係インストール
npm run dev       # 開発サーバー起動
```
アクセス: http://localhost:3000
