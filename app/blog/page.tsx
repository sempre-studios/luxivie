import { Navigation } from "@/components/Navigation";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { getPublishedBlogs } from "@/lib/blogs";
import dynamic from "next/dynamic";

const BlogList = dynamic(
  () => import("@/components/BlogList").then((mod) => ({ default: mod.BlogList })),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="text-center py-12 col-span-full">
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    ),
  }
);

export default async function BlogPage() {
  // Fetch published blogs from database
  const blogPosts = await getPublishedBlogs();

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <Navigation />

      {/* Decorative botanical accent */}
      <div className="fixed top-20 right-10 pointer-events-none z-0 opacity-5">
        <Leaf className="w-96 h-96 text-[#BFC8B3]" />
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-20"></div>

      <div className="relative pt-12 pb-20 z-10">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl text-gray-900 mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert tips, hair care insights, and the latest in natural beauty
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="max-w-7xl mx-auto">
            <BlogList posts={blogPosts} />
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

