'use client';

import { ArrowLeft, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import { use, useMemo, useState } from 'react';

type ChatMessage = {
  id: string;
  side: 'left' | 'right';
  kind: 'text';
  text: string;
};

function getInitialMessages(threadId: string): ChatMessage[] {
  if (threadId === 'customer-service') {
    return [
      {
        id: 'cs-1',
        side: 'right',
        kind: 'text',
        text: 'Halo! Aku NuClear CS. Kamu bisa pilih template pertanyaan di bawah, atau langsung hubungi live service.',
      },
    ];
  }

  if (threadId === 'customer-service-live') {
    return [
      {
        id: 'live-1',
        side: 'right',
        kind: 'text',
        text: 'Kamu sekarang terhubung ke Live Service. Silakan jelaskan kebutuhan albumen kamu.',
      },
    ];
  }

  return [
    { id: 'm1', side: 'right', kind: 'text', text: 'Baik' },
    { id: 'm2', side: 'left', kind: 'text', text: 'Terimakasih sudah memesan.' },
    { id: 'm3', side: 'right', kind: 'text', text: 'Oke, ditunggu ya.' },
    { id: 'm4', side: 'left', kind: 'text', text: 'Siap, pesanan sedang di kemas.' },
  ];
}

function Bubble({ message }: { message: ChatMessage }) {
  const isLeft = message.side === 'left';
  const bubbleClass = isLeft
    ? 'bg-primary text-primary-foreground rounded-3xl rounded-bl-lg'
    : 'bg-surface-2 text-foreground rounded-3xl rounded-br-lg border border-border';

  const widthClass = useMemo(() => {
    const len = message.text.trim().length;
    if (len <= 10) return 'max-w-[58%]';
    if (len <= 50) return 'max-w-[70%]';
    return 'max-w-[78%]';
  }, [message.text]);

  return (
    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <div className={`${widthClass} ${bubbleClass} px-6 py-5 text-sm leading-relaxed shadow-[0_8px_18px_rgba(0,0,0,0.06)]`}>
        {message.text}
      </div>
    </div>
  );
}

export default function ChatThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = use(params);
  const title = useMemo(() => {
    const map: Record<string, string> = {
      'customer-service': 'Customer Service',
      'customer-service-live': 'Live Service',
      'steven-bakery': 'Steven Bakery',
      'nadila-bakery': 'Nadila Bakery',
      'eka-pie': 'Eka Pie',
    };
    return map[threadId] ?? 'Chat';
  }, [threadId]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages(threadId));
  const [text, setText] = useState('');

  const templates = useMemo(() => {
    if (threadId !== 'customer-service') return [];
    return [
      { id: 't1', label: 'Harga albumen', text: 'Boleh info harga albumen dan minimal pembelian?' },
      { id: 't2', label: 'Cara order', text: 'Cara order putih telur/albummen gimana?' },
      { id: 't3', label: 'Pengiriman', text: 'Pengiriman biasanya berapa lama dan area mana saja?' },
      { id: 't4', label: 'Penyimpanan', text: 'Cara simpan albumen yang benar biar awet gimana?' },
    ];
  }, [threadId]);

  const onSendMessage = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}-${Math.random()}`, side: 'left', kind: 'text', text: trimmed },
    ]);
  };

  const onAutoReply = (templateId: string) => {
    const replies: Record<string, string> = {
      t1: 'Harga tergantung lokasi dan volume. Untuk mulai, kamu bisa cek Supplier Terdekat di Home lalu pilih supplier untuk detail harga.',
      t2: 'Masuk ke Home → pilih Supplier Terdekat → tekan “Pesan Sekarang”. Kamu juga bisa tulis kebutuhan liter kamu di chat supplier.',
      t3: 'Estimasi pengiriman tergantung jarak supplier. Untuk saat ini, kami fokus area terdekat dari lokasi kamu.',
      t4: 'Simpan di chiller (0–4°C) dan gunakan wadah tertutup. Jika beku, bagi per porsi agar mudah dipakai.',
    };
    const reply = replies[templateId];
    if (!reply) return;
    setMessages((prev) => [
      ...prev,
      { id: `r-${Date.now()}-${Math.random()}`, side: 'right', kind: 'text', text: reply },
    ]);
  };

  const onSend = () => {
    const value = text.trim();
    if (!value) return;
    onSendMessage(value);
    setText('');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground">
      <header className="px-6 pt-12 pb-5 border-b border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/chat"
            aria-label="Back to chat list"
            className="w-10 h-10 rounded-full flex items-center justify-center text-foreground active:bg-surface-2 transition-colors"
          >
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-2xl font-bold truncate">{title}</h1>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-2 active:bg-surface-2 transition-colors">
          <Phone size={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
        <div className="flex justify-center mb-6">
          <div className="bg-surface-2 text-muted text-xs font-medium px-5 py-2 rounded-full border border-border">
            Hari ini
          </div>
        </div>

        {threadId === 'customer-service' ? (
          <div className="mb-6">
            <div className="text-xs font-semibold text-muted mb-3">Template Pertanyaan</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSendMessage(t.text);
                    onAutoReply(t.id);
                  }}
                  className="flex-shrink-0 px-4 py-2 rounded-full border border-border bg-surface-2 text-foreground text-xs font-semibold active:scale-[0.99] transition-transform"
                >
                  {t.label}
                </button>
              ))}
              <Link
                href="/chat/customer-service-live"
                className="flex-shrink-0 px-4 py-2 rounded-full border border-border bg-primary text-primary-foreground text-xs font-semibold"
              >
                Live Service
              </Link>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-7">
          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 w-full bg-surface px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-background border border-border rounded-full px-6 py-4 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSend();
              }}
              placeholder="Kirim Pesan Sekarang....."
              className="w-full text-sm text-foreground placeholder:text-muted-2 focus:outline-none bg-transparent"
            />
          </div>
          <button
            onClick={onSend}
            className="w-16 h-16 rounded-full bg-[#7C7DB1] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-transform"
            aria-label="Send"
          >
            <Send size={26} />
          </button>
        </div>
      </div>
    </div>
  );
}
