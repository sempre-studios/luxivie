"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image_url: string;
  badge?: string;
}

interface RelatedProductsProps {
  currentProductId?: string;
  limit?: number;
}

const defaultRelatedProducts: Product[] = [
  {
    id: "default-related-1",
    name: "Rosemary Mint Shampoo",
    price: 28.99,
    originalPrice: 34.99,
    rating: 4.7,
    reviewCount: 156,
    image_url: "https://images.unsplash.com/photo-1608623676098-c52439068319?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFtcG9vJTIwY29uZGl0aW9uZXIlMjBzZXR8ZW58MXx8fHwxNzY1Njk0OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Best Seller",
  },
  {
    id: "default-related-2",
    name: "Strengthening Conditioner",
    price: 26.99,
    rating: 4.8,
    reviewCount: 142,
    image_url: "https://images.unsplash.com/photo-1762815716180-1d3a167828f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGFpciUyMGNhcmUlMjBwcm9kdWN0fGVufDF8fHx8MTc2NTY5NDkwOHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "default-related-3",
    name: "Hair Growth Serum",
    price: 42.99,
    rating: 4.9,
    reviewCount: 98,
    image_url: "https://images.unsplash.com/photo-1763812770943-0b76492a38f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwYmVhdXR5JTIwc2VydW18ZW58MXx8fHwxNzY1Njk0OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "New",
  },
  {
    id: "default-related-4",
    name: "Complete Hair Care Set",
    price: 79.99,
    originalPrice: 94.97,
    rating: 5.0,
    reviewCount: 234,
    image_url: "https://images.unsplash.com/photo-1763027076863-698a6a72c164?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBza2luY2FyZSUyMGluZ3JlZGllbnRzfGVufDF8fHx8MTc2NTY5NDkwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Save 15%",
  },
];

export function RelatedProducts({ currentProductId, limit = 4 }: RelatedProductsProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  // For now, use default products. In the future, this could fetch related products from API
  const products = defaultRelatedProducts.slice(0, limit);

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12 md:mt-20 pt-12 md:pt-16 border-t border-gray-200"
    >
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl text-gray-900 mb-2">You May Also Like</h2>
        <p className="text-sm md:text-base text-gray-600">
          Complete your hair care routine with these complementary products
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group cursor-pointer"
            onClick={() => handleProductClick(product.id)}
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#BFC8B3] text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm">
                  {product.badge}
                </div>
              )}
              {/* Quick Add Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  className="bg-white text-gray-900 hover:bg-gray-100 text-xs md:text-sm px-3 md:px-4"
                  onClick={(e) => handleQuickAdd(e, product)}
                >
                  <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Quick Add</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4">
              <h3 className="text-sm md:text-base text-gray-900 mb-1 md:mb-2 line-clamp-2 font-medium">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                <div className="flex items-center gap-0.5 md:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                        i < Math.floor(product.rating)
                          ? "fill-[#BFC8B3] text-[#BFC8B3]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({product.reviewCount})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                <span className="text-base md:text-lg text-gray-900 font-medium">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs md:text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

