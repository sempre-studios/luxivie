"use client";

import { Navigation } from "@/components/Navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetailSkeleton } from "@/components/ProductDetailSkeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  images?: string[]; // Multiple product images
  benefits?: string[];
  status: string;
  description?: string;
  ingredients?: string[];
  how_to_use?: string;
  rating?: number;
  review_count?: number;
  sizes?: string[];
  badges?: string[];
  is_bestseller?: boolean;
}

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id);
    });
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const businessSlug = process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie';
        const response = await fetch(`/api/products/${productId}?businessSlug=${businessSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to load product');
          }
          return;
        }

        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Get product images - API already ensures main image is first in images array
  const getProductImages = (): string[] => {
    const allImages = product?.images || []
    
    // Remove duplicates while preserving order
    const uniqueImages: string[] = []
    const seen = new Set<string>()
    for (const img of allImages) {
      if (img && !seen.has(img)) {
        seen.add(img)
        uniqueImages.push(img)
      }
    }
    
    // Return up to 4 unique images (no repeating)
    return uniqueImages.slice(0, 4)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F6]">
        <Navigation />
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F9F9F6]">
        <Navigation />
        <div className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">{error || 'Product not found'}</p>
              <Link
                href="/products"
                className="text-[#BFC8B3] hover:text-[#A8B19D] transition-colors"
              >
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productImages = getProductImages();

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <Navigation />

      {/* Spacer for fixed navigation */}
      <div className="h-20"></div>

      {/* Main Product Container */}
      <div className="pt-12 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-6 md:mb-8 flex-wrap"
          >
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900 transition-colors">
              Hair Care
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </motion.div>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
            {/* Left Column - Gallery */}
            <div className="w-full">
              <ProductGallery
                images={productImages}
                productName={product.name}
              />
            </div>

            {/* Right Column - Product Info */}
            <div className="w-full">
              <ProductInfo
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price}
                rating={product.rating || undefined}
                reviewCount={product.review_count || 0}
                description={product.description || ''}
                sizes={product.sizes}
                badges={product.badges}
                image_url={product.image_url}
              />
            </div>
          </div>

          {/* Product Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 md:mt-16"
          >
            <style dangerouslySetInnerHTML={{__html: `
              [data-slot="tabs-trigger"][data-state="active"] {
                border-bottom: 4px solid #BFC8B3 !important;
                color: #111827 !important;
                font-weight: 700 !important;
              }
              [data-slot="tabs-trigger"][data-state="inactive"] {
                color: #6b7280 !important;
                font-weight: 400 !important;
                border-bottom: 4px solid transparent !important;
              }
            `}} />
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full h-auto p-0 bg-white border-b-2 border-gray-200 rounded-none justify-start">
                <TabsTrigger
                  value="description"
                  className="relative px-6 py-6 md:py-7 rounded-none border-0 bg-transparent text-sm md:text-base transition-all duration-300 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-0"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="ingredients"
                  className="relative px-6 py-6 md:py-7 rounded-none border-0 bg-transparent text-sm md:text-base transition-all duration-300 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-0"
                >
                  Ingredients
                </TabsTrigger>
                <TabsTrigger
                  value="howto"
                  className="relative px-6 py-6 md:py-7 rounded-none border-0 bg-transparent text-sm md:text-base transition-all duration-300 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-0"
                >
                  How to Use
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-6 md:pt-8">
                <div className="space-y-6 md:space-y-8">
                  {/* Main Heading */}
              <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 font-semibold mb-4 md:mb-6">
                      {product.name}
                    </h2>
                    
                    {/* Introductory Paragraph */}
                    {product.description && (
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
                        {product.description.split('\n\n')[0] || product.description}
                      </p>
                    )}
              </div>

                  {/* Key Benefits Section */}
                  {product.benefits && product.benefits.length > 0 && (
                    <div className="space-y-4 md:space-y-5">
                      <h3 className="text-xl md:text-2xl text-gray-900 font-semibold">Key Benefits</h3>
                      <div className="space-y-4 md:space-y-5">
                        {product.benefits.map((benefit, index) => {
                          const parts = benefit.split(':');
                          const title = parts[0]?.trim() || `Benefit ${index + 1}`;
                          const description = parts[1]?.trim() || '';
                          
                          return (
                            <div key={index} className="space-y-1 md:space-y-2">
                              <h4 className="text-base md:text-lg text-gray-900 font-semibold">
                                {title}
                              </h4>
                              {description && (
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                  {description}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

          {/* Why Choose Luxivie Section */}
                  <div className="space-y-4 md:space-y-5 pt-4 md:pt-6 border-t border-gray-200">
                    <h3 className="text-xl md:text-2xl text-gray-900 font-semibold">Why Choose Luxivie?</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      Unlike many products on the market, our formula contains only the highest quality, cold-pressed ingredients. We never use synthetic fragrances, parabens, sulfates, or any harsh chemicals. Every bottle is carefully crafted in Canada with sustainably sourced botanicals, ensuring you get the purest, most effective product possible.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="pt-6 md:pt-8">
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h3 className="text-xl md:text-2xl text-gray-900 font-semibold mb-2 md:mb-3">Full Ingredient List</h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Carefully selected natural ingredients for optimal results
              </p>
            </div>

                  {product.ingredients && product.ingredients.length > 0 ? (
                    <div className="space-y-4 md:space-y-5">
                      {product.ingredients.map((ingredient, index) => (
                        <div 
                          key={index}
                          className="space-y-1 md:space-y-2 pb-4 md:pb-5 border-b border-gray-200 last:border-0 last:pb-0"
                        >
                          <h4 className="text-base md:text-lg text-gray-900 font-semibold">
                            {ingredient}
                          </h4>
                        </div>
                      ))}
                </div>
                  ) : (
                    <div className="py-4 md:py-6">
                      <p className="text-sm md:text-base text-gray-600">
                        Ingredients information will be available soon.
                </p>
              </div>
                  )}
                  
                  <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-200">
                    <div className="bg-[#BFC8B3]/10 rounded-lg p-4 md:p-5">
                      <p className="text-sm md:text-base text-gray-700 font-semibold mb-2">
                        Free from:
                      </p>
                      <p className="text-sm md:text-base text-gray-600">
                        Parabens, Sulfates, Phthalates, Synthetic Fragrances, Mineral Oil, Silicones, Formaldehyde
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="howto" className="pt-6 md:pt-8">
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h3 className="text-xl md:text-2xl text-gray-900 font-semibold mb-2 md:mb-3">Application Instructions</h3>
              </div>

                  <div className="space-y-5 md:space-y-6">
                    {product.how_to_use ? (
                      <div className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                        <p className="text-gray-600">{product.how_to_use}</p>
                      </div>
                    ) : (
                      <div className="py-4 md:py-6">
                        <p className="text-sm md:text-base text-gray-600">
                          Usage instructions will be available soon.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 md:pt-6 border-t border-gray-200">
                    <div className="bg-[#BFC8B3]/10 rounded-lg p-4 md:p-5">
                      <p className="text-sm md:text-base text-gray-700 font-semibold mb-2">
                        Pro Tips:
                      </p>
                      <ul className="space-y-2 text-sm md:text-base text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-[#BFC8B3] mt-1">•</span>
                          <span>Use 2-3 times per week for best results. Consistent use shows visible improvement in 4-6 weeks.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#BFC8B3] mt-1">•</span>
                          <span>Can also be applied to hair ends to prevent split ends and add shine.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#BFC8B3] mt-1">•</span>
                          <span>Store in a cool, dark place to maintain oil potency. The dark glass bottle helps preserve freshness.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 pt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-[#BFC8B3]" />
                  <span className="text-xl text-gray-900">LUXIVIE</span>
                </div>
                <p className="text-sm text-gray-600">
                  Clean beauty crafted with care in Canada
                </p>
              </motion.div>

              {/* Shop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-gray-900 mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Hair Care
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Bestsellers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Gift Sets
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      New Arrivals
                    </a>
                  </li>
                </ul>
              </motion.div>

              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-gray-900 mb-4">About</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Our Story
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Ingredients
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Sustainability
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Reviews
                    </a>
                  </li>
                </ul>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Shipping
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Returns
                    </a>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="border-t border-gray-200 pt-8 pb-4 text-center text-sm text-gray-600"
            >
              <p>© 2025 Luxivie. All rights reserved. Made with care in Canada. 🍁</p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}

