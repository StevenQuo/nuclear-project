'use client';

import { Bell, ChevronRight, Moon, Store, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('nuclear_theme') === 'dark';
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      const theme = next ? 'dark' : 'light';
      window.localStorage.setItem('nuclear_theme', theme);
      document.documentElement.dataset.theme = theme;
      return next;
    });
  };

  const displayName = useMemo(() => user?.name ?? 'Guest', [user?.name]);
  const displayEmail = useMemo(() => user?.email ?? 'Belum login', [user?.email]);

  return (
    <div className="min-h-screen bg-white pb-[calc(96px+env(safe-area-inset-bottom))]">
      <div className="px-6 pt-12 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <UserCircle2 size={34} className="text-gray-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold text-black truncate">{displayName}</div>
            <div className="text-sm text-gray-500 truncate">{displayEmail}</div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="bg-white">
          <button className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 active:bg-gray-50">
            <div className="flex items-center gap-3">
              <UserCircle2 size={20} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-900">Change Profile</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>

          <Link
            href="/supplier-account/create"
            className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Store size={20} className="text-gray-500" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">Switch to Supplier Account</span>
                <span className="text-xs text-gray-500">Buat akun supplier & verifikasi</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>

          <button className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 active:bg-gray-50">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-900">Notification</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-900">Dark Mode</span>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                darkMode ? 'bg-primary' : 'bg-gray-200'
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
            className="w-full rounded-full py-4 bg-gray-100 text-gray-700 font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
