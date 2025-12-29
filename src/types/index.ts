// 投稿の型定義
export type Post = {
  id: number;
  content: string;
  created_at: string;
  like_count: number;
};

// APIレスポンス型
export type PostsResponse = {
  posts: Post[];
};

export type PostResponse = {
  post: Omit<Post, 'like_count'>;
};

export type LikeResponse = {
  message: string;
  like_count: number;
};

export type DeleteResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
