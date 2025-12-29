'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostForm from '@/components/PostForm';
import PostList from '@/components/PostList';
import type { Post, PostsResponse, ErrorResponse } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 投稿一覧を取得
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json() as PostsResponse | ErrorResponse;

      if (response.ok) {
        setPosts((data as PostsResponse).posts);
      } else {
        setError((data as ErrorResponse).error || '投稿の取得に失敗しました');
      }
    } catch {
      setError('投稿の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 新規投稿時のハンドラ
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // 削除時のハンドラ
  const handleDelete = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  // いいね時のハンドラ
  const handleLike = (id: number, newLikeCount: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, like_count: newLikeCount } : post
      )
    );
  };

  // 編集時のハンドラ
  const handleEdit = (id: number, newContent: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, content: newContent } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-500">MiniSocial</h1>
          <nav>
            <Link href="/about" className="text-gray-600 hover:text-blue-500">
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 投稿フォーム */}
        <PostForm onPostCreated={handlePostCreated} />

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* 投稿一覧 */}
        <PostList
          posts={posts}
          isLoading={isLoading}
          onDelete={handleDelete}
          onLike={handleLike}
          onEdit={handleEdit}
        />
      </main>
    </div>
  );
}
