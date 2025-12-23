import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    const businessId = businesses.id;

    // Fetch product by ID for this business
    const { data: product, error: productError } = await supabaseAdmin
      .from('retail_products_table')
      .select('*')
      .eq('id', id)
      .eq('business_id', businessId)
      .single();

    if (productError || !product) {
      console.error('Error fetching product:', productError);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform product data
    const transformedProduct = {
      id: product.id,
      name: product.name,
      price: product.price ? parseFloat(String(product.price)) : 0,
      image_url: product.image_url || '',
      benefits: product.benefits && Array.isArray(product.benefits) 
        ? product.benefits 
        : [],
      status: product.status || 'active',
      description: product.description || '',
      ingredients: product.ingredients || [],
      how_to_use: product.how_to_use || '',
      rating: product.rating || 4.8,
      review_count: product.review_count || 0,
      sizes: product.sizes || ['30ml', '60ml', '100ml'],
      badges: product.badges || ['Vegan', 'Cruelty-Free', 'Made in Canada'],
      original_price: product.original_price ? parseFloat(String(product.original_price)) : null,
    };

    // Add cache headers for better performance
    const response = NextResponse.json({ product: transformedProduct });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

