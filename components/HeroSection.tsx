"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Leaf, MapPin, FlaskConical, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  content?: {
    badge?: {
      icon?: string;
      text?: string;
    };
    title?: string;
    subtitle?: string;
    primaryCta?: {
      label?: string;
      href?: string;
    };
    secondaryCta?: {
      label?: string;
      href?: string;
    };
    heroImage?: string;
    accentImage?: string;
  };
}

// Icon mapping for badge
const iconMap: Record<string, typeof Leaf> = {
  Leaf,
  MapPin,
  FlaskConical,
  Sparkles,
};

export function HeroSection({ content }: HeroSectionProps = {}) {
  // Content structure is now guaranteed by Zod validation
  // No need for defensive unwrapping - structure is always flat and correct
  
  const badge = content?.badge || { icon: 'Leaf', text: 'Designed in Canada' };
  const title = content?.title || 'Clean Beauty That Works—Made With Care in Canada';
  const subtitle = content?.subtitle || 'Luxurious hair care and skincare crafted with clean ingredients, gentle botanicals, and modern science.';
  const primaryCta = content?.primaryCta || { label: 'Shop Bestsellers', href: '#products' };
  const secondaryCta = content?.secondaryCta || { label: 'See Our Ingredients', href: '#ingredients' };
  // heroImage and accentImage are always strings (URLs) per Zod schema
  const heroImage = content?.heroImage || 'https://images.unsplash.com/photo-1739980213756-753aea153bb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWF1dHklMjBwcm9kdWN0JTIwbWFyYmxlfGVufDF8fHx8MTc2MzQ5NzkyN3ww&ixlib=rb-4.1.0&q=80&w=1080';
  const accentImage = content?.accentImage || 'https://images.unsplash.com/photo-1763154045793-4be5374b3e70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldWNhbHlwdHVzJTIwbGVhdmVzJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080';
  
  const BadgeIcon = badge.icon ? (iconMap[badge.icon] || Leaf) : Leaf;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9F9F6] via-[#F9F9F6] to-[#E8E8E0]" />
      
      {/* Decorative botanical accent */}
      <motion.div
        initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
        animate={{ opacity: 0.1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-10 right-10"
      >
        <Leaf className="w-64 h-64 text-[#BFC8B3]" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left space-y-8">
            {badge.text && (
            <div data-section-component-key="badge">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-[#BFC8B3]/30"
              >
                  <BadgeIcon className="w-4 h-4 text-[#BFC8B3]" />
                  <span className="text-sm text-gray-700">{badge.text}</span>
              </motion.div>
            </div>
            )}
            
            <div data-section-component-key="title">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-7xl text-gray-900 leading-tight"
              >
                {title}
              </motion.h1>
            </div>
            
            <div data-section-component-key="subtitle">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-gray-600 max-w-xl"
              >
                {subtitle}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {primaryCta?.label && (
              <div data-section-component-key="primaryCta">
                <Button 
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-full shadow-lg"
                    asChild={!!primaryCta.href}
                  >
                    {primaryCta.href ? (
                      <a href={primaryCta.href}>{primaryCta.label}</a>
                    ) : (
                      <span>{primaryCta.label}</span>
                    )}
                </Button>
              </div>
              )}
              {secondaryCta?.label && (
              <div data-section-component-key="secondaryCta">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 hover:border-[#BFC8B3] hover:bg-white px-8 py-6 rounded-full"
                    asChild={!!secondaryCta.href}
                  >
                    {secondaryCta.href ? (
                      <a href={secondaryCta.href}>{secondaryCta.label}</a>
                    ) : (
                      <span>{secondaryCta.label}</span>
                    )}
                </Button>
              </div>
              )}
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            {heroImage && (
            <div data-section-component-key="heroImage" className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={heroImage}
                alt="Luxivie beauty products on marble"
                className="w-full h-[600px] object-cover"
              />
              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>
            )}

            {/* Floating botanical accent */}
            {accentImage && (
            <div data-section-component-key="accentImage">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-8 -left-8 w-32 h-32"
              >
                <ImageWithFallback
                    src={accentImage}
                  alt="Eucalyptus accent"
                  className="w-full h-full object-cover rounded-full shadow-xl"
                />
              </motion.div>
            </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
