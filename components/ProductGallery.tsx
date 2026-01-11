"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Use images directly, no repeating - show what we have (up to 4)
  const displayImages = images.slice(0, 4).filter(img => img && img.trim() !== "");
  
  // Always default to first image (main image) - reset when images change
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Create a stable string representation of images for dependency checking
  const imagesKey = images.join(',');
  
  useEffect(() => {
    // Reset to first image (main image) whenever images array changes
    // This ensures the main image (index 0) is always shown by default
    setSelectedImage(0);
  }, [imagesKey]); // Use stable string key to detect array changes

  // Main image is always the first image (index 0) - this is the image set as "main" in CMS
  const mainImage = displayImages[0] || "";
  
  // Currently selected image for display
  const currentImage = displayImages[selectedImage] || mainImage;

  return (
    <div className="w-full space-y-3 md:space-y-4">
      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-lg"
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
              src={currentImage}
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
            className={`relative aspect-square bg-white rounded-3xl overflow-hidden transition-all border-2 ${
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

