import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Leaf, Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogs";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  
  // Fetch blog by slug (id is actually the slug)
  const post = await getBlogBySlug(id);
  
  // Also fetch all blogs for related posts
  const allBlogs = await getPublishedBlogs();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Render rich text content (HTML from Quill editor)
  const renderContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
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
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8B9A7F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </div>

          {/* Article Header */}
          <article>
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
              {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              )}
              {post.author && (
              <div>
                By <span className="font-medium text-gray-900">{post.author}</span>
              </div>
              )}
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
              <div className="text-gray-700 leading-relaxed space-y-6 blog-content">
                {renderContent(post.content)}
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
            {post.author && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#BFC8B3] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xl">
                      {post.author.split(' ').map(n => n[0]).join('').toUpperCase()}
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
            )}
          </article>

          {/* Related Posts Section */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {allBlogs
                .filter(p => p.id !== post.id && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={relatedPost.image_url || '/placeholder-blog.jpg'}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        {relatedPost.category && (
                        <Badge className="bg-[#BFC8B3] text-white border-0 mb-2">
                          {relatedPost.category}
                        </Badge>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#8B9A7F] transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-[#BFC8B3]" />
                  <span className="text-xl text-gray-900">LUXIVIE</span>
                </div>
                <p className="text-sm text-gray-600">
                  Clean beauty crafted with care in Canada
                </p>
              </div>

              {/* Navigation Links - Matching Navbar */}
              <div>
                <h4 className="text-gray-900 mb-4">Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/" className="hover:text-[#8B9A7F] transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-[#8B9A7F] transition-colors">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-[#8B9A7F] transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              {/* About Links */}
              <div>
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
              </div>

              {/* Support Links */}
              <div>
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
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 pt-8 pb-4 text-center text-sm text-gray-600">
              <p>© 2025 Luxivie. All rights reserved. Made with care in Canada. 🍁</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

