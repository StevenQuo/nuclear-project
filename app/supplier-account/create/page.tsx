'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type StoredUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

type SupplierPayload = {
  category: string;
  businessName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem('nuclear_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export default function CreateSupplierAccountPage() {
  const [user] = useState<StoredUser | null>(() => getStoredUser());
  const [payload, setPayload] = useState<SupplierPayload>(() => {
    const stored = getStoredUser();
    return {
      category: 'UMKM',
      businessName: '',
      name: stored?.name ?? '',
      email: stored?.email ?? '',
      phone: stored?.phone ?? '',
      address: stored?.address ?? '',
      password: '',
    };
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isValid = useMemo(() => {
    return (
      Boolean(user?.id) &&
      payload.businessName.trim().length > 0 &&
      payload.name.trim().length > 0 &&
      payload.email.trim().length > 0 &&
      payload.password.trim().length > 0
    );
  }, [payload, user?.id]);

  const setField = <K extends keyof SupplierPayload>(key: K, value: SupplierPayload[K]) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (!isValid || status === 'submitting' || !user?.id) return;
    setStatus('submitting');
    setMessage('');

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

    try {
      const res = await fetch(`${baseUrl}/api/supplier-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          category: payload.category,
          business_name: payload.businessName,
          phone: payload.phone || null,
          address: payload.address || null,
          password: payload.password,
        }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as ErrorResponse | null;
        const firstError =
          json?.message ??
          (json?.errors ? Object.values(json.errors)?.flat()?.[0] : null) ??
          `Create supplier account failed (${res.status})`;
        throw new Error(firstError);
      }

      setStatus('success');
      setMessage('Supplier account berhasil dibuat. Menunggu verifikasi.');
      window.location.href = '/profile';
    } catch (e) {
      setStatus('error');
      setMessage(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-[0_18px_50px_rgba(0,0,0,0.18)] border border-border px-7 pt-8 pb-10">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-black tracking-tight text-[#F6B100]">NuClear</div>
          <Link href="/profile" className="text-sm font-bold text-muted">
            Kembali
          </Link>
        </div>

        <div className="mt-6 text-sm text-muted font-medium">Pilih Kategori</div>

        <div className="mt-2 relative">
          <select
            value={payload.category}
            onChange={(e) => setField('category', e.target.value)}
            className="w-full appearance-none bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="UMKM">UMKM</option>
            <option value="Perusahaan">Perusahaan</option>
          </select>
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted">
            <ChevronDown size={20} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <input
            value={payload.businessName}
            onChange={(e) => setField('businessName', e.target.value)}
            placeholder="Nama Usaha"
            className="w-full bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Nama Lengkap"
            className="w-full bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="No Telfon"
            inputMode="tel"
            className="w-full bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.address}
            onChange={(e) => setField('address', e.target.value)}
            placeholder="Alamat..."
            className="w-full bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder="Password..."
            type="password"
            className="w-full bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {message ? (
          <div
            className={`mt-5 text-sm ${
              status === 'error' ? 'text-red-500' : status === 'success' ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {message}
          </div>
        ) : null}

        <button
          onClick={onSubmit}
          disabled={!isValid || status === 'submitting'}
          className={`mt-14 w-full rounded-full py-4 text-base font-extrabold tracking-wide shadow-sm transition-colors ${
            !isValid || status === 'submitting'
              ? 'bg-gray-300 text-white cursor-not-allowed'
              : 'bg-[#A5A5A5] hover:bg-[#8F8F8F] text-white'
          }`}
        >
          DAFTAR
        </button>
      </div>
    </div>
  );
}
