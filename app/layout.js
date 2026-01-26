'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) =>
      setMousePos({ x: e.clientX, y: e.clientY });

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <html lang="en">
      <body>
        {/* GLOBAL CURSOR */}
        <div
          className="fixed w-6 h-6 rounded-full border-2 border-cyan-400
                     pointer-events-none z-50"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: 'translate(-50%, -50%)'
          }}
        />

        {children}
      </body>
    </html>
  );
}
