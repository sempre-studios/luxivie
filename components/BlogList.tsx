"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BlogPost } from "@/lib/blogs";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts: initialPosts }: BlogListProps) {
  const [posts, setPosts] = React.useState<BlogPost[]>(initialPosts);

  // Check for updates in the background after component mounts
  React.useEffect(() => {
    let mounted = true;

    // Wait a bit after mount to not interfere with initial render
    const checkForUpdates = async () => {
      if (!mounted) return;
      try {
        const response = await fetch(`/api/blogs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Use cache but allow revalidation
          cache: 'no-store',
        });

        if (!response.ok || !mounted) {
          console.warn('Failed to check for blog updates');
          return;
        }

        const { blogs: fetchedBlogs } = await response.json();

        if (!mounted) return;

        // Compare fetched blogs with current posts
        // Check if there are new blogs or updated ones
        setPosts((currentPosts) => {
          const hasNewBlogs = fetchedBlogs.length !== currentPosts.length;
          const hasUpdatedBlogs = fetchedBlogs.some((fetched: BlogPost) => {
            const existing = currentPosts.find(p => p.id === fetched.id);
            if (!existing) return true; // New blog
            // Check if updated_at changed (if available)
            if (fetched.updatedAt && existing.updatedAt) {
              return fetched.updatedAt !== existing.updatedAt;
            }
            return false;
          });

          // Only update if there are actual changes
          if (hasNewBlogs || hasUpdatedBlogs) {
            return fetchedBlogs;
          }
          return currentPosts;
        });
      } catch (error) {
        console.error('Error checking for blog updates:', error);
        // Silently fail - don't disrupt the user experience
      }
    };

    // Check for updates after a short delay to not block initial render
    const timeoutId = setTimeout(() => {
      if (mounted) {
        checkForUpdates();
      }
    }, 1000); // Wait 1 second after mount

    // Also set up periodic checks (every 5 minutes)
    const intervalId = setInterval(() => {
      if (mounted) {
        checkForUpdates();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []); // Only run once on mount

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No blog posts available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
          className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-[#BFC8B3]/30 transition-all duration-300 flex flex-col group"
          role="article"
        >
          {/* Featured Image */}
          <Link href={`/blog/${post.slug}`}>
            <div className="relative w-full h-64 overflow-hidden bg-gray-50 rounded-t-3xl">
              <ImageWithFallback
                src={post.image_url || '/placeholder-blog.jpg'}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {post.category && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#BFC8B3] text-white border-0 shadow-sm">
                    {post.category}
                  </Badge>
                </div>
              )}
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
              {post.readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#8B9A7F] transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h2>
            </Link>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Author */}
            {post.author && (
              <div className="text-xs text-gray-500 mb-5">
                By <span className="font-medium text-gray-700">{post.author}</span>
              </div>
            )}

            {/* Read More Link - Moved to bottom */}
            <div className="mt-auto pt-4">
              <Link href={`/blog/${post.slug}`}>
                <Button
                  className="w-full justify-between bg-gray-900 hover:bg-gray-800 text-white font-medium h-11 rounded-md transition-all"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

