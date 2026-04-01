'use client';

import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

type StoredUser = {
  id: number;
  name: string;
  email: string;
};

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  const storedUserRaw = useSyncExternalStore(
    (onStoreChange) => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === 'nuclear_user') onStoreChange();
      };
      const onCustom = () => onStoreChange();
      window.addEventListener('storage', onStorage);
      window.addEventListener('nuclear-user-change', onCustom as EventListener);
      return () => {
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('nuclear-user-change', onCustom as EventListener);
      };
    },
    () => window.localStorage.getItem('nuclear_user') ?? '',
    () => ''
  );

  const computedUserName = (() => {
    if (!storedUserRaw) return 'Adhipanna';
    try {
      const parsed = JSON.parse(storedUserRaw) as StoredUser;
      return parsed?.name ?? 'Adhipanna';
    } catch {
      return 'Adhipanna';
    }
  })();
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
    window.dispatchEvent(new Event('nuclear-user-change'));
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
          <span className="text-sm font-medium text-black">{computedUserName}</span>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white/50 shadow-sm">
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-lg">
              👤
            </div>
          </div>
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute right-0 mt-3 w-44 bg-surface rounded-2xl border border-border shadow-[0_18px_45px_rgba(0,0,0,0.18)] overflow-hidden z-50"
          >
            <Link
              href="/profile"
              role="menuitem"
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface-2"
              onClick={() => setOpen(false)}
            >
              <Settings size={18} className="text-muted" />
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-surface-2"
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
