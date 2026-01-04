"use client";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Check, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  benefits?: string[];
  status: string;
  sizes?: string[];
  is_bestseller?: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const businessSlug = process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie';
        const response = await fetch(`/api/products?businessSlug=${businessSlug}`);
        const data = await response.json();
        
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const defaultProducts: Product[] = [
    {
      id: "default-1",
      name: "Rosemary + Mint Hair Oil",
      price: 34.99,
      image_url: "https://images.unsplash.com/photo-1549049950-48d5887197a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlbWFyeSUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Stimulates scalp for healthier growth", "Cooling peppermint sensation", "100% natural botanical blend"],
      status: "active",
      sizes: ["30ml", "60ml", "100ml"],
    },
    {
      id: "default-2",
      name: "Rosemary Shampoo + Conditioner Set",
      price: 49.99,
      image_url: "https://images.unsplash.com/photo-1747858989102-cca0f4dc4a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFtcG9vJTIwYm90dGxlJTIwY2xlYW58ZW58MXx8fHwxNzYzNDk3OTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Gentle cleansing without sulfates", "Strengthens & adds shine", "Safe for color-treated hair"],
      status: "active",
      sizes: ["250ml", "500ml"],
    },
    {
      id: "default-3",
      name: "Biotin-Keratin Strengthening Duo",
      price: 59.99,
      image_url: "https://images.unsplash.com/photo-1739980213756-753aea153bb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWF1dHklMjBwcm9kdWN0JTIwbWFyYmxlfGVufDF8fHx8MTc2MzQ5NzkyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Repairs damaged strands", "Reduces breakage & split ends", "Long-lasting smoothness"],
      status: "active",
      sizes: ["30ml", "60ml"],
    },
  ];

  const allProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <Navigation />

      {/* Decorative botanical accent */}
      <motion.div
        initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
        animate={{ opacity: 0.05, rotate: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed top-20 right-10 pointer-events-none z-0"
      >
        <Leaf className="w-96 h-96 text-[#BFC8B3]" />
      </motion.div>

      {/* Spacer for fixed navigation */}
      <div className="h-20"></div>

      <div className="relative pt-12 pb-20 z-10">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of clean, botanical beauty products
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <ProductCardSkeleton count={6} variant="grid" />
            ) : (
              <>
                {allProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No products found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allProducts.map((product, index) => {
                      const isDisabled = product.status !== 'active';
                      const displayBenefits = product.benefits?.slice(0, 3) || [];
                      
                      return (
                        <motion.article
                          key={product.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ y: -8 }}
                          className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-[#BFC8B3]/30 transition-all duration-300 flex flex-col group"
                        >
                          {/* Product Image */}
                          <Link href={`/products/${product.id}`}>
                            <div className="relative w-full h-64 overflow-hidden bg-gray-50">
                              <ImageWithFallback
                                src={product.image_url || ""}
                                alt={product.name || "Product"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {product.is_bestseller && (
                                <div className="absolute top-4 right-4">
                                  <Badge className="bg-[#BFC8B3] text-white border-0 shadow-sm">
                                    Bestseller
                                  </Badge>
                                </div>
                              )}
                              {!product.is_bestseller && product.status === 'out of stock' && (
                                <div className="absolute top-4 right-4">
                                  <Badge className="bg-gray-500 text-white border-0 shadow-sm">
                                    Out of Stock
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Product Info */}
                          <div className="p-6 flex-1 flex flex-col">
                            {/* Title and Price */}
                            <Link href={`/products/${product.id}`}>
                              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#8B9A7F] transition-colors line-clamp-2 leading-tight">
                                {product.name || ""}
                              </h2>
                            </Link>
                            <p className="text-lg font-bold text-gray-900 mb-4">
                              ${product.price.toFixed(2)}
                            </p>
                            
                            {/* Benefits */}
                            {displayBenefits.length > 0 && (
                              <ul className="space-y-2 mb-5 flex-1">
                                {displayBenefits.slice(0, 2).map((benefit, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="w-4 h-4 text-[#8B9A7F] shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Shop Now Button */}
                            <Link href={`/products/${product.id}`}>
                              <Button
                                variant="ghost"
                                className="w-full justify-between group-hover:bg-[#BFC8B3]/10 text-gray-700 hover:text-[#8B9A7F] font-medium h-11 rounded-lg transition-all"
                                disabled={isDisabled}
                              >
                                {isDisabled ? "Unavailable" : "Shop Now"}
                                {!isDisabled && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />}
                              </Button>
                            </Link>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
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

              {/* Shop Links */}
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

              {/* About Links */}
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

              {/* Support Links */}
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
              transition={{ duration: 0.6, delay: 0.4 }}
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

