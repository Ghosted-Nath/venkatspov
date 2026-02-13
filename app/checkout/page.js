'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { readCartFromStorage } from '../lib/cart';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  LocateFixed,
  Loader2,
  CreditCard,
  ShieldCheck,
  Truck,
  MapPin,
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
    const cart = readCartFromStorage();
    if (!cart || cart.length === 0) {
      router.replace('/cart');
    } else {
      setCartItems(cart);
    }

    setIsCartChecking(false);
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;
    if (name === 'phone') nextValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    if (name === 'pincode') nextValue = value.replace(/[^0-9]/g, '').slice(0, 6);

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    setFormError('');
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

    const razorpayPaymentLink =
      process.env.NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK || 'https://razorpay.com/';

    window.location.href = razorpayPaymentLink;
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
          <div className="grid lg:grid-cols-5 gap-8">
            <section className="lg:col-span-2 bg-slate-900/35 border border-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6">
              <p className="text-xs tracking-[0.2em] text-cyan-300 uppercase mb-3">Delivery Preview</p>

              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20 mb-5">
                <Image
                  src={cartItems[0]?.image || '/works/dashavatar.webp'}
                  alt="Checkout artwork preview"
                  width={640}
                  height={820}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-200">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  Secure payment via Razorpay
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Truck size={16} className="text-cyan-400" />
                  Delivery tracking enabled
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <MapPin size={16} className="text-purple-400" />
                  Live location helps faster delivery routing
                </div>
              </div>
            </section>

            <section className="lg:col-span-3 bg-slate-800/30 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                Delivery Details
              </h1>
              <p className="text-sm text-slate-300 mb-8">
                Fill in your details, allow location permission popup, then continue to payment.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10"
            />
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10"
            />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address"
              required
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10"
            />

            <div className="grid sm:grid-cols-3 gap-3">
              <input
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10"
              />
              <input
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
                className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10"
              />
              <input
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
                className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10"
              />
            </div>

            <button
              type="button"
              onClick={requestLocation}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
            >
              {isLocating ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
              {formData.latitude !== null && formData.longitude !== null
                ? `Location captured (${formData.latitude}, ${formData.longitude})`
                : 'Allow Live Location (browser will ask permission)'}
            </button>

            {locationError && <p className="text-red-400 text-sm">{locationError}</p>}
            {formError && <p className="text-red-400 text-sm">{formError}</p>}

            <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white mb-1">Order Summary</p>
              <p>{cartItems.length} item(s)</p>
              <p className="text-lg font-bold text-white mt-2">Subtotal: ₹{subtotal}</p>
              <p className="text-xs text-slate-400 mt-2">
                Note: Delivery details are intended to be stored in backend only after payment confirmation.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold hover:shadow-2xl hover:shadow-cyan-500/40 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
              Proceed to Payment
            </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
