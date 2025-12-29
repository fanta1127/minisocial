import { NextResponse } from 'next/server';
import { likePost } from '@/services/postService';

type Params = {
  params: Promise<{ id: string }>;
};

// POST /api/posts/[id]/like - いいね追加
export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);

    const result = await likePost(postId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(
      { message: 'いいねしました', like_count: result.like_count },
      { status: 201 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'いいねの追加に失敗しました' },
      { status: 500 }
    );
  }
}
