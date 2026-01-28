'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronLeft, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

// Cosmos background (client-only)
const CosmosBackground = dynamic(
  () => import('../components/CosmosBackground'),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-slate-950" />,
  }
);

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setIsLoading(false);
  }, []);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const isCartEmpty = cartItems.length === 0;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <>
        <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
          <CosmosBackground />
        </Suspense>
        <div className="min-h-screen flex items-center justify-center text-white relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Background */}
      <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
        <CosmosBackground />
      </Suspense>

      <div className="relative min-h-screen text-white overflow-hidden">
        
        {/* Navigation */}
        <nav className="relative z-20 px-4 sm:px-6 md:px-8 py-4 backdrop-blur-lg bg-slate-950/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link 
              href="/store"
              className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Continue Shopping</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-cyan-400" />
              <span className="font-semibold">Cart ({cartItems.length})</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
            Shopping Cart
          </h1>

          {isCartEmpty ? (
            /* Empty Cart State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
                <ShoppingCart size={48} className="text-slate-600" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">Your cart is empty</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link
                href="/store"
                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold text-white hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-400 hover:text-red-300 transition cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>

                {cartItems.map((item, index) => (
                  <div key={index} className="bg-slate-800/30 rounded-xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900/50 border border-white/10">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">
                          {item.type === 'framed' ? 'A4 Print • With Frame' : 'A4 Print • Unframed'}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity === 1}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition flex items-center justify-center cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-lg sm:text-xl font-bold text-white">
                          ₹{item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-400 hover:text-red-300 transition p-2 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10 backdrop-blur-sm sticky top-24">
                  <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                      <span className="font-semibold">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-400">FREE</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between text-white text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">₹{total}</span>
                    </div>
                  </div>

                  <button className="w-full py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold text-white hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
                    Proceed to Checkout
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-4">
                    Taxes calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
            <p className="text-sm">© 2026 Venkat's POV. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}