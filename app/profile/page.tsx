'use client';

import { Bell, ChevronRight, Headset, Moon, Store, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useSyncExternalStore, useState } from 'react';

type StoredUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

export default function ProfilePage() {
  const [user] = useState<StoredUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem('nuclear_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  });

  const theme = useSyncExternalStore(
    (onStoreChange) => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === 'nuclear_theme') onStoreChange();
      };
      const onCustom = () => onStoreChange();
      window.addEventListener('storage', onStorage);
      window.addEventListener('nuclear-theme-change', onCustom as EventListener);
      return () => {
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('nuclear-theme-change', onCustom as EventListener);
      };
    },
    () => window.localStorage.getItem('nuclear_theme') ?? '',
    () => ''
  );

  const darkMode = theme === 'dark';
  const toggleDarkMode = () => {
    const next = darkMode ? 'light' : 'dark';
    window.localStorage.setItem('nuclear_theme', next);
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new Event('nuclear-theme-change'));
  };

  const displayName = useMemo(() => user?.name ?? 'Guest', [user?.name]);
  const displayEmail = useMemo(() => user?.email ?? 'Belum login', [user?.email]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-[calc(96px+env(safe-area-inset-bottom))]">
      <div className="px-6 pt-12 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-surface-2 flex items-center justify-center border border-border">
            <UserCircle2 size={34} className="text-muted-2" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold truncate">{displayName}</div>
            <div className="text-sm text-muted truncate">{displayEmail}</div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="bg-background">
          <button className="w-full px-6 py-4 flex items-center justify-between border-b border-border active:bg-surface-2">
            <div className="flex items-center gap-3">
              <UserCircle2 size={20} className="text-muted" />
              <span className="text-sm font-semibold">Change Profile</span>
            </div>
            <ChevronRight size={18} className="text-muted-2" />
          </button>

          <Link
            href="/supplier-account/create"
            className="w-full px-6 py-4 flex items-center justify-between border-b border-border active:bg-surface-2"
          >
            <div className="flex items-center gap-3">
              <Store size={20} className="text-muted" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Switch to Supplier Account</span>
                <span className="text-xs text-muted">Buat akun supplier & verifikasi</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-2" />
          </Link>

          <button className="w-full px-6 py-4 flex items-center justify-between border-b border-border active:bg-surface-2">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-muted" />
              <span className="text-sm font-semibold">Notification</span>
            </div>
            <ChevronRight size={18} className="text-muted-2" />
          </button>

          <Link
            href="/chat/customer-service"
            className="w-full px-6 py-4 flex items-center justify-between border-b border-border active:bg-surface-2"
          >
            <div className="flex items-center gap-3">
              <Headset size={20} className="text-muted" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Customer Service</span>
                <span className="text-xs text-muted">Template pertanyaan & live service</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-2" />
          </Link>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-full px-6 py-4 flex items-center justify-between border-b border-border active:bg-surface-2"
          >
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-muted" />
              <span className="text-sm font-semibold">Dark Mode</span>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                darkMode ? 'bg-primary' : 'bg-surface-2'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        <div className="px-6 pt-6">
          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem('nuclear_user');
              window.location.href = '/register';
            }}
            className="w-full rounded-full py-4 bg-surface-2 text-foreground font-bold border border-border"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
