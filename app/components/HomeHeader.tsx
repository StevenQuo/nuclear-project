'use client';

import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type StoredUser = {
  id: number;
  name: string;
  email: string;
};

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  const [userName] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Adhipanna';
    const raw = window.localStorage.getItem('nuclear_user');
    if (!raw) return 'Adhipanna';
    try {
      const parsed = JSON.parse(raw) as StoredUser;
      return parsed?.name ?? 'Adhipanna';
    } catch {
      return 'Adhipanna';
    }
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const onLogout = () => {
    window.localStorage.removeItem('nuclear_user');
    window.location.href = '/register';
  };

  return (
    <div className="flex justify-between items-center mb-8" ref={containerRef}>
      <h1 className="text-2xl font-bold text-black tracking-tight">NuClear</h1>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="text-sm font-medium text-black">{userName}</span>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white/50 shadow-sm">
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-lg">
              👤
            </div>
          </div>
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute right-0 mt-3 w-44 bg-white rounded-2xl border border-gray-100 shadow-[0_18px_45px_rgba(0,0,0,0.18)] overflow-hidden z-50"
          >
            <Link
              href="/profile"
              role="menuitem"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <Settings size={18} className="text-gray-500" />
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} className="text-red-500" />
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
