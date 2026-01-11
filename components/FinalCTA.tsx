"use client";

import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Leaf, ArrowRight, Package, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

interface FinalCTAProps {
  content?: {
    title?: string;
    subtitle?: string;
    primaryCta?: {
      label?: string;
      href?: string;
    };
    accentImage?: string;
    trustBadges?: Array<{
      icon?: string;
      text?: string;
    }>;
  };
}

// Icon mapping
const iconMap: Record<string, typeof Package> = {
  Package,
  Shield,
};

export function FinalCTA({ content }: FinalCTAProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  const title = content?.title || "Ready for stronger, healthier hair?";
  const subtitle = content?.subtitle || "Join thousands of Canadians who've discovered the power of clean, botanical beauty";
  const primaryCta = content?.primaryCta || { label: "Shop Luxivie Now", href: "#products" };
  const accentImage = content?.accentImage || "https://images.unsplash.com/photo-1763154045793-4be5374b3e70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldWNhbHlwdHVzJTIwbGVhdmVzJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const defaultTrustBadges = [
    { icon: Package, text: "Fast shipping across Canada" },
    { icon: Shield, text: "Trusted by 10,000+ customers" },
  ];
  const trustBadges = content?.trustBadges?.map(badge => ({
    icon: badge.icon ? (iconMap[badge.icon] || Package) : Package,
    text: badge.text || "",
  })) || defaultTrustBadges;

  return (
    <section ref={ref} className="py-32 bg-gradient-to-b from-white to-[#F9F9F6] relative overflow-hidden">
      {/* Decorative botanical accent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
        animate={isInView ? { opacity: 0.05, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -90 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Leaf className="w-[600px] h-[600px] text-[#BFC8B3]" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Eucalyptus accent image */}
          <div data-section-component-key="accentImage">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl">
                <ImageWithFallback
                  src={accentImage}
                  alt="Eucalyptus"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Main CTA content */}
          <div className="text-center space-y-8">
            <div data-section-component-key="title">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-6xl text-gray-900"
              >
                {title}
              </motion.h2>
            </div>
            
            <div data-section-component-key="subtitle">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            </div>

            <div data-section-component-key="primaryCta">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {primaryCta?.label && (
                <Button 
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-7 rounded-full shadow-xl group"
                    asChild={!!primaryCta.href}
                  >
                    {primaryCta.href ? (
                      <a href={primaryCta.href}>
                        {primaryCta.label}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <span>
                        {primaryCta.label}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                </Button>
                )}
              </motion.div>
            </div>

            {/* Trust badges */}
            {trustBadges.length > 0 && (
            <div data-section-component-key="trustBadges">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-gray-600"
              >
                  {trustBadges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {typeof badge.icon === 'function' ? (
                        <badge.icon className="w-5 h-5 text-[#8B9A7F]" />
                      ) : (
                  <Package className="w-5 h-5 text-[#8B9A7F]" />
                      )}
                      <span>{badge.text}</span>
                </div>
                  ))}
              </motion.div>
            </div>
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
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1 }}
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
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <h4 className="text-gray-900 mb-4">Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/" className="hover:text-[#8B9A7F] transition-colors">Home</Link></li>
                  <li><Link href="/products" className="hover:text-[#8B9A7F] transition-colors">All Products</Link></li>
                  <li><Link href="/blog" className="hover:text-[#8B9A7F] transition-colors">Blog</Link></li>
                </ul>
              </motion.div>

              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <h4 className="text-gray-900 mb-4">About</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-[#8B9A7F] transition-colors">Our Story</a></li>
                  <li><a href="#" className="hover:text-[#8B9A7F] transition-colors">Ingredients</a></li>
                  <li><a href="#" className="hover:text-[#8B9A7F] transition-colors">Sustainability</a></li>
                  <li><a href="#" className="hover:text-[#8B9A7F] transition-colors">Reviews</a></li>
                </ul>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                <h4 className="text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-[#8B9A7F] transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-[#8B9A7F] transition-colors">FAQs</a></li>
                  <li><a href="#" className="hover:text-[#8B9A7F] transition-colors">Shipping</a></li>
                  <li><a href="#" className="hover:text-[#8B9A7F] transition-colors">Returns</a></li>
                </ul>
              </motion.div>
            </div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="border-t border-gray-200 pt-8 pb-4 text-center text-sm text-gray-600"
            >
              <p>© 2025 Luxivie. All rights reserved. Made with care in Canada. 🍁</p>
            </motion.div>
          </div>
        </div>
      </footer>
    </section>
  );
}