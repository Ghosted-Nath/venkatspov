'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const CosmosBackground = dynamic(
  () => import('../components/CosmosBackground'),
  { ssr: false }
);

const services = [
  {
    title: 'Video Editing',
    description: 'Cinematic edits, reels & storytelling visuals.',
    href: '/services/video-editing',
    status: 'Coming Soon'
  },
  {
    title: 'Web Development',
    description: 'Modern, performance-focused websites.',
    href: '/services/web-development',
    status: 'Coming Soon'
  },
  {
    title: 'Custom Sketch',
    description: 'Original hand-drawn & digital artworks.',
    href: '/services/custom-sketch',
    status: 'Coming Soon'
  }
];

export default function ServicesPage() {
  return (
    <>
      <CosmosBackground />

      <main className="relative z-10 min-h-screen px-6 py-28 max-w-6xl mx-auto text-white">
        
        {/* HEADER */}
        <section className="text-center mb-20">
          <p className="text-xs tracking-[0.35em] text-slate-400 mb-4">
            SERVICES
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            What I build & offer
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Thoughtful services built with the same intent as the art.
            No templates. No rush.
          </p>
        </section>

        {/* CARDS */}
        <section className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="
                group relative rounded-3xl
                border border-white/10
                bg-white/5 backdrop-blur-md
                p-8
                transition-all duration-300
                hover:bg-white/10
              "
            >
              {/* COMING SOON BADGE */}
              <span className="
                absolute top-4 right-4
                text-xs px-3 py-1 rounded-full
                border border-white/20
                text-slate-300
              ">
                {service.status}
              </span>

              <h2 className="text-2xl font-semibold mb-4 group-hover:text-cyan-300 transition">
                {service.title}
              </h2>

              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </Link>
          ))}
        </section>

      </main>
    </>
  );
}
