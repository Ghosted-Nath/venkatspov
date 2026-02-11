'use client';

import { useEffect, useRef } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  const cursorRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const animate = () => {
      const cursor = cursorRef.current;
      if (cursor) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.22;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.22;

        cursor.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', move);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <html lang="en">
      <body>
        {/* GLOBAL CURSOR */}
        <div
          ref={cursorRef}
          className="fixed w-6 h-6 rounded-full border-2 border-cyan-400
                     pointer-events-none z-50 will-change-transform"
          style={{ transform: 'translate(-50%, -50%)' }}
        />

        {children}
      </body>
    </html>
  );
}
