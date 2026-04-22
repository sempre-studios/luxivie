"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Check, Leaf } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
      {/* Decorative botanical accent */}
      <motion.div
        initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
        animate={{ opacity: 0.05, rotate: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed top-20 right-10 pointer-events-none z-0"
      >
        <Leaf className="w-96 h-96 text-[#BFC8B3]" />
      </motion.div>

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
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={!isDisabled ? { y: -10 } : {}}
                          className="group bg-[#F9F9F6] rounded-3xl overflow-hidden hover:shadow-xl transition-all"
                        >
                          {/* Product Image */}
                          <div className="relative aspect-square overflow-hidden">
                            <Link href={`/products/${product.id}`}>
                              <ImageWithFallback
                                src={product.image_url || ""}
                                alt={product.name || "Product"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </Link>
                            {product.is_bestseller && (
                              <Badge 
                                className="absolute top-4 right-4 bg-[#BFC8B3] text-white border-0"
                              >
                                Bestseller
                              </Badge>
                            )}
                            {product.status === 'out of stock' && (
                              <Badge 
                                className={`absolute ${product.is_bestseller ? 'top-16' : 'top-4'} right-4 bg-gray-500 text-white border-0`}
                              >
                                Out of Stock
                              </Badge>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-6 space-y-4">
                            <Link href={`/products/${product.id}`}>
                              <h3 className="text-gray-900">{product.name || ""}</h3>
                            </Link>
                            
                            {displayBenefits.length > 0 && (
                              <ul className="space-y-2">
                                {displayBenefits.map((benefit, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="w-4 h-4 text-[#8B9A7F] shrink-0 mt-0.5" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <Button 
                              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full"
                              disabled={isDisabled}
                              onClick={() => !isDisabled && router.push(`/products/${product.id}`)}
                            >
                              {isDisabled ? "Unavailable" : "Shop Now"}
                            </Button>
                          </div>
                        </motion.div>
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
      <footer className="mt-24 border-t border-gray-200 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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

              {/* Navigation Links - Matching Navbar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-gray-900 mb-4">Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/" className="hover:text-[#8B9A7F] transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-[#8B9A7F] transition-colors">
                      Blog
                    </Link>
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

