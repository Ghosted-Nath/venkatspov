'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const CosmosBackground = dynamic(
  () => import('../components/CosmosBackground'),
  { ssr: false }
);

export default function ExplorePage() {
  return (
    <>
      <CosmosBackground />

      <main className="relative z-10 min-h-screen text-white px-6 py-24 max-w-5xl mx-auto">

        {/* HEADER */}
        <section className="mb-20 text-center">
          <p className="text-xs tracking-[0.35em] text-slate-400 mb-4">
            EXPLORE THE POV
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Thoughts, sketches & experiments
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto">
            This is an evolving space where ideas take shape —
            shared openly, refined slowly, and released with intention.
          </p>
        </section>

        {/* FEATURED WORK */}
<section className="mb-32">
  <div className="grid md:grid-cols-2 gap-12 items-start">

    {/* ARTWORK */}
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-black">
      <img
        src="works/dashavatar.webp"
        alt="Dashavatar artwork"
        className="w-full h-auto object-contain"
      />
    </div>

    {/* EXPLANATION */}
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
        Original Work
      </p>

      <h2 className="text-3xl font-semibold mb-6">
        Dashavatar - Unity in Form
      </h2>

      <p className="text-slate-400 leading-relaxed mb-6">
        This artwork represents all ten avatars of Vishnu merged into a single
        evolving presence — not as separate incarnations, but as one unified
        consciousness responding to time, imbalance, and change.
      </p>

      <ul className="space-y-3 text-slate-400 leading-relaxed text-sm">
        <li>• Matsya — origin and continuity (lower body)</li>
        <li>• Kurma — unseen support (tortoise behind)</li>
        <li>• Varaha — restoration (face)</li>
        <li>• Narasimha — controlled fury (beard)</li>
        <li>• Vamana — humility and scale (umbrella)</li>
        <li>• Parashurama — correction through force (axe)</li>
        <li>• Rama — moral precision (bow & arrows)</li>
        <li>• Krishna — play and guidance (flute & feather)</li>
        <li>• Buddha — inner stillness (tied hair)</li>
        <li>• Kalki — inevitability of change (white horse)</li>
      </ul>

      <a
        href="/store"
        className="inline-block mt-10 px-8 py-4 rounded-full
                   bg-gradient-to-r from-cyan-500 to-purple-600
                   font-semibold transition hover:scale-105"
      >
        View in Store →
      </a>
    </div>

  </div>
</section>

<section className="mb-32">
  <div className="grid md:grid-cols-2 gap-12 items-start">

    {/* ARTWORK */}
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-black">
      <img
        src="works/navratri-mockup.webp"
        alt="Navratri artwork"
        className="w-full h-auto object-contain"
      />
    </div>

    {/* EXPLANATION */}
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
        Original Work
      </p>

      <h2 className="text-3xl font-semibold mb-6">
        Navroop • Navrang - The Nine Nights of Shakti
      </h2>

      <p className="text-slate-400 leading-relaxed mb-6">
        This original collection presents the nine forms of Maa Durga through the Navroop Navrang concept, where each form is expressed through its sacred colour. Together, the nine artworks function as a single visual cycle - unfolding strength, devotion, protection, and balance across the nine nights of Navratri.
      </p>

      <ul className="space-y-3 text-slate-400 leading-relaxed text-sm">
        <li>• Shailaputri — grounding and purity (yellow)</li>
        <li>• Brahmacharini — devotion and endurance (green)</li>
        <li>• Chandraganta — courage and protection (grey)</li>
        <li>• Kushmanda — creation and vitality (orange)</li>
        <li>• Skandamata — nurturing strength (white)</li>
        <li>• Katyayani — righteous power (red)</li>
        <li>• Kalaratri — destruction of fear (blue)</li>
        <li>• Mahagauri — clarity and peace (pink)</li>
        <li>• Siddhidhatri — completion and balance (purple)</li>
      </ul>

      <a
        href="/store"
        className="inline-block mt-10 px-8 py-4 rounded-full
                   bg-gradient-to-r from-cyan-500 to-purple-600
                   font-semibold transition hover:scale-105"
      >
        View in Store →
      </a>
    </div>

  </div>
</section>

        {/* JOURNAL */}
        <section className="space-y-16">

          <JournalItem
            date="Jan 2026"
            title="Why I don’t rush releases"
            text="Speed creates noise. Time creates meaning.
                  This project is intentionally slow — to preserve clarity."
          />

          <JournalItem
            date="Dec 2025"
            title="On building Venkat’s POV"
            text="This isn’t a brand built to scale fast.
                  It’s built to stay honest."
          />

          <JournalItem
            date="Nov 2025"
            title="Art × Technology isn’t a buzzword"
            text="When tools disappear, expression becomes clear.
                  That’s the goal."
          />

        </section>

        {/* FOOTER CTA */}
        <section className="mt-32 text-center">
          <p className="text-slate-400 mb-6">
            Curious to explore the work itself?
          </p>

          <Link
            href="/store"
            className="px-10 py-4 rounded-full border border-white/15
                       hover:bg-white/5 transition"
          >
            Visit the Store
          </Link>
        </section>

      </main>
    </>
  );
}

function JournalItem({ date, title, text }) {
  return (
    <div className="border-l border-white/10 pl-6">
      <p className="text-xs text-slate-400 mb-2">{date}</p>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed max-w-xl">{text}</p>
    </div>
  );
}
