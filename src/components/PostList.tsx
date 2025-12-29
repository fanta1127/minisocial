'use client';

import type { Post } from '@/types';
import PostCard from './PostCard';

type Props = {
  posts: Post[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onLike: (id: number, newLikeCount: number) => void;
  onEdit: (id: number, newContent: string) => void;
};

export default function PostList({ posts, isLoading, onDelete, onLike, onEdit }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">
          まだ投稿がありません。最初の投稿をしてみましょう！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDelete}
          onLike={onLike}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

