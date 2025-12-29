'use client';

import { useState } from 'react';
import type { Post } from '@/types';

type Props = {
  onPostCreated: (post: Post) => void;
};

export default function PostForm({ onPostCreated }: Props) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 280;
  const isOverLimit = content.length > maxLength;
  const isEmpty = content.trim() === '';
  const isDisabled = isEmpty || isOverLimit || isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isEmpty) {
      setError('投稿内容を入力してください');
      return;
    }

    if (isOverLimit) {
      setError(`投稿は${maxLength}文字以内で入力してください（現在: ${content.length}文字）`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '投稿に失敗しました');
        return;
      }

      // 新しい投稿を親コンポーネントに通知
      onPostCreated({
        ...data.post,
        like_count: 0,
      });
      setContent('');
    } catch {
      setError('投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今何してる？"
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className={content.length > maxLength ? 'text-red-500' : 'text-gray-500'}>
            {content.length} / {maxLength}
          </span>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </form>
  );
}
