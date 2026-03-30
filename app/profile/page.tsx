'use client';

import Link from 'next/link';
import { useState } from 'react';

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

  return (
    <div className="min-h-screen bg-white px-6 pt-12 pb-[calc(96px+env(safe-area-inset-bottom))]">
      <h1 className="text-2xl font-bold text-black">Profile</h1>

      <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="text-sm text-gray-500 font-medium">Akun</div>
        <div className="mt-2 text-lg font-bold text-black">{user?.name ?? 'Guest'}</div>
        <div className="mt-1 text-sm text-gray-500">{user?.email ?? 'Belum login'}</div>
      </div>

      <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="text-sm text-gray-500 font-medium">Supplier Account</div>
        <div className="mt-2 text-base font-bold text-black">Belum dibuat</div>
        <div className="mt-1 text-sm text-gray-500">
          Buat akun supplier untuk mulai jualan, nanti akan masuk proses verifikasi.
        </div>

        <Link
          href="/supplier-account/create"
          className="mt-5 inline-flex items-center justify-center w-full rounded-full py-3.5 bg-primary text-black font-bold"
        >
          Buat Supplier Account
        </Link>
      </div>
    </div>
  );
}
