"use client";

import { CheckoutForm } from "@/components/CheckoutForm";
import { OrderSummary } from "@/components/OrderSummary";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const handleFormSubmit = (data: unknown) => {
        console.log("Order submitted:", data);
        // Handle order submission here
    };

    return (
        <div className="min-h-screen bg-[#F9F9F6]">
            {/* Decorative botanical accent */}
            <motion.div
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 0.05, rotate: 0, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="fixed top-20 right-10 pointer-events-none"
            >
                <Leaf className="w-96 h-96 text-[#BFC8B3]" />
            </motion.div>

            <div className="relative pb-20 pt-10">
                <div className="container mx-auto px-4 pb-5">
                    {/* Page Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-4 text-center"
                    >
                        <h1 className="text-4xl lg:text-5xl text-gray-900 mb-4">
                            Checkout
                        </h1>
                        <p className="text-xl text-gray-600">
                            Complete your order for clean, luxurious beauty
                        </p>
                    </motion.div>

                    {/* Checkout Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column: Forms */}
                        <div>
                            {/* Checkout Form */}
                            <CheckoutForm onSubmit={handleFormSubmit} />
                        </div>

                        {/* Right Column: Order Summary */}
                        <div>
                            {/* Order Summary */}
                            <OrderSummary />
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

                            {/* Navigation Links - Matching Navbar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
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
                                        <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                                            Our Story
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                                            Ingredients
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-[#8B9A7F] transition-colors">
                                            Sustainability
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-[#8B9A7F] transition-colors">
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
