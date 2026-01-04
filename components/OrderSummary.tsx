"use client";

import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function OrderSummary() {
    const { items, updateQuantity, removeFromCart } = useCart();

    const handleUpdateQuantity = (id: string, delta: number) => {
        const item = items.find(i => i.id === id);
        if (item) {
            const newQuantity = Math.max(1, item.quantity + delta);
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemoveItem = (id: string) => {
        removeFromCart(id);
    };

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.99;
    const taxRate = 0.13; // HST 13%
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    return (
        <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-3xl p-8 lg:p-10">
                <h2 className="text-2xl text-gray-900 mb-8 font-normal">Order Summary</h2>

                {/* Cart Items */}
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">Your cart is empty</p>
                        <a href="#products" className="text-[#8B9A7F] hover:underline">
                            Continue shopping
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6 mb-8">
                        {items.map((item, index) => {
                            const itemTotal = item.price * item.quantity;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 shrink-0">
                                        <ImageWithFallback
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex justify-between items-start mb-3 gap-6">
                                            <h3 className="text-base text-gray-900 font-normal pr-2 flex-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-lg text-gray-900 font-normal whitespace-nowrap ml-6 min-w-[90px] text-right">
                                                ${itemTotal.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, -1)}
                                                    className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 py-2 text-sm text-gray-900 min-w-[40px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, 1)}
                                                    className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                                aria-label="Remove item"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Price Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4 pt-6 border-t border-gray-100"
                >
                    <div className="flex justify-between text-base text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base text-gray-600">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base text-gray-600">
                        <span>Tax (HST 13%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-100">
                        <span className="text-lg text-gray-900 font-normal">Total</span>
                        <span className="text-3xl text-gray-900 font-normal">${total.toFixed(2)}</span>
                    </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-6 flex-wrap text-sm text-gray-500"
                >
                    <span className="flex items-center gap-2">🔒 Secure Checkout</span>
                    <span className="flex items-center gap-2">🇨🇦 Made in Canada</span>
                    <span className="flex items-center gap-2">✓ 30-Day Returns</span>
                </motion.div>
            </div>
        </div>
    );
}
