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

    // Fetch product images from files_assets
    // Order by created_at ascending to match upload order
    const { data: productImages } = await supabaseAdmin
      .from('files_assets')
      .select('*')
      .eq('type', 'Images')
      .eq('product_id', id)
      .order('created_at', { ascending: true });

    // Transform images to include public URLs
    const imageUrls: string[] = []
    if (productImages && productImages.length > 0) {
      productImages.forEach((img) => {
        if (img.file_url) {
          // Convert storage path to public URL
          const { data: urlData } = supabaseAdmin.storage
            .from('gallery')
            .getPublicUrl(img.file_url)
          imageUrls.push(urlData.publicUrl)
        }
      })
    }

    // Get main image URL (from product.image_url)
    const mainImageUrl = product.image_url || ''
    
    // Remove duplicates from imageUrls first
    const uniqueImageUrls: string[] = []
    const seenUrls = new Set<string>()
    for (const url of imageUrls) {
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url)
        uniqueImageUrls.push(url)
      }
    }
    
    // If main image is set, ensure it's first (and remove any duplicate)
    let finalImageUrls = uniqueImageUrls
    if (mainImageUrl) {
      // Check if main image is already in the array (exact match)
      const mainImageIndex = uniqueImageUrls.findIndex(url => url === mainImageUrl || url.trim() === mainImageUrl.trim())
      if (mainImageIndex > 0) {
        // Move main image to first position, remove duplicate
        finalImageUrls = [mainImageUrl, ...uniqueImageUrls.filter((_, i) => i !== mainImageIndex)]
      } else if (mainImageIndex === -1) {
        // Main image not in array, add it first
        finalImageUrls = [mainImageUrl, ...uniqueImageUrls]
      } else {
        // Main image is already first (index 0), ensure it's exactly the mainImageUrl value
        finalImageUrls = [mainImageUrl, ...uniqueImageUrls.slice(1)]
      }
    }

    // Transform product data - use actual database values, no hardcoded defaults
    const transformedProduct = {
      id: product.id,
      name: product.name,
      price: product.price ? parseFloat(String(product.price)) : 0,
      image_url: mainImageUrl || (finalImageUrls.length > 0 ? finalImageUrls[0] : ''),
      images: finalImageUrls, // Add multiple images array in correct order
      benefits: product.benefits && Array.isArray(product.benefits) 
        ? product.benefits 
        : [],
      status: product.status || 'active',
      description: product.description || '',
      ingredients: product.ingredients && Array.isArray(product.ingredients)
        ? product.ingredients
        : [],
      how_to_use: product.how_to_use || '',
      rating: product.rating ? parseFloat(String(product.rating)) : null,
      review_count: product.review_count || 0,
      sizes: product.sizes && Array.isArray(product.sizes)
        ? product.sizes
        : [],
      badges: product.badges && Array.isArray(product.badges)
        ? product.badges
        : [],
      original_price: product.original_price ? parseFloat(String(product.original_price)) : null,
      is_bestseller: product.is_bestseller || false,
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

