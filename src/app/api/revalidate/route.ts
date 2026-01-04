import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// API to trigger revalidation after article changes
export async function POST(request: NextRequest) {
  try {
    const { slug, action } = await request.json();

    // Revalidate specific article page
    if (slug) {
      revalidatePath(`/article/${slug}`);
    }

    // Revalidate homepage and category pages
    revalidatePath('/');
    revalidatePath('/trending');
    
    // If we know the category, revalidate that too
    const { category } = await request.json().catch(() => ({}));
    if (category) {
      revalidatePath(`/category/${category.toLowerCase()}`);
    }

    return NextResponse.json({ 
      revalidated: true, 
      message: `Revalidated paths for ${action || 'update'}`,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
