'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { products } from './products';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { Home, ShoppingBag } from 'lucide-react';

// Cosmos background (client-only)
const CosmosBackground = dynamic(
  () => import('../components/CosmosBackground'),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-slate-950" />,
  }
);

export default function StorePage() {
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
              href="/"
              className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
            >
              <Home size={20} />
              <span className="font-medium">Home</span>
            </Link>
            
            <div className="flex items-center gap-2 cursor-pointer">
              <ShoppingBag size={20} className="text-cyan-400" />
              <span className="font-semibold">Store</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
              Art Store
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Discover our collection of premium art prints. Each piece is carefully crafted and available in limited quantities.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          {/* Empty State (if no products) */}
          {products.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-slate-600 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">No Products Available</h2>
              <p className="text-slate-400">Check back soon for new arrivals!</p>
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