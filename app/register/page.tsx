'use client';

import { useMemo, useState } from 'react';

type RegisterPayload = {
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

      const json = (await res.json().catch(() => null)) as { data?: unknown } | null;
      const user = (json?.data ?? null) as
        | { id: number; name: string; email: string; phone?: string | null; address?: string | null }
        | null;

      if (user) {
        window.localStorage.setItem('nuclear_user', JSON.stringify(user));
      }

      setStatus('success');
      setMessage('Registrasi berhasil.');
      window.location.href = '/profile';
    } catch (e) {
      setStatus('error');
      setMessage(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-[0_18px_50px_rgba(0,0,0,0.18)] border border-border px-7 pt-8 pb-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black tracking-tight text-[#F6B100]">NuClear</div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
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
