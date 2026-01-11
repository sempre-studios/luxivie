import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessSlug = searchParams.get('businessSlug') || process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie';

    // Get business by slug
    const { data: businesses, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('slug', businessSlug)
      .limit(1)
      .single();

    if (businessError || !businesses) {
      console.error('Error fetching business:', businessError);
      return NextResponse.json({ blogs: [] }, { status: 200 });
    }

    const businessId = businesses.id;

    // Fetch published blogs for this business
    const { data: blogs, error: blogsError } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (blogsError) {
      console.error('Error fetching blogs:', blogsError);
      return NextResponse.json({ blogs: [] }, { status: 200 });
    }

    // Transform to BlogPost format
    const transformedBlogs = (blogs || []).map((blog) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || undefined,
      content: blog.content,
      image_url: blog.image_url || undefined,
      author: blog.author || undefined,
      publishedAt: blog.published_at || blog.created_at,
      readTime: blog.read_time || undefined,
      category: blog.category || undefined,
      tags: blog.tags && Array.isArray(blog.tags) ? blog.tags : undefined,
      updatedAt: blog.updated_at, // Include updated_at for comparison
    }));

    // Add cache headers for better performance (but allow revalidation)
    return NextResponse.json(
      { blogs: transformedBlogs },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error in GET /api/blogs:', error);
    return NextResponse.json({ blogs: [] }, { status: 200 });
  }
}

