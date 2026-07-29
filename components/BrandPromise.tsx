"use client";

import { MapPin, FlaskConical, Sparkles, Leaf, Droplets, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface BrandPromiseProps {
  content?: {
    promises?: Array<{
      icon?: string;
      title?: string;
      description?: string;
    }>;
  };
}

// Icon mapping
const iconMap: Record<string, typeof MapPin> = {
  MapPin,
  FlaskConical,
  Sparkles,
  Leaf,
  Droplets,
  Zap,
  Shield,
};

const getStringValue = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    const candidateKeys = ['value', 'text', 'label', 'title', 'name']
    for (const key of candidateKeys) {
      if (typeof obj[key] === 'string') return obj[key] as string
    }
  }
  return fallback
}

export function BrandPromise({ content }: BrandPromiseProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultPromises = [
    {
      icon: MapPin,
      title: "Designed in Canada",
      description: "Crafted with clean formulas in trusted GMP-certified facilities.",
    },
    {
      icon: FlaskConical,
      title: "Backed by Clean Science",
      description: "Effective botanical ingredients—safe, gentle, and performance-driven.",
    },
    {
      icon: Sparkles,
      title: "Luxurious Yet Affordable",
      description: "Premium results without premium pricing.",
    },
  ];

  const normalizedPromises = (content?.promises ?? []).map(p => {
    const iconKey = getStringValue(p.icon, 'MapPin')
    return {
      icon: iconMap[iconKey] || MapPin,
      title: getStringValue(p.title),
      description: getStringValue(p.description),
    }
  }).filter(p => p.title || p.description)

  const promises = normalizedPromises.length ? normalizedPromises : defaultPromises;

  return (
    <section ref={ref} className="py-24 bg-[#F9F9F6]">
      <div className="container mx-auto px-4">
        <div data-section-component-key="promises" className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center space-y-4 p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-gray-200/50 hover:border-[#BFC8B3]/50 transition-all"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-[#BFC8B3]/20 rounded-full"
              >
                {typeof promise.icon === 'function' ? (
                <promise.icon className="w-8 h-8 text-[#8B9A7F]" />
                ) : (
                  <MapPin className="w-8 h-8 text-[#8B9A7F]" />
                )}
              </motion.div>
              <h3 className="text-gray-900">{promise.title}</h3>
              <p className="text-gray-600">{promise.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
