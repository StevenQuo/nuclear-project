type VoucherPromo = {
  id: string;
  title: string;
  subtitle: string;
  code: string;
};

const promos: VoucherPromo[] = [
  {
    id: 'promo-1',
    title: 'GRATIS ONGKIR!',
    subtitle: 'MINIMAL BELI 3 LITER PUTIH TELUR',
    code: 'KIRIMYUK24',
  },
  {
    id: 'promo-2',
    title: 'GRATIS ONGKIR!',
    subtitle: 'MINIMAL BELI 3 LITER PUTIH TELUR',
    code: 'KIRIMYUK24',
  },
];

function VoucherCard({ promo }: { promo: VoucherPromo }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.10)] border border-gray-100">
      <div className="p-4">
        <div className="h-44 rounded-2xl overflow-hidden bg-[#0A7AA8] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_45%)]" />
          <div className="absolute inset-0 flex">
            <div className="w-[44%] p-2">
              <div className="w-full h-full rounded-xl bg-gray-200 overflow-hidden border border-white/40">
                <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-[10px] text-center px-3">
                  Promo Image
                </div>
              </div>
            </div>
            <div className="flex-1 px-3 py-4 flex flex-col justify-between text-white">
              <div>
                <div className="text-[34px] font-black leading-[0.95] tracking-tight drop-shadow-sm">
                  {promo.title}
                </div>
                <div className="mt-2 text-[14px] font-extrabold leading-tight tracking-tight drop-shadow-sm">
                  {promo.subtitle}
                </div>
              </div>
              <div className="text-[10px] font-semibold opacity-90 tracking-wide">
                *S&K BERLAKU* | KODE: {promo.code}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button className="w-full bg-primary text-white rounded-full py-4 text-base font-medium shadow-[0_8px_18px_rgba(0,0,0,0.10)] active:scale-[0.99] transition-transform">
          Gunakan Sekarang
        </button>
      </div>
    </div>
  );
}

export default function PromoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 pt-12 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-black">Promo</h1>
      </header>

      <main className="px-6 py-8 flex flex-col gap-6">
        {promos.map((promo) => (
          <VoucherCard key={promo.id} promo={promo} />
        ))}
      </main>
    </div>
  );
}
