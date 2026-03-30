'use client';

import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

type RegisterPayload = {
  category: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

type RegisterErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function RegisterPage() {
  const [payload, setPayload] = useState<RegisterPayload>({
    category: 'Konsumen',
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const isValid = useMemo(() => {
    return (
      payload.name.trim().length > 0 &&
      payload.email.trim().length > 0 &&
      payload.password.trim().length >= 8
    );
  }, [payload]);

  const setField = <K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (!isValid || status === 'submitting') return;
    setStatus('submitting');
    setMessage('');

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

    try {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          category: payload.category,
          name: payload.name,
          email: payload.email,
          phone: payload.phone || null,
          address: payload.address || null,
          password: payload.password,
        }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as RegisterErrorResponse | null;
        const firstError =
          json?.message ??
          (json?.errors ? Object.values(json.errors)?.flat()?.[0] : null) ??
          `Register failed (${res.status})`;
        throw new Error(firstError);
      }

      setStatus('success');
      setMessage('Registrasi berhasil.');
      window.location.href = '/';
    } catch (e) {
      setStatus('error');
      setMessage(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_18px_50px_rgba(0,0,0,0.18)] border border-gray-100 px-7 pt-8 pb-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black tracking-tight text-[#F6B100]">NuClear</div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600 font-medium">Pilih Kategori</div>

        <div className="mt-2 relative">
          <select
            value={payload.category}
            onChange={(e) => setField('category', e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-full px-6 py-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="Konsumen">Konsumen</option>
            <option value="Supplier">Supplier</option>
          </select>
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
            <ChevronDown size={20} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <input
            value={payload.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Nama Lengkap"
            className="w-full bg-white border border-gray-300 rounded-full px-6 py-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full bg-white border border-gray-300 rounded-full px-6 py-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="No Telfon"
            inputMode="tel"
            className="w-full bg-white border border-gray-300 rounded-full px-6 py-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.address}
            onChange={(e) => setField('address', e.target.value)}
            placeholder="Alamat..."
            className="w-full bg-white border border-gray-300 rounded-full px-6 py-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder="Password..."
            type="password"
            className="w-full bg-white border border-gray-300 rounded-full px-6 py-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
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
