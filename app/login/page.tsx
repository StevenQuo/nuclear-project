'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function LoginPage() {
  const [payload, setPayload] = useState<LoginPayload>({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isValid = useMemo(() => {
    return payload.email.trim().length > 0 && payload.password.trim().length > 0;
  }, [payload.email, payload.password]);

  const onSubmit = async () => {
    if (!isValid || status === 'submitting') return;
    setStatus('submitting');
    setMessage('');

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as LoginErrorResponse | null;
        const firstError =
          json?.message ??
          (json?.errors ? Object.values(json.errors)?.flat()?.[0] : null) ??
          `Login failed (${res.status})`;
        throw new Error(firstError);
      }

      const json = (await res.json().catch(() => null)) as { data?: unknown } | null;
      const user = (json?.data ?? null) as
        | { id: number; name: string; email: string; phone?: string | null; address?: string | null }
        | null;

      if (user) {
        window.localStorage.setItem('nuclear_user', JSON.stringify(user));
        window.dispatchEvent(new Event('nuclear-user-change'));
      }

      window.location.href = '/';
    } catch (e) {
      setStatus('error');
      setMessage(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    } finally {
      setStatus((prev) => (prev === 'submitting' ? 'idle' : prev));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-[0_18px_50px_rgba(0,0,0,0.18)] border border-border px-7 pt-10 pb-10">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black tracking-tight text-primary">NuClear</div>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          <input
            value={payload.email}
            onChange={(e) => setPayload((p) => ({ ...p, email: e.target.value }))}
            placeholder="Username..."
            className="w-full bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={payload.password}
            onChange={(e) => setPayload((p) => ({ ...p, password: e.target.value }))}
            placeholder="Password..."
            type="password"
            className="w-full bg-background border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <Link href="#" className="text-xs text-muted font-semibold ml-6 -mt-2">
            Lupa password
          </Link>
        </div>

        {message ? <div className="mt-4 text-sm text-red-500">{message}</div> : null}

        <div className="mt-10 flex flex-col gap-4">
          <Link
            href="/register"
            className="w-full rounded-full py-4 text-base font-extrabold tracking-wide shadow-sm bg-[#A5A5A5] hover:bg-[#8F8F8F] text-white text-center"
          >
            DAFTAR
          </Link>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!isValid || status === 'submitting'}
            className={`w-full rounded-full py-4 text-base font-extrabold tracking-wide shadow-sm transition-colors ${
              !isValid || status === 'submitting'
                ? 'bg-primary/50 text-primary-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

