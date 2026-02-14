'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  MAX_CART_QUANTITY,
  readCartFromStorage,
  writeCartToStorage,
} from '../lib/cart';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronDown,
  LocateFixed,
  Loader2,
  CreditCard,
  ShieldCheck,
  Truck,
  MapPin,
  Minus,
  Plus,
  Edit3,
  X,
} from 'lucide-react';

const CosmosBackground = dynamic(
  () => import('../components/CosmosBackground'),
  { ssr: false }
);

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [isCartChecking, setIsCartChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [formError, setFormError] = useState('');
  const [expandedItemIndex, setExpandedItemIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
  });

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalUnits = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const previousScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      const rafId = window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });

      return () => {
        window.cancelAnimationFrame(rafId);
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }
  }, []);

  useEffect(() => {
    const applyCart = (cart) => {
      setCartItems(Array.isArray(cart) && cart.length > 0 ? cart : []);
      setIsCartChecking(false);
    };

    const cart = readCartFromStorage();
    if (cart && cart.length > 0) {
      applyCart(cart);
      return;
    }
    const t = window.setTimeout(() => applyCart(readCartFromStorage()), 100);
    return () => clearTimeout(t);
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;
    if (name === 'phone') nextValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    if (name === 'pincode') nextValue = value.replace(/[^0-9]/g, '').slice(0, 6);

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    setFormError('');
  };

  const handleCheckoutQuantityChange = (index, nextQuantity) => {
    setCartItems((prev) => {
      if (!Array.isArray(prev) || !prev[index]) return prev;

      const safeNextQuantity = Math.min(
        MAX_CART_QUANTITY,
        Math.max(0, Math.round(Number(nextQuantity) || 0))
      );

      let nextCart;

      if (safeNextQuantity === 0) {
        nextCart = prev.filter((_, itemIndex) => itemIndex !== index);
      } else {
        nextCart = [...prev];
        nextCart[index] = {
          ...nextCart[index],
          quantity: safeNextQuantity,
        };
      }

      writeCartToStorage(nextCart);

      if (nextCart.length === 0) {
        router.replace('/cart');
      }

      setExpandedItemIndex((currentExpanded) => {
        if (nextCart.length === 0) return null;
        if (safeNextQuantity > 0) return currentExpanded;
        if (currentExpanded === index) {
          return Math.min(index, nextCart.length - 1);
        }
        if (typeof currentExpanded === 'number' && currentExpanded > index) {
          return currentExpanded - 1;
        }
        return currentExpanded;
      });

      return nextCart;
    });
  };

  const requestLocation = () => {
    setLocationError('');

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        }));
        setIsLocating(false);
      },
      (error) => {
        setLocationError(
          error?.code === 1
            ? 'Location permission denied. Please allow location to continue.'
            : 'Unable to fetch location. Please try again.'
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Clear location to allow user to fetch again
  const clearLocation = () => {
    setFormData((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
    }));
    setLocationError('');
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) return 'Please enter full name.';
    if (!emailRegex.test(formData.email.trim())) return 'Please enter a valid email.';
    if (!/^\d{10}$/.test(formData.phone)) return 'Please enter a valid 10-digit phone number.';
    if (!formData.address.trim()) return 'Please enter delivery address.';
    if (!formData.city.trim()) return 'Please enter city.';
    if (!formData.state.trim()) return 'Please enter state.';
    if (!/^\d{6}$/.test(formData.pincode)) return 'Please enter a valid 6-digit pincode.';
    if (formData.latitude === null || formData.longitude === null) {
      return 'Please allow location access before checkout.';
    }

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);

    const checkoutDraft = {
      customer: {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode,
      },
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      cart: cartItems,
      subtotal,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending',
    };

    window.sessionStorage.setItem('checkout_draft', JSON.stringify(checkoutDraft));

    const configuredPaymentLink = process.env.NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK;
    const razorpayPaymentLink =
      typeof configuredPaymentLink === 'string' &&
      /^https:\/\/[\w.-]+(?:\/[\w\-./?%&=+#]*)?$/i.test(configuredPaymentLink)
        ? configuredPaymentLink
        : 'https://razorpay.com/';

    window.location.assign(razorpayPaymentLink);
  };

  if (isCartChecking) {
    return (
      <>
        <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
          <CosmosBackground />
        </Suspense>

        <div className="relative min-h-screen text-white overflow-hidden">
          <nav className="relative z-20 px-4 sm:px-6 md:px-8 py-4 backdrop-blur-lg bg-slate-950/80 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
              >
                <ChevronLeft size={18} />
                Back to Cart
              </Link>

              <span className="text-sm text-slate-300">Secure Checkout</span>
            </div>
          </nav>

          <main className="relative z-10 min-h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <Loader2 size={36} className="animate-spin text-cyan-400 mx-auto" />
              <p className="mt-3 text-slate-300">Loading checkout...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  const showEmptyCart = !isCartChecking && cartItems.length === 0;
  const isLocationFetched = formData.latitude !== null && formData.longitude !== null;

  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
        <CosmosBackground />
      </Suspense>

      <div className="relative min-h-screen text-white overflow-hidden">
        <nav className="relative z-20 px-4 sm:px-6 md:px-8 py-4 backdrop-blur-lg bg-slate-950/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
            >
              <ChevronLeft size={18} />
              Back to Cart
            </Link>

            <span className="text-sm text-cyan-300">Secure Checkout</span>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {showEmptyCart ? (
            <div className="text-center py-16">
              <p className="text-xl font-semibold text-white mb-2">Your cart is empty</p>
              <p className="text-slate-400 mb-6">Add items from the store to proceed to checkout.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition"
                >
                  <ChevronLeft size={18} />
                  View Cart
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:shadow-lg transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Your Orders Section - Small Stacked Cards */}
            <section className="lg:col-span-2 space-y-4">
              <p className="text-xs tracking-[0.2em] text-cyan-300 uppercase">Your Orders</p>

              {/* Small stacked cards like store */}
              <div className="space-y-2">
                {cartItems.map((item, index) => {
                  const isExpanded = expandedItemIndex === index;

                  return (
                    <div
                      key={`${item.product}-${item.type}-${index}`}
                      className={`rounded-lg border transition-all duration-200 ${
                        isExpanded 
                          ? 'bg-slate-800/50 border-cyan-400/50' 
                          : 'bg-slate-900/30 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Collapsed Card - Small like store card */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedItemIndex((current) =>
                            current === index ? null : index
                          )
                        }
                        className="w-full flex items-center gap-2 p-2 text-left hover:bg-white/5 transition"
                      >
                        <div className="relative w-10 h-14 rounded overflow-hidden border border-white/10 bg-black/20 flex-shrink-0">
                          <Image
                            src={item.image || '/works/dashavatar.webp'}
                            alt={item.productName}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">{item.productName}</p>
                          <p className="text-[10px] text-slate-400">
                            {item.type === 'framed' ? 'Framed' : 'Print'} • Qty: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-semibold text-white">₹{item.price * item.quantity}</p>
                        </div>

                        <ChevronDown
                          size={14}
                          className={`text-slate-400 transition-transform flex-shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Expanded Card - With quantity controls */}
                      {isExpanded && (
                        <div className="border-t border-white/10 p-3 bg-black/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-slate-300">Qty:</p>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCheckoutQuantityChange(index, item.quantity - 1)
                                }
                                className="w-6 h-6 rounded bg-white/10 border border-white/20 hover:bg-white/20 transition flex items-center justify-center text-xs"
                                title={item.quantity === 1 ? 'Remove item' : 'Decrease'}
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-xs font-semibold text-white">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={item.quantity >= MAX_CART_QUANTITY}
                                onClick={() =>
                                  handleCheckoutQuantityChange(index, item.quantity + 1)
                                }
                                className="w-6 h-6 rounded bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 transition flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-xs text-slate-400">
                              Max {MAX_CART_QUANTITY}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Trust badges */}
              <div className="space-y-2 text-xs pt-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Secure payment via Razorpay
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Truck size={14} className="text-cyan-400" />
                  Delivery tracking enabled
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin size={14} className="text-purple-400" />
                  Location helps faster delivery
                </div>
              </div>
            </section>

            {/* Delivery Details Section */}
            <section className="lg:col-span-3 bg-slate-800/30 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                Delivery Details
              </h1>
              <p className="text-sm text-slate-300 mb-8">
                Fill in your details, allow location permission, then continue to payment.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone (10 digits)"
                  required
                  maxLength={10}
                  className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full Address"
                  required
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />

                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <input
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                    className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <input
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    required
                    maxLength={6}
                    className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* Location Section - With change option */}
                <div className="space-y-2">
                  {isLocationFetched ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-green-400" />
                          <span className="text-sm text-green-400 font-medium">Location Captured</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Lat: {formData.latitude}, Long: {formData.longitude}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={requestLocation}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                          title="Update location"
                        >
                          <Edit3 size={14} className="text-cyan-400" />
                        </button>
                        <button
                          type="button"
                          onClick={clearLocation}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                          title="Clear location"
                        >
                          <X size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={requestLocation}
                      disabled={isLocating}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 disabled:opacity-50 transition inline-flex items-center justify-center gap-2"
                    >
                      {isLocating ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <LocateFixed size={18} />
                      )}
                      {isLocating ? 'Fetching location...' : 'Allow Live Location'}
                    </button>
                  )}
                  
                  {locationError && (
                    <p className="text-red-400 text-xs">{locationError}</p>
                  )}
                </div>

                {formError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400 text-sm">{formError}</p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Items:</span>
                    <span className="text-white font-medium">{cartItems.length} product(s) • {totalUnits} unit(s)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Subtotal:</span>
                    <span className="text-lg font-bold text-white">₹{subtotal}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Details stored after payment confirmation
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold hover:shadow-2xl hover:shadow-cyan-500/40 transition disabled:opacity-60 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CreditCard size={18} />
                  )}
                  Proceed to Payment
                </button>
              </form>
            </section>
          </div>
          )}
        </main>
      </div>
    </>
  );
}
