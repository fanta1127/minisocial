-- MiniSocial データベーススキーマ
-- Supabaseダッシュボードの SQL Editor で実行してください

-- postsテーブル
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 一覧取得高速化のためのインデックス
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- likesテーブル
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- JOIN高速化のためのインデックス
CREATE INDEX idx_likes_post_id ON likes(post_id);

-- サンプルデータ（オプション）
INSERT INTO posts (content) VALUES
('Hello World! これが最初の投稿です。'),
('今日は良い天気ですね！'),
('Web開発の勉強を頑張っています');

-- サンプルいいね（オプション）
INSERT INTO likes (post_id) VALUES (1), (1), (1), (2);
