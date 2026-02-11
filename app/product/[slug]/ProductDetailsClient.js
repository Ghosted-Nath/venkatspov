'use client';

import { useMemo, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ChevronLeft,
  ShoppingCart,
  Tag,
  Package,
  Truck,
  Shield,
  X,
} from 'lucide-react';
import {
  MAX_CART_QUANTITY,
  readCartFromStorage,
  upsertCartItem,
  writeCartToStorage,
} from '../../lib/cart';
import Image from 'next/image';

const CosmosBackground = dynamic(
  () => import('../../components/CosmosBackground'),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-slate-950" />,
  }
);

export default function ProductDetailsClient({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('print');
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedType, setLastAddedType] = useState(null);

  const framePrice = Number(product.framePrice ?? 700);
  const couponDiscount = Number(product.couponDiscount ?? 26);
  const couponCode = product.couponCode || 'POV2026';
  const imageRotateDeg = Number(product.imageRotateDeg || 0);

  const {
    baseDiscountedPrice,
    finalPrice,
    priceWithCoupon,
    totalSavings,
  } = useMemo(() => {
    const basePrice = Math.round(product.price * (1 - product.discount / 100));
    const selectedPrice = selectedType === 'framed' ? basePrice + framePrice : basePrice;
    const couponPrice = Math.round(selectedPrice * (1 - couponDiscount / 100));
    const savings =
      (selectedType === 'framed' ? product.price + framePrice : product.price) - couponPrice;

    return {
      baseDiscountedPrice: basePrice,
      finalPrice: selectedPrice,
      priceWithCoupon: couponPrice,
      totalSavings: savings,
    };
  }, [product.discount, product.price, selectedType, framePrice, couponDiscount]);

  const handleQuantityChange = (nextQuantity) => {
    if (nextQuantity >= 1 && nextQuantity <= MAX_CART_QUANTITY) {
      setQuantity(nextQuantity);
    }
  };

  const addToCart = () => {
    const nextCart = upsertCartItem(readCartFromStorage(), {
      product: product.slug,
      productName: product.title,
      type: selectedType,
      quantity,
      price: finalPrice,
      image: product.images[0],
    });

    writeCartToStorage(nextCart);
    setShowToast(true);
    setLastAddedType(selectedType);
    window.setTimeout(() => setShowToast(false), 3000);
  };

  const isCurrentTypeInCartState = lastAddedType === selectedType;

  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
        <CosmosBackground />
      </Suspense>

      <div className="relative min-h-screen text-white overflow-hidden">
        {showToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
              <ShoppingCart size={20} />
              <span className="font-medium text-sm">Added to cart</span>
              <button
                onClick={() => setShowToast(false)}
                className="hover:bg-green-700 rounded-full p-1 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <nav className="relative z-20 px-4 sm:px-6 md:px-8 py-4 backdrop-blur-lg bg-slate-950/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/store"
              className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Back to Store</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline font-medium">Cart</span>
            </Link>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-4">
              <div
                className="relative rounded-2xl overflow-hidden bg-slate-900/50 border border-white/10"
                style={{ aspectRatio: '210/297' }}
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={`${product.title} - View ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  style={{ transform: `rotate(${imageRotateDeg}deg)` }}
                  priority
                />

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        idx === currentImageIndex
                          ? 'border-cyan-400 shadow-lg shadow-cyan-400/50'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      style={{ aspectRatio: '210/297' }}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        width={120}
                        height={160}
                        className="w-full h-full object-contain"
                        style={{ transform: `rotate(${imageRotateDeg}deg)` }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {product.limited && (
                <span className="inline-flex w-fit bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                  LIMITED PRINTS
                </span>
              )}
            </div>

            <div className="text-white space-y-5">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
                  {product.title}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  Premium art print on high-quality matte paper
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 font-semibold text-sm">
                    {product.discount}% OFF
                  </span>
                  <span className="text-lg line-through text-slate-400">
                    ₹{selectedType === 'framed' ? product.price + framePrice : product.price}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white">₹{finalPrice}</span>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-cyan-400/30">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 bg-cyan-400/20 rounded-full flex items-center justify-center">
                      <Tag className="w-4 h-4 text-cyan-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-cyan-400 mb-1">
                        Get Extra {couponDiscount}% OFF
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="text-xs text-slate-300">Use code:</p>
                        <code className="px-2.5 py-1 bg-slate-900 border border-dashed border-cyan-400/50 rounded font-mono font-bold text-white text-xs">
                          {couponCode}
                        </code>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xs text-slate-400">Final Price:</span>
                        <span className="text-lg font-bold text-white">₹{priceWithCoupon}</span>
                        <span className="text-xs text-green-400 font-medium">(Save ₹{totalSavings})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wide">
                  Select Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedType('print')}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                      selectedType === 'print'
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">A4 Print</div>
                    <div className="text-xs text-slate-400 mb-2">Unframed</div>
                    <div className="text-base font-bold">₹{baseDiscountedPrice}</div>
                  </button>

                  <button
                    onClick={() => setSelectedType('framed')}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                      selectedType === 'framed'
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">With Frame</div>
                    <div className="text-xs text-slate-400 mb-2">Premium wood</div>
                    <div className="text-base font-bold">₹{baseDiscountedPrice + framePrice}</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wide">
                  Quantity (Max {MAX_CART_QUANTITY})
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity === 1}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-lg font-semibold cursor-pointer"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold">{quantity}</span>
                  </div>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= MAX_CART_QUANTITY}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-lg font-semibold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-3">
                {isCurrentTypeInCartState ? (
                  <Link
                    href="/cart"
                    className="block w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold text-white text-base hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer text-center"
                  >
                    Go to Cart
                  </Link>
                ) : (
                  <button
                    onClick={addToCart}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold text-white text-base hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                  >
                    Add to Cart
                  </button>
                )}

                <Link
                  href="/cart"
                  className="block w-full py-3 rounded-full bg-white text-slate-950 font-semibold text-base hover:bg-slate-100 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer text-center"
                >
                  Buy Now
                </Link>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  Product Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Size</span>
                    <span className="text-white font-medium">A4 (210 × 297 mm)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Paper Quality</span>
                    <span className="text-white font-medium">Premium Matte 250gsm</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Print Type</span>
                    <span className="text-white font-medium">Giclée Print</span>
                  </div>
                  {selectedType === 'framed' && (
                    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Frame Material</span>
                      <span className="text-white font-medium">Wooden (Black/Brown)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-slate-800/20 rounded-xl border border-white/5">
                  <Truck className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white">Free Shipping</div>
                    <div className="text-xs text-slate-400">On all orders</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-800/20 rounded-xl border border-white/5">
                  <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white">Secure Payment</div>
                    <div className="text-xs text-slate-400">100% Protected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
