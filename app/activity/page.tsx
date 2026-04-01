'use client';

import { MapPin, CheckCircle2, XCircle, Box } from 'lucide-react';
import { useState } from 'react';

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState('Riwayat');

  const historyActivities = [
    {
      id: 1,
      supplier: 'Steven Bakery',
      location: 'Jl. Antasura 12, Denpasar Bali',
      volume: '1 Liter',
      price: 'Rp.20.000',
      status: 'Terkirim',
      statusIcon: CheckCircle2,
      statusColor: 'text-gray-400',
    },
    {
      id: 2,
      supplier: 'Steven Bakery',
      location: 'Jl. Antasura 12, Denpasar Bali',
      volume: '1 Liter',
      price: 'Rp.20.000',
      status: 'Batal',
      statusIcon: XCircle,
      statusColor: 'text-gray-400',
    },
  ];

  const inProcessActivities = [
    {
      id: 3,
      supplier: 'Steven Bakery',
      location: 'Jl. Antasura 12, Denpasar Bali',
      volume: '1 Liter',
      price: 'Rp.20.000',
      status: 'Pesanan Sedang Di Kemas',
      statusIcon: Box,
      statusColor: 'text-gray-400',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-[calc(96px+env(safe-area-inset-bottom))]">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-border">
        <h1 className="text-2xl font-bold">Aktivitas</h1>
      </header>

      {/* Tabs */}
      <div className="flex px-6 mt-6 border-b border-border">
        <button
          onClick={() => setActiveTab('Riwayat')}
          className={`pb-4 text-2xl font-bold relative transition-colors ${
            activeTab === 'Riwayat' ? 'text-foreground' : 'text-muted-2'
          }`}
        >
          Riwayat
          {activeTab === 'Riwayat' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('Dalam Proses')}
          className={`pb-4 px-10 text-2xl font-bold relative transition-colors ${
            activeTab === 'Dalam Proses' ? 'text-foreground' : 'text-muted-2'
          }`}
        >
          Dalam Proses
          {activeTab === 'Dalam Proses' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>
          )}
        </button>
      </div>

      {/* Activity List */}
      <main className="px-6 py-8 flex flex-col gap-6">
        {activeTab === 'Riwayat' ? (
          historyActivities.map((activity) => {
            const StatusIcon = activity.statusIcon;
            return (
              <div
                key={activity.id}
              className="bg-surface rounded-3xl overflow-hidden border border-border shadow-sm flex items-stretch"
              >
                {/* Image Section */}
                <div className="w-[120px] h-[120px] m-2.5 rounded-2xl bg-surface-2 relative overflow-hidden flex-shrink-0 border border-border">
                  <div className="w-full h-full flex items-center justify-center text-muted-2 italic text-[10px] text-center p-2">
                    Activity Image
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-4 pl-0 flex flex-col justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] text-muted font-medium">
                      <span>{activity.volume}</span>
                      <span>{activity.price}</span>
                    </div>
                    
                    <h3 className="text-base font-bold leading-tight">{activity.supplier}</h3>
                    
                    <div className="flex items-center gap-1 text-muted text-[10px]">
                      <MapPin size={10} />
                      <span className="truncate">{activity.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className={`flex items-center gap-1 text-[10px] font-medium ${activity.statusColor} opacity-70`}>
                      <StatusIcon size={12} />
                      <span>{activity.status}</span>
                    </div>
                    
                    <button className="bg-[#7C7DB1] text-white px-4 py-1.5 rounded-full text-[10px] font-bold hover:bg-[#6A6B9D] transition-colors shadow-sm">
                      Pesan Lagi
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          inProcessActivities.map((activity) => {
            const StatusIcon = activity.statusIcon;
            return (
              <div
                key={activity.id}
                className="bg-surface rounded-3xl overflow-hidden border border-border shadow-sm flex items-stretch"
              >
                {/* Image Section */}
                <div className="w-[140px] h-[140px] m-2.5 rounded-2xl bg-surface-2 relative overflow-hidden flex-shrink-0 border border-border">
                  <div className="w-full h-full flex items-center justify-center text-muted-2 italic text-[10px] text-center p-2">
                    Processing Image
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-4 pl-2 flex flex-col justify-between">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-bold leading-tight">{activity.supplier}</h3>
                      <span className="text-[10px] text-muted-2 font-medium">{activity.volume}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-2 text-[10px]">
                      <MapPin size={10} />
                      <span className="truncate">{activity.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted mt-1">
                      <StatusIcon size={12} />
                      <span>{activity.status}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] text-muted-2 font-medium">{activity.price}</span>
                    
                    <button className="bg-[#7C7DB1] text-white px-6 py-1.5 rounded-full text-[10px] font-medium hover:bg-[#6A6B9D] transition-colors shadow-sm flex items-center gap-1">
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
