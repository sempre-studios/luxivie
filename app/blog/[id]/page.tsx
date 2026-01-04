"use client";

import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Leaf, Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

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

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

// Sample blog posts - in a real app, these would come from an API or CMS
const blogPosts: Record<string, BlogPost> = {
  "1": {
    id: "1",
    title: "The Science Behind Rosemary Oil for Hair Growth",
    excerpt: "Discover how rosemary oil has been scientifically proven to promote hair growth and improve scalp health.",
    content: `Rosemary oil has been used for centuries in traditional medicine, but recent scientific studies have confirmed its effectiveness in promoting hair growth. In this comprehensive guide, we'll explore the science behind this powerful natural ingredient.

## The Active Compounds

Rosemary oil contains several key compounds that contribute to its hair growth benefits:

**1,8-Cineole (Eucalyptol)**: This compound improves blood circulation to the scalp, which is essential for hair follicle health and growth.

**Camphor**: Known for its anti-inflammatory properties, camphor helps reduce scalp irritation and inflammation that can inhibit hair growth.

**Alpha-Pinene**: This compound has antimicrobial properties that help maintain a healthy scalp environment.

**Rosmarinic Acid**: A powerful antioxidant that protects hair follicles from oxidative stress.

## Scientific Evidence

A 2015 study published in the journal "Skinmed" compared rosemary oil to minoxidil (a common hair loss treatment) and found that rosemary oil was just as effective in treating androgenetic alopecia (pattern baldness) after six months of use.

The study involved 100 participants with androgenetic alopecia. Half used rosemary oil, and half used minoxidil. After six months, both groups showed significant hair growth, with no significant difference between the two treatments.

## How It Works

Rosemary oil promotes hair growth through several mechanisms:

1. **Improved Circulation**: The oil stimulates blood flow to the scalp, delivering essential nutrients to hair follicles.

2. **DHT Blocking**: Some studies suggest that rosemary oil may help block dihydrotestosterone (DHT), a hormone that can cause hair follicles to shrink.

3. **Antioxidant Protection**: The antioxidants in rosemary oil protect hair follicles from damage caused by free radicals.

4. **Anti-Inflammatory Effects**: By reducing inflammation, rosemary oil creates a healthier environment for hair growth.

## How to Use Rosemary Oil

For best results, apply rosemary oil to your scalp 2-3 times per week:

1. Mix a few drops of rosemary oil with a carrier oil (like jojoba or coconut oil)
2. Massage the mixture into your scalp using circular motions
3. Leave it on for at least 30 minutes, or overnight for intensive treatment
4. Wash out with a gentle shampoo

## Conclusion

The scientific evidence supporting rosemary oil for hair growth is compelling. While more research is needed, the existing studies show promising results. As with any natural remedy, consistency is key - regular use over several months is necessary to see significant results.`,
    image_url: "https://images.unsplash.com/photo-1549049950-48d5887197a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlbWFyeSUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Dr. Sarah Chen",
    publishedAt: "2025-01-15",
    readTime: "5 min read",
    category: "Hair Care",
    tags: ["Rosemary Oil", "Hair Growth", "Natural Remedies"]
  },
  "2": {
    id: "2",
    title: "5 Natural Ingredients That Transform Your Hair",
    excerpt: "Explore five powerful natural ingredients that can revolutionize your hair care routine.",
    content: `Natural ingredients have been used for hair care for thousands of years, and modern science is now confirming their effectiveness. Here are five powerful natural ingredients that can transform your hair.`,
    image_url: "https://images.unsplash.com/photo-1739980213756-753aea153bb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWF1dHklMjBwcm9kdWN0JTIwbWFyYmxlfGVufDF8fHx8MTc2MzQ5NzkyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Emma Rodriguez",
    publishedAt: "2025-01-10",
    readTime: "7 min read",
    category: "Ingredients",
    tags: ["Natural Ingredients", "Hair Care", "Wellness"]
  },
  // Add more posts as needed
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setPost(blogPosts[id] || null);
    });
  }, [params]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F9F9F6]">
        <Navigation />
        <div className="h-20"></div>
        <div className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Blog post not found</p>
              <Link
                href="/blog"
                className="text-[#BFC8B3] hover:text-[#A8B19D] transition-colors"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <Navigation />

      {/* Spacer for fixed navigation */}
      <div className="h-20"></div>

      <div className="pt-12 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8B9A7F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Category Badge */}
            <div className="mb-4">
              <Badge className="bg-[#BFC8B3] text-white border-0">
                {post.category}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <div>
                By <span className="font-medium text-gray-900">{post.author}</span>
              </div>
              <button className="flex items-center gap-2 hover:text-[#8B9A7F] transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Featured Image */}
            <div className="mb-8 rounded-xl overflow-hidden">
              <ImageWithFallback
                src={post.image_url}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed space-y-6">
                {post.content.split('\n\n').map((paragraph, index) => {
                  // Check if it's a heading
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  // Check if it's a bold text (markdown style)
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={index} className="font-semibold text-gray-900">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  // Regular paragraph
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-base md:text-lg">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:border-[#BFC8B3] hover:text-[#8B9A7F] transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#BFC8B3] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xl">
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {post.author}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Expert in natural hair care and botanical ingredients. Passionate about helping people achieve healthier hair through science-backed natural solutions.
                  </p>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Related Posts Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 pt-12 border-t border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(blogPosts)
                .filter(p => p.id !== post.id && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={relatedPost.image_url}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <Badge className="bg-[#BFC8B3] text-white border-0 mb-2">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#8B9A7F] transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
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
                    <Link href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      Hair Care
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      Bestsellers
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      Gift Sets
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      New Arrivals
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

