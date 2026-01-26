'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const CosmosBackground = dynamic(
  () => import('../../components/CosmosBackground'),
  { ssr: false }
);

export default function VideoEditingService() {
  return (
    <>
      <CosmosBackground />

      <main className="relative z-10 min-h-screen px-6 py-28 max-w-4xl mx-auto text-white">

        <Link
          href="/services"
          className="text-sm text-slate-400 hover:text-white transition"
        >
          ← Back to Services
        </Link>

        <section className="mt-12">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Video Editing
          </h1>

          <p className="text-slate-400 leading-relaxed mb-10">
            This service is currently in development.
            I’m refining workflows, visual language, and storytelling approach
            before opening it publicly.
          </p>

          <div className="
            inline-block px-6 py-3 rounded-full
            border border-white/15
            text-slate-300
          ">
            🚧 Coming Soon
          </div>
        </section>

      </main>
    </>
  );
}
