import { supabase } from '@/lib/supabase';

// --- Types ---
export type PostData = {
    id: number;
    content: string;
    created_at: string;
    like_count: number;
};

export type CreatePostResult =
    | { success: true; data: Omit<PostData, 'like_count'> }
    | { success: false; error: string; status: number };

export type GetAllPostsResult =
    | { success: true; data: PostData[] }
    | { success: false; error: string; status: number };

export type DeletePostResult =
    | { success: true }
    | { success: false; error: string; status: number };

export type LikePostResult =
    | { success: true; like_count: number }
    | { success: false; error: string; status: number };

export type UpdatePostResult =
    | { success: true; data: Omit<PostData, 'like_count'> }
    | { success: false; error: string; status: number };

// --- Service Functions ---

/**
 * 全ての投稿を取得する (いいね数含む)
 */
export async function getAllPosts(): Promise<GetAllPostsResult> {
    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
      id,
      content,
      created_at,
      likes(count)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Database error (getAllPosts):', error);
        return { success: false, error: '投稿の取得に失敗しました', status: 500 };
    }

    const formattedPosts: PostData[] = posts.map((post) => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        like_count: post.likes[0]?.count ?? 0,
    }));

    return { success: true, data: formattedPosts };
}

/**
 * 新しい投稿を作成する
 */
export async function createPost(content: string): Promise<CreatePostResult> {
    // バリデーション
    if (content === undefined || content === null) {
        return { success: false, error: '投稿内容が必要です', status: 400 };
    }
    if (typeof content !== 'string') {
        return { success: false, error: '投稿内容は文字列である必要があります', status: 400 };
    }

    const trimmedContent = content.trim();
    if (trimmedContent === '') {
        return { success: false, error: '投稿内容を入力してください', status: 400 };
    }
    if (trimmedContent.length > 280) {
        return { success: false, error: '投稿は280文字以内で入力してください', status: 400 };
    }

    const { data: post, error } = await supabase
        .from('posts')
        .insert({ content: trimmedContent })
        .select('id, content, created_at')
        .single();

    if (error) {
        console.error('Database error (createPost):', error);
        return { success: false, error: '投稿の作成に失敗しました', status: 500 };
    }

    return { success: true, data: post };
}

/**
 * 投稿を削除する
 */
export async function deletePost(postId: number): Promise<DeletePostResult> {
    if (isNaN(postId) || postId < 1) {
        return { success: false, error: '無効な投稿IDです', status: 400 };
    }

    const { data, error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .select('id')
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return { success: false, error: '投稿が見つかりません', status: 404 };
        }
        console.error('Database error (deletePost):', error);
        return { success: false, error: '投稿の削除に失敗しました', status: 500 };
    }

    if (!data) {
        return { success: false, error: '投稿が見つかりません', status: 404 };
    }

    return { success: true };
}

/**
 * 投稿に「いいね」を追加する
 */
export async function likePost(postId: number): Promise<LikePostResult> {
    if (isNaN(postId) || postId < 1) {
        return { success: false, error: '無効な投稿IDです', status: 400 };
    }

    // 投稿の存在確認
    const { data: post, error: postError } = await supabase
        .from('posts')
        .select('id')
        .eq('id', postId)
        .single();

    if (postError || !post) {
        return { success: false, error: '投稿が見つかりません', status: 404 };
    }

    // いいねを追加
    const { error: likeError } = await supabase
        .from('likes')
        .insert({ post_id: postId });

    if (likeError) {
        console.error('Database error (likePost - insert):', likeError);
        return { success: false, error: 'いいねの追加に失敗しました', status: 500 };
    }

    // 更新後のいいね数を取得
    const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

    if (countError) {
        console.error('Database error (likePost - count):', countError);
        return { success: false, error: 'いいねの追加に失敗しました', status: 500 };
    }

    return { success: true, like_count: count ?? 0 };
}

/**
 * 投稿を更新する
 */
export async function updatePost(postId: number, content: string): Promise<UpdatePostResult> {
    // ID バリデーション
    if (isNaN(postId) || postId < 1) {
        return { success: false, error: '無効な投稿IDです', status: 400 };
    }

    // コンテンツ バリデーション
    if (content === undefined || content === null) {
        return { success: false, error: '投稿内容が必要です', status: 400 };
    }
    if (typeof content !== 'string') {
        return { success: false, error: '投稿内容は文字列である必要があります', status: 400 };
    }

    const trimmedContent = content.trim();
    if (trimmedContent === '') {
        return { success: false, error: '投稿内容を入力してください', status: 400 };
    }
    if (trimmedContent.length > 280) {
        return { success: false, error: '投稿は280文字以内で入力してください', status: 400 };
    }

    // UPDATE クエリの実行
    const { data: post, error } = await supabase
        .from('posts')
        .update({ content: trimmedContent })
        .eq('id', postId)
        .select('id, content, created_at')
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return { success: false, error: '投稿が見つかりません', status: 404 };
        }
        console.error('Database error (updatePost):', error);
        return { success: false, error: '投稿の更新に失敗しました', status: 500 };
    }

    if (!post) {
        return { success: false, error: '投稿が見つかりません', status: 404 };
    }

    return { success: true, data: post };
}

