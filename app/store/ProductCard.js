import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

  return (
    <Link href={`/product/${product.slug}`} className="group block cursor-pointer">
      <article className="h-full flex flex-col">
        
        {/* Product Image */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900/50 border border-white/10 aspect-square">
          
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-800/50 animate-pulse" />
          )}

          {/* Optimized Image */}
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            quality={85}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Limited Edition Badge - Positioned at Bottom */}
          {product.limited && (
            <span className="absolute bottom-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              LIMITED PRINTS
            </span>
          )}
          
          {/* Quick View Text */}
          <div className="absolute bottom-3 right-3 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View →
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-2 flex-1 flex flex-col">
          
          {/* Product Title */}
          <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2 text-sm mt-auto flex-wrap">
            <span className="text-green-400 text-xs font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">
              {product.discount}% OFF
            </span>
            <span className="line-through text-slate-400 text-xs">
              ₹{product.price}
            </span>
            <span className="font-bold text-white text-base">
              ₹{discountedPrice}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}