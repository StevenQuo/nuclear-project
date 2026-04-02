'use client';

import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type StoredUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

type StoredSupplierProfile = {
  id: number;
  user_id: number;
  business_name: string;
  phone?: string | null;
  address?: string | null;
  status?: string;
};

type FormState = {
  name: string;
  email: string;
  businessName: string;
  address: string;
  phone: string;
};

function readUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem('nuclear_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function readSupplierProfile(): StoredSupplierProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem('nuclear_supplier_profile');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSupplierProfile;
  } catch {
    return null;
  }
}

export default function EditProfilePage() {
  const [user] = useState<StoredUser | null>(() => readUser());
  const [supplierProfile] = useState<StoredSupplierProfile | null>(() => readSupplierProfile());

  const [form, setForm] = useState<FormState>(() => ({
    name: user?.name ?? '',
    email: user?.email ?? '',
    businessName: supplierProfile?.business_name ?? '',
    address: (supplierProfile?.address ?? user?.address ?? '') || '',
    phone: (supplierProfile?.phone ?? user?.phone ?? '') || '',
  }));

  const canShowBusinessName = Boolean(supplierProfile);
  const canSave = useMemo(() => form.name.trim().length > 0 && form.email.trim().length > 0, [form.email, form.name]);

  const onSave = () => {
    if (!canSave) return;

    const nextUser: StoredUser = {
      id: user?.id ?? 0,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
    };

    window.localStorage.setItem('nuclear_user', JSON.stringify(nextUser));
    window.dispatchEvent(new Event('nuclear-user-change'));

    if (supplierProfile) {
      const nextSupplier: StoredSupplierProfile = {
        ...supplierProfile,
        business_name: form.businessName.trim() || supplierProfile.business_name,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
      };
      window.localStorage.setItem('nuclear_supplier_profile', JSON.stringify(nextSupplier));
    }

    window.location.href = '/profile';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-6 pt-12 pb-6 text-center font-extrabold tracking-widest">PROFILE</div>

      <div className="bg-surface-2 rounded-b-[40px] px-6 pb-10">
        <div className="flex justify-center pt-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-surface border border-border overflow-hidden flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center text-muted-2 text-sm">Photo</div>
            </div>
            <button
              type="button"
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center border border-border shadow-sm"
              aria-label="Edit photo"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 pb-[calc(96px+env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-sm font-bold">Nama</div>
            <div className="flex items-center gap-3 mt-1">
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="flex-1 bg-transparent text-muted-2 text-lg focus:outline-none"
                placeholder="Nama"
              />
              <Pencil size={16} className="text-muted-2" />
            </div>
            <div className="h-px bg-border mt-2" />
          </div>

          <div>
            <div className="text-sm font-bold">Email</div>
            <div className="flex items-center gap-3 mt-1">
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="flex-1 bg-transparent text-muted-2 text-lg focus:outline-none"
                placeholder="Email"
              />
              <Pencil size={16} className="text-muted-2" />
            </div>
            <div className="h-px bg-border mt-2" />
          </div>

          <div className={`${canShowBusinessName ? '' : 'opacity-50'}`}>
            <div className="text-sm font-bold">Nama Usaha</div>
            <div className="flex items-center gap-3 mt-1">
              <input
                value={form.businessName}
                onChange={(e) => setForm((p) => ({ ...p, businessName: e.target.value }))}
                className="flex-1 bg-transparent text-muted-2 text-lg focus:outline-none"
                placeholder={canShowBusinessName ? 'Nama Usaha' : 'Buat Supplier Account dulu'}
                disabled={!canShowBusinessName}
              />
              <Pencil size={16} className="text-muted-2" />
            </div>
            <div className="h-px bg-border mt-2" />
          </div>

          <div>
            <div className="text-sm font-bold">Alamat</div>
            <div className="flex items-center gap-3 mt-1">
              <input
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                className="flex-1 bg-transparent text-muted-2 text-lg focus:outline-none"
                placeholder="Alamat"
              />
              <Pencil size={16} className="text-muted-2" />
            </div>
            <div className="h-px bg-border mt-2" />
          </div>

          <div>
            <div className="text-sm font-bold">No Telfon</div>
            <div className="flex items-center gap-3 mt-1">
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="flex-1 bg-transparent text-muted-2 text-lg focus:outline-none"
                placeholder="No Telfon"
                inputMode="tel"
              />
              <Pencil size={16} className="text-muted-2" />
            </div>
            <div className="h-px bg-border mt-2" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave}
            className={`w-full rounded-full py-4 text-base font-bold ${
              canSave ? 'bg-primary text-primary-foreground' : 'bg-surface-2 text-muted-2 border border-border'
            }`}
          >
            Simpan
          </button>

          <Link
            href="/"
            className="w-full rounded-full py-4 text-base font-bold bg-primary text-primary-foreground text-center"
          >
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

