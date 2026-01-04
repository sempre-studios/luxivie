"use client";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Leaf, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags?: string[];
}

// Sample blog posts - in a real app, these would come from an API or CMS
const sampleBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Science Behind Rosemary Oil for Hair Growth",
    excerpt: "Discover how rosemary oil has been scientifically proven to promote hair growth and improve scalp health. Learn about the active compounds and how they work.",
    content: "",
    image_url: "https://images.unsplash.com/photo-1549049950-48d5887197a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlbWFyeSUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Dr. Sarah Chen",
    publishedAt: "2025-01-15",
    readTime: "5 min read",
    category: "Hair Care",
    tags: ["Rosemary Oil", "Hair Growth", "Natural Remedies"]
  },
  {
    id: "2",
    title: "5 Natural Ingredients That Transform Your Hair",
    excerpt: "Explore five powerful natural ingredients that can revolutionize your hair care routine. From biotin to keratin, learn what makes these ingredients so effective.",
    content: "",
    image_url: "https://images.unsplash.com/photo-1739980213756-753aea153bb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWF1dHklMjBwcm9kdWN0JTIwbWFyYmxlfGVufDF8fHx8MTc2MzQ5NzkyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Emma Rodriguez",
    publishedAt: "2025-01-10",
    readTime: "7 min read",
    category: "Ingredients",
    tags: ["Natural Ingredients", "Hair Care", "Wellness"]
  },
  {
    id: "3",
    title: "How to Build a Sustainable Hair Care Routine",
    excerpt: "Learn how to create an effective hair care routine that's both sustainable for the environment and beneficial for your hair. Tips for reducing waste and choosing eco-friendly products.",
    content: "",
    image_url: "https://images.unsplash.com/photo-1747858989102-cca0f4dc4a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFtcG9vJTIwYm90dGxlJTIwY2xlYW58ZW58MXx8fHwxNzYzNDk3OTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Michael Thompson",
    publishedAt: "2025-01-05",
    readTime: "6 min read",
    category: "Sustainability",
    tags: ["Sustainability", "Eco-Friendly", "Hair Care"]
  },
  {
    id: "4",
    title: "Understanding Your Hair Type: A Complete Guide",
    excerpt: "Discover your unique hair type and learn how to care for it properly. From straight to curly, fine to thick, we cover everything you need to know.",
    content: "",
    image_url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    author: "Lisa Park",
    publishedAt: "2024-12-28",
    readTime: "8 min read",
    category: "Hair Care",
    tags: ["Hair Types", "Hair Care Tips", "Guide"]
  },
  {
    id: "5",
    title: "The Benefits of Cold-Pressed Oils for Hair Health",
    excerpt: "Why cold-pressed oils are superior for hair care. Learn about the extraction process and how it preserves the beneficial compounds in natural oils.",
    content: "",
    image_url: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    author: "Dr. Sarah Chen",
    publishedAt: "2024-12-20",
    readTime: "5 min read",
    category: "Ingredients",
    tags: ["Cold-Pressed", "Oils", "Natural"]
  },
  {
    id: "6",
    title: "Winter Hair Care: Protecting Your Hair from the Cold",
    excerpt: "Essential tips for maintaining healthy hair during the winter months. Learn how to protect your hair from dryness, static, and damage caused by cold weather.",
    content: "",
    image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    author: "Emma Rodriguez",
    publishedAt: "2024-12-15",
    readTime: "6 min read",
    category: "Hair Care",
    tags: ["Winter Care", "Hair Protection", "Seasonal"]
  }
];

export default function BlogPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert tips, hair care insights, and the latest in natural beauty
            </p>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleBlogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-[#BFC8B3]/30 transition-all duration-300 flex flex-col group"
                >
                  {/* Featured Image */}
                  <Link href={`/blog/${post.id}`}>
                    <div className="relative w-full h-64 overflow-hidden bg-gray-50">
                      <ImageWithFallback
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#BFC8B3] text-white border-0 shadow-sm">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.id}`}>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#8B9A7F] transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Author */}
                    <div className="text-xs text-gray-500 mb-5">
                      By <span className="font-medium text-gray-700">{post.author}</span>
                    </div>

                    {/* Read More Link */}
                    <Link href={`/blog/${post.id}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:bg-[#BFC8B3]/10 text-gray-700 hover:text-[#8B9A7F] font-medium h-11 rounded-lg transition-all"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Newsletter Signup Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-32 pt-16 max-w-3xl mx-auto"
            style={{ marginTop: '8rem' }}
          >
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Leaf className="w-6 h-6 text-[#BFC8B3]" />
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    Stay Updated
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Get the latest hair care tips, product updates, and exclusive content delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full sm:w-[400px] px-5 py-3.5 text-base rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] focus:border-transparent"
                  />
                  <Button className="w-full sm:w-[140px] bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4 whitespace-nowrap shrink-0 text-sm">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
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
                    <a href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      Hair Care
                    </a>
                  </li>
                  <li>
                    <a href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      Bestsellers
                    </a>
                  </li>
                  <li>
                    <a href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      Gift Sets
                    </a>
                  </li>
                  <li>
                    <a href="/products" className="hover:text-[#8B9A7F] transition-colors">
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
                    <a href="#story" className="hover:text-[#8B9A7F] transition-colors">
                      Our Story
                    </a>
                  </li>
                  <li>
                    <a href="#ingredients" className="hover:text-[#8B9A7F] transition-colors">
                      Ingredients
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                      Sustainability
                    </a>
                  </li>
                  <li>
                    <a href="#reviews" className="hover:text-[#8B9A7F] transition-colors">
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

