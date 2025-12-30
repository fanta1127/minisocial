'use client';

import { useState } from 'react';
import type { Post } from '@/types';

type Props = {
  post: Post;
  onDelete: (id: number) => void;
  onLike: (id: number, newLikeCount: number) => void;
  onEdit: (id: number, newContent: string) => void;
};

export default function PostCard({ post, onDelete, onLike, onEdit }: Props) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  // 編集モード用のState
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const maxLength = 280;

  // 日時フォーマット
  const formatDate = (dateString: string) => {
    // SupabaseはUTCでタイムスタンプを保存するため、Zを追加してUTCとして解析
    const utcDateString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        onLike(post.id, data.like_count);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('いいねに失敗しました:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm('この投稿を削除しますか？');
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(post.id);
      }
    } catch (error) {
      console.error('削除に失敗しました:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 編集モードに入る
  const handleStartEdit = () => {
    setEditContent(post.content);
    setEditError('');
    setIsEditing(true);
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditContent(post.content);
    setEditError('');
    setIsEditing(false);
  };

  // 編集を保存
  const handleSaveEdit = async () => {
    if (isSaving) return;

    const trimmed = editContent.trim();
    if (trimmed === '') {
      setEditError('投稿内容を入力してください');
      return;
    }
    if (trimmed.length > maxLength) {
      setEditError(`投稿は${maxLength}文字以内で入力してください`);
      return;
    }

    setIsSaving(true);
    setEditError('');

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: trimmed }),
      });

      const data = await response.json();

      if (response.ok) {
        onEdit(post.id, data.post.content);
        setIsEditing(false);
      } else {
        setEditError(data.error || '更新に失敗しました');
      }
    } catch (error) {
      console.error('更新に失敗しました:', error);
      setEditError('更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* 編集モード */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            disabled={isSaving}
          />
          <div className="flex items-center justify-between mt-2">
            <span className={editContent.length > maxLength ? 'text-red-500 text-sm' : 'text-gray-500 text-sm'}>
              {editContent.length} / {maxLength}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving || editContent.trim() === '' || editContent.length > maxLength}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
          {editError && (
            <p className="mt-2 text-sm text-red-500">{editError}</p>
          )}
        </div>
      ) : (
        /* 通常表示 */
        <p className="mb-3 text-gray-800 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      )}

      {/* 投稿日時 */}
      <p className="mb-3 text-sm text-gray-500">
        {formatDate(post.created_at)}
      </p>

      {/* アクションボタン */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* いいねボタン */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500 disabled:opacity-50 transition-colors"
          >
            <span className="text-xl">{hasLiked ? '❤️' : '♡'}</span>
            <span className="text-sm">{post.like_count} いいね</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* 編集ボタン (編集モード中は非表示) */}
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <span>✏️</span>
              <span className="text-sm">編集</span>
            </button>
          )}

          {/* 削除ボタン */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
          >
            <span>🗑️</span>
            <span className="text-sm">{isDeleting ? '削除中...' : '削除'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
