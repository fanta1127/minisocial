import { NextResponse } from 'next/server';
import { deletePost, updatePost } from '@/services/postService';

type Params = {
  params: Promise<{ id: string }>;
};

// DELETE /api/posts/[id] - 投稿削除
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);

    const result = await deletePost(postId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({ message: '投稿を削除しました' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: '投稿の削除に失敗しました' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - 投稿更新
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    const body = await request.json();

    const result = await updatePost(postId, body.content);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({ post: result.data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: '投稿の更新に失敗しました' },
      { status: 500 }
    );
  }
}
