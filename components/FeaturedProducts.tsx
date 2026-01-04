"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  benefits?: string[];
  status: string;
  is_bestseller?: boolean;
}

interface FeaturedProductsProps {
  content?: {
    title?: string;
    subtitle?: string;
    products?: Array<{
      name?: string;
      image?: string;
      benefits?: string[];
      badge?: string | null;
    }>;
  };
}

export function FeaturedProducts({ content }: FeaturedProductsProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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

  const defaultProducts = [
    {
      id: "default-1",
      name: "Rosemary + Mint Hair Oil",
      price: 34.99,
      image_url: "https://images.unsplash.com/photo-1549049950-48d5887197a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlbWFyeSUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Stimulates scalp for healthier growth", "Cooling peppermint sensation", "100% natural botanical blend"],
      status: "active",
    },
    {
      id: "default-2",
      name: "Rosemary Shampoo + Conditioner Set",
      price: 49.99,
      image_url: "https://images.unsplash.com/photo-1747858989102-cca0f4dc4a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFtcG9vJTIwYm90dGxlJTIwY2xlYW58ZW58MXx8fHwxNzYzNDk3OTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Gentle cleansing without sulfates", "Strengthens & adds shine", "Safe for color-treated hair"],
      status: "active",
    },
    {
      id: "default-3",
      name: "Biotin-Keratin Strengthening Duo",
      price: 59.99,
      image_url: "https://images.unsplash.com/photo-1739980213756-753aea153bb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWF1dHklMjBwcm9kdWN0JTIwbWFyYmxlfGVufDF8fHx8MTc2MzQ5NzkyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Repairs damaged strands", "Reduces breakage & split ends", "Long-lasting smoothness"],
      status: "closed for sale",
    },
  ];

  // Use API products if available, otherwise use content products, otherwise default
  // Limit to 6 products maximum
  const allProducts = products.length > 0 
    ? products 
    : (content?.products?.map((p, idx) => ({
        id: `content-${idx}`,
        name: p.name || "",
        price: 0,
        image_url: p.image || "",
        benefits: p.benefits || [],
        status: p.badge === "Coming Soon" ? "closed for sale" : "active",
        is_bestseller: false,
      })) || defaultProducts.map(p => ({ ...p, is_bestseller: false })));
  
  // Limit to 6 products
  const displayProducts = allProducts.slice(0, 6);

  const title = content?.title || "Luxivie Bestsellers";
  const subtitle = content?.subtitle || "Our most-loved formulas for healthier, stronger hair";

  const handleShopNow = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <section id="products" ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div data-section-component-key="title">
              <h2 className="text-4xl lg:text-5xl text-gray-900 mb-4">
                {title}
              </h2>
            </div>
            <div data-section-component-key="subtitle">
              <p className="text-xl text-gray-600">
                {subtitle}
              </p>
            </div>
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <ProductCardSkeleton count={3} variant="featured" />
          ) : (
            <div data-section-component-key="products" className="grid md:grid-cols-3 gap-8">
              {displayProducts.map((product, index) => {
                const isDisabled = product.status !== 'active';
                const displayBenefits = product.benefits?.slice(0, 3) || [];
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={!isDisabled ? { y: -10 } : {}}
                    className="group bg-[#F9F9F6] rounded-3xl overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={product.image_url || ""}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
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
                      <h3 className="text-gray-900">{product.name || ""}</h3>
                      
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
                        onClick={() => !isDisabled && handleShopNow(product)}
                      >
                        {isDisabled ? "Unavailable" : "Shop Now"}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* See All Products Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12 pt-8 pb-4"
          >
            <Link 
              href="/products"
              data-slot="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background text-foreground hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 has-[>svg]:px-3 border-2 border-gray-300 hover:border-[#BFC8B3] hover:bg-white px-8 py-6 rounded-full cursor-pointer"
            >
              See all products
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}