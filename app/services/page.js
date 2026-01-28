'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Film, Code, Brush, ArrowRight, Sparkles } from 'lucide-react';

const CosmosBackground = dynamic(
  () => import('../components/CosmosBackground'),
  { 
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-slate-950" />
  }
);

const services = [
  {
    title: 'Video Editing',
    description: 'Cinematic edits, reels & storytelling visuals.',
    icon: Film,
    href: '/services/video-editing',
    status: 'Coming Soon',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'hover:border-purple-400/50'
  },
  {
    title: 'Web Development',
    description: 'Modern, performance-focused websites.',
    icon: Code,
    href: '/services/web-development',
    status: 'Coming Soon',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-400/50'
  },
  {
    title: 'Custom Sketch',
    description: 'Original hand-drawn & digital artworks.',
    icon: Brush,
    href: '/services/custom-sketch',
    status: 'Coming Soon',
    gradient: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    borderColor: 'hover:border-amber-400/50'
  }
];

export default function ServicesPage() {
  return (
    <>
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
              <span className="font-medium">← Home</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-cyan-400" />
              <span className="font-semibold">Services</span>
            </div>
          </div>
        </nav>

        <main className="relative z-10 px-6 py-16 md:py-28 max-w-7xl mx-auto">
          
          {/* HEADER */}
          <section className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <Sparkles size={16} className="text-cyan-400" />
              <p className="text-xs tracking-[0.25em] text-slate-300 uppercase">
                Services
              </p>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
              What I build & offer
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Thoughtful services built with the same intent as the art.
              <br />
              No templates. No rush.
            </p>
          </section>

          {/* CARDS */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className={`
                    group relative rounded-2xl
                    border border-white/10 ${service.borderColor}
                    bg-slate-800/30 backdrop-blur-md
                    p-8
                    transition-all duration-500
                    hover:transform hover:scale-[1.02]
                    hover:shadow-2xl hover:shadow-cyan-500/10
                    cursor-pointer
                    overflow-hidden
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    
                    {/* Icon */}
                    <div className="mb-6 flex items-start justify-between">
                      <div className={`
                        w-14 h-14 rounded-xl
                        bg-white/5 border border-white/10
                        flex items-center justify-center
                        group-hover:scale-110 group-hover:rotate-3
                        transition-all duration-500
                      `}>
                        <Icon size={28} className={service.iconColor} />
                      </div>
                      
                      {/* COMING SOON BADGE */}
                      <span className="
                        text-xs px-3 py-1.5 rounded-full
                        bg-slate-900/50 border border-white/20
                        text-slate-300
                        backdrop-blur-sm
                      ">
                        {service.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                      {service.title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate-400 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Learn More Link */}
                    <div className="flex items-center gap-2 text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="font-medium">Learn more</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              );
            })}
          </section>

          {/* Bottom CTA */}
          <section className="mt-20 text-center">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-3">Have a project in mind?</h3>
              <p className="text-slate-400 mb-6 max-w-md">
                Let's create something unique together. Get in touch to discuss your vision.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
              >
                Get in Touch
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
            <p className="text-sm">© 2026 Venkat's POV. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}