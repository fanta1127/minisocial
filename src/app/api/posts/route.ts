import { NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/services/postService';

// GET /api/posts - 投稿一覧取得
export async function GET() {
  try {
    const result = await getAllPosts();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({ posts: result.data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: '投稿の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/posts - 投稿作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createPost(body.content);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({ post: result.data }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: '投稿の作成に失敗しました' },
      { status: 500 }
    );
  }
}
