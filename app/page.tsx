import { MapPin, Star } from 'lucide-react';
import { fetchSuppliers, type Supplier } from './services/suppliers';
import HomeHeader from './components/HomeHeader';

export default async function Home() {
  let suppliers: Supplier[] = [];

  try {
    suppliers = await fetchSuppliers();
  } catch {
    suppliers = [];
  }

  const supplierCards =
    suppliers.length > 0
      ? suppliers
      : [
          {
            id: 0,
            name: 'Steven Bakery',
            address: 'Jl. Antasura 12, Denpasar Bali',
            latitude: null,
            longitude: null,
            rating: 5,
          },
        ];

  return (
    <div className="flex flex-col min-h-screen bg-white pb-[calc(96px+env(safe-area-inset-bottom))]">
      {/* Header Section */}
      <header className="bg-primary rounded-b-[40px] px-6 pt-12 pb-10">
        <HomeHeader />

        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Telusuri putih telur terdekat...."
            className="w-full bg-white rounded-full py-4 px-6 pr-32 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:outline-none placeholder:text-gray-400"
          />
          <button className="absolute right-2 bg-[#7C7DB1] text-white px-7 py-2.5 rounded-full text-sm font-medium hover:bg-[#6A6B9D] transition-colors shadow-sm">
            Telusuri
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 flex flex-col gap-8">
        {/* Promo Banner */}
        <section className="relative w-full h-48 rounded-3xl overflow-hidden shadow-md group cursor-pointer">
          <div className="absolute inset-0 bg-[#008B8B]">
            <div className="absolute right-0 top-0 w-1/2 h-full p-6 flex flex-col justify-center text-white z-10">
              <h3 className="text-xl font-bold leading-tight mb-2">DAPATKAN POIN!</h3>
              <p className="text-[10px] leading-relaxed mb-4 opacity-90">
                Kumpulkan Poin Setiap Pembelian Putih Telur & TUKAR VOUCHER!
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[8px] border border-white/50 px-2 py-0.5 rounded-full">S&K Berlaku</span>
              </div>
            </div>
            {/* Placeholder for the person image */}
            <div className="absolute left-0 bottom-0 w-1/2 h-full bg-gray-200">
               <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                 Promo Image
               </div>
            </div>
          </div>
        </section>

        {/* Nearby Supplier */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Supplier Terdekat</h2>
          </div>

          <div className="flex flex-col gap-4">
            {supplierCards.slice(0, 3).map((supplier) => {
              const rating = typeof supplier.rating === 'number' ? supplier.rating : 0;
              const filled = Math.max(0, Math.min(5, Math.round(rating)));

              return (
                <div
                  key={supplier.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
                >
                  <div className="relative h-48 w-full bg-gray-100">
                    <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                      Product Image
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((i) => {
                            const isFilled = i <= filled;
                            return (
                              <Star
                                key={i}
                                size={14}
                                className={isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-400">
                      <MapPin size={14} />
                      <span className="text-xs">{supplier.address}</span>
                    </div>

                    <div className="flex justify-end">
                      <button className="bg-[#7C7DB1] text-white px-6 py-2.5 rounded-2xl text-sm font-medium hover:bg-[#6A6B9D] transition-colors">
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
