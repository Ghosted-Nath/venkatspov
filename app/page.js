'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const DashavatarGold = dynamic(
  () => import('./components/DashavatarGold'),
  {
    ssr: false,
    loading: () => null,
  }
);

// Cosmos background (client-only)
const CosmosBackground = dynamic(
  () => import('./components/CosmosBackground'),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-slate-950" />,
  }
);

export default function VenkatsPOV() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  // Throttled mouse move (already good)
  useEffect(() => {
    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Background */}
      <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
        <CosmosBackground />
      </Suspense>

      <div className="relative min-h-screen text-white overflow-hidden">

        {/* NAVIGATION */}
        <nav className="relative z-20 px-4 sm:px-6 md:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

            {/* LOGO */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <img
                src="/venkatspov.png"
                alt="Venkat's POV"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                draggable="false"
              />
              <span className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                Venkat&apos;s POV
              </span>
            </div>

            {/* NAV BUTTONS — ALWAYS PRESENT, SCALE DOWN */}
<div className="flex items-center gap-2 sm:gap-3 md:gap-4">

  {/* SERVICES → REAL PAGE */}
  <Link
    href="/services"
    className="
      px-3 py-1.5
      sm:px-4 sm:py-2
      md:px-6 md:py-2.5
      text-xs sm:text-sm
      font-semibold rounded-full
      bg-white/5 backdrop-blur-md
      border border-white/15
      hover:bg-white/10
      transition-all duration-300
      whitespace-nowrap
    "
  >
    Services
  </Link>

  {/* STORE → COMING SOON */}
  <span
    className="
      px-3 py-1.5
      sm:px-4 sm:py-2
      md:px-6 md:py-2.5
      text-xs sm:text-sm
      font-semibold rounded-full
      border border-white/10
      text-slate-500
      cursor-not-allowed
      whitespace-nowrap
    "
  >
    Store
  </span>

  {/* CART → COMING SOON */}
  <span
    className="
      px-3 py-1.5
      sm:px-4 sm:py-2
      md:px-6 md:py-2.5
      text-xs sm:text-sm
      font-semibold rounded-full
      border border-white/10
      text-slate-500
      cursor-not-allowed
      whitespace-nowrap
    "
  >
    Cart
  </span>
</div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative z-10 px-6 pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT TEXT */}
            <div className="space-y-8">
              <h2 className="font-bold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Crafting
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  perspective
                </span>
                <br />
                <p className="mt-6 text-xs tracking-[0.25em] text-slate-300">
                  ART × TECHNOLOGY × VISION
                </p>
              </h2>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
                Pushing boundaries and redefining possibilities.
                A space for original art, ideas, and experiments.
              </p>

              {/* CTA BUTTONS — MOBILE SAFE */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
                <Link
                  href="/explore"
                  className="
                    w-full sm:w-auto
                    px-5 py-3
                    sm:px-8 sm:py-4
                    text-sm sm:text-base
                    font-semibold text-center
                    rounded-full
                    bg-gradient-to-r from-cyan-500 to-purple-600
                    transition-transform hover:scale-[1.02]
                  "
                >
                  Explore Now
                </Link>

                <Link
                  href="/know-our-pov"
                  className="
                    w-full sm:w-auto
                    px-5 py-3
                    sm:px-6 sm:py-3
                    text-sm sm:text-base
                    font-semibold text-center
                    rounded-full
                    bg-white/5 backdrop-blur-md
                    border border-white/15
                    hover:bg-white/10
                    transition-all duration-300
                  "
                >
                  Know our POV
                </Link>
              </div>
            </div>

            {/* RIGHT — DASHAVATAR (FIXED CENTERING) */}
            <div
              className="
                relative w-full
                min-h-[300px] sm:min-h-[420px] md:min-h-[520px]
                flex items-center justify-center
              "
            >
              {/* Glow */}
              <div className="
                absolute w-[260px] h-[260px]
                sm:w-[360px] sm:h-[360px]
                md:w-[420px] md:h-[420px]
                rounded-full bg-yellow-400/30 blur-[120px]
              " />

              {/* LOCKED CENTER CANVAS */}
              <div className="absolute inset-0 flex items-center justify-center">
                <DashavatarGold />
              </div>
            </div>

          </div>
        </section>

        {/* EDITORIAL */}
        <section className="relative z-10 mt-24 px-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">
            Crafted with intention
          </p>

          <h3 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            Where art meets engineering
          </h3>

          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Venkat’s POV is a living space for sketches, visual stories,
            and technology-driven ideas — shared as they evolve, not when
            they’re perfect.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="relative z-10 px-8 py-12 border-t border-white/10 text-center text-slate-400 mt-24">
          © 2026 Venkat&apos;s POV. All rights reserved.
        </footer>

      </div>
    </>
  );
}
