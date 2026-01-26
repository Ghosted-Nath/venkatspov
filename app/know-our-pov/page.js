'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const CosmosBackground = dynamic(
  () => import('../components/CosmosBackground'),
  { ssr: false }
);

export default function KnowOurPOV() {
  return (
    <>
      <CosmosBackground />

      <main className="relative z-10 min-h-screen text-white px-6 py-24 max-w-4xl mx-auto">

        {/* INTRO */}
        <section className="mb-24 text-center">
          <p className="text-xs tracking-[0.35em] text-slate-400 mb-4">
            KNOW OUR POV
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            This is not a brand.<br />It’s a perspective.
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Venkat’s POV exists at the intersection of art,
            technology, and thought. Built slowly. Shared honestly.
          </p>
        </section>

        {/* WHAT IT IS NOT */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold mb-4">
            What this is not
          </h2>

          <ul className="space-y-3 text-slate-400">
            <li>• Not trend-driven</li>
            <li>• Not mass-produced</li>
            <li>• Not rushed for visibility</li>
          </ul>
        </section>

        {/* WHAT IT IS */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold mb-4">
            What it is
          </h2>

          <p className="text-slate-400 leading-relaxed mb-6">
            A living space for original ideas — sketches,
            concepts, and experiments that evolve over time.
          </p>

          <p className="text-slate-400 leading-relaxed">
            Every work begins with intent, not a brief.
            The process matters as much as the final form.
          </p>
        </section>

        {/* PROCESS */}
        <section className="mb-28">
          <h2 className="text-xl font-semibold mb-4">
            How things are built here
          </h2>

          <p className="text-slate-400 leading-relaxed">
            Ideas are sketched, questioned, broken,
            rebuilt — sometimes abandoned.
            What survives earns its place.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-slate-400 mb-6">
            Want to see how this POV translates into work?
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/explore"
              className="px-8 py-3 rounded-full
                         bg-gradient-to-r from-cyan-500 to-purple-600
                         font-semibold transition hover:scale-105"
            >
              Explore
            </Link>

            <Link
              href="/store"
              className="px-8 py-3 rounded-full
                         border border-white/15
                         hover:bg-white/5 transition"
            >
              Visit Store
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
