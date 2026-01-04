import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 });
    }

    // First get the article slug for revalidation
    const { data: article } = await supabaseAdmin
      .from('articles')
      .select('slug, category')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate cached pages after deletion
    if (article?.slug) {
      revalidatePath(`/article/${article.slug}`);
    }
    revalidatePath('/');
    revalidatePath('/trending');
    if (article?.category) {
      revalidatePath(`/category/${article.category.toLowerCase()}`);
    }

    return NextResponse.json({ success: true, revalidated: true });
  } catch (err) {
    console.error('Delete exception:', err);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}

// Toggle publish status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // First get the article slug for revalidation
    const { data: article } = await supabaseAdmin
      .from('articles')
      .select('slug, category')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('articles')
      .update({ is_published: body.is_published })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate cached pages after status change
    if (article?.slug) {
      revalidatePath(`/article/${article.slug}`);
    }
    revalidatePath('/');
    revalidatePath('/trending');
    if (article?.category) {
      revalidatePath(`/category/${article.category.toLowerCase()}`);
    }

    return NextResponse.json({ success: true, revalidated: true });
  } catch (err) {
    console.error('Update exception:', err);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}
