"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Ensure we always have 4 images (repeat if needed)
  const displayImages = Array.from({ length: 4 }).map((_, index) => {
    return images[index % images.length] || images[0] || "";
  });

  const mainImage = displayImages[selectedImage] || displayImages[0];

  return (
    <div className="w-full space-y-3 md:space-y-4">
      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative aspect-square bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={mainImage}
              alt={`${productName} - View ${selectedImage + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Thumbnail Gallery - 4 horizontal thumbnails */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-4 gap-3"
      >
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square bg-white rounded-lg overflow-hidden transition-all border-2 ${
              selectedImage === index
                ? "border-[#BFC8B3] shadow-md"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <ImageWithFallback
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </motion.div>
    </div>
  );
}

