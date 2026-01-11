"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Share2, Check, Leaf } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "@/contexts/CartContext";

interface ProductInfoProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount: number;
  description: string;
  sizes?: string[];
  badges?: string[];
  image_url: string;
}

export function ProductInfo({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  description,
  sizes = [],
  badges = [],
  image_url,
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? (sizes[1] || sizes[0]) : '');
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Add to cart with the selected quantity
    addToCart(
      {
        id,
        name,
        price,
        image_url,
      },
      quantity
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Badges */}
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2"
        >
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[#BFC8B3]/20 text-gray-900 hover:bg-[#BFC8B3]/30 border-0 text-xs md:text-sm"
            >
              {badge}
            </Badge>
          ))}
        </motion.div>
      )}

      {/* Product Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-2 font-semibold">{name}</h1>
        
        {/* Rating */}
        {rating !== undefined && rating !== null && (
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 md:w-4 md:h-4 ${
                    i < Math.floor(rating)
                      ? "fill-[#BFC8B3] text-[#BFC8B3]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs md:text-sm text-gray-600">
              {rating} ({reviewCount} reviews)
            </span>
          </div>
        )}
      </motion.div>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2 md:gap-3 flex-wrap"
      >
        {originalPrice && originalPrice > price ? (
          <>
            <span className="text-lg md:text-xl text-gray-400 line-through opacity-60">
              ${originalPrice.toFixed(2)} CAD
            </span>
            <span className="text-2xl md:text-3xl text-gray-900 font-semibold">
              ${price.toFixed(2)} CAD
            </span>
          </>
        ) : (
          <span className="text-2xl md:text-3xl text-gray-900 font-semibold">
            ${price.toFixed(2)} CAD
          </span>
        )}
      </motion.div>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm md:text-base text-gray-600 leading-relaxed"
        >
          {description}
        </motion.p>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-2 md:space-y-3"
        >
          <label className="block text-sm md:text-base text-gray-900 font-medium">Size</label>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-md border-2 transition-all text-sm md:text-base ${
                  selectedSize === size
                    ? "border-[#BFC8B3] bg-[#BFC8B3]/10 text-gray-900 font-medium"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quantity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="space-y-2 md:space-y-3"
      >
        <label className="block text-sm md:text-base text-gray-900 font-medium">Quantity</label>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-9 md:w-14 md:h-10 rounded-md border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors flex items-center justify-center text-lg md:text-xl"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 md:w-12 text-center text-gray-900 font-medium text-sm md:text-base">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-9 md:w-14 md:h-10 rounded-md border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors flex items-center justify-center text-lg md:text-xl"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex gap-2 md:gap-3 pt-2"
      >
        <Button
          onClick={handleAddToCart}
          className="flex-1 h-11 md:h-12 bg-[#BFC8B3] hover:bg-[#A8B19D] text-white text-sm md:text-base"
        >
          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Add to Cart
        </Button>
        <Button
          onClick={() => setIsFavorited(!isFavorited)}
          variant="outline"
          className={`h-11 md:h-12 w-11 md:w-12 ${
            isFavorited
              ? "bg-[#BFC8B3]/10 border-[#BFC8B3] text-[#BFC8B3]"
              : "border-gray-300"
          }`}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 ${isFavorited ? "fill-[#BFC8B3]" : ""}`}
          />
        </Button>
        <Button variant="outline" className="h-11 md:h-12 w-11 md:w-12 border-gray-300" aria-label="Share product">
          <Share2 className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="pt-4 md:pt-6 border-t border-gray-200 space-y-2 md:space-y-3"
      >
        <div className="flex items-start gap-2 md:gap-3">
          <div className="w-5 h-5 bg-[#BFC8B3]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-[#BFC8B3]" />
          </div>
          <div>
            <h4 className="text-sm md:text-base text-gray-900 font-medium">100% Natural Ingredients</h4>
            <p className="text-xs md:text-sm text-gray-600">
              Pure botanical extracts with no harsh chemicals
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 md:gap-3">
          <div className="w-5 h-5 bg-[#BFC8B3]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-[#BFC8B3]" />
          </div>
          <div>
            <h4 className="text-sm md:text-base text-gray-900 font-medium">Dermatologist Tested</h4>
            <p className="text-xs md:text-sm text-gray-600">
              Safe for all hair types including sensitive scalps
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 md:gap-3">
          <div className="w-5 h-5 bg-[#BFC8B3]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Leaf className="w-3 h-3 text-[#BFC8B3]" />
          </div>
          <div>
            <h4 className="text-sm md:text-base text-gray-900 font-medium">Eco-Friendly Packaging</h4>
            <p className="text-xs md:text-sm text-gray-600">
              Recyclable glass bottle with sustainable materials
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

