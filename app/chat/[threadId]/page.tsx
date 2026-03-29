'use client';

import { ArrowLeft, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type ChatMessage = {
  id: string;
  side: 'left' | 'right';
  kind: 'text';
  text: string;
};

function Bubble({ message }: { message: ChatMessage }) {
  const isLeft = message.side === 'left';
  const bubbleClass = isLeft
    ? 'bg-primary text-black rounded-3xl rounded-bl-lg'
    : 'bg-gray-100 text-black rounded-3xl rounded-br-lg';

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
  params: { threadId: string };
}) {
  const title = useMemo(() => {
    const map: Record<string, string> = {
      'steven-bakery': 'Steven Bakery',
      'nadila-bakery': 'Nadila Bakery',
      'eka-pie': 'Eka Pie',
    };
    return map[params.threadId] ?? 'Chat';
  }, [params.threadId]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm1', side: 'right', kind: 'text', text: 'Baik' },
    { id: 'm2', side: 'left', kind: 'text', text: 'Terimakasih sudah memesan.' },
    { id: 'm3', side: 'right', kind: 'text', text: 'Oke, ditunggu ya.' },
    { id: 'm4', side: 'left', kind: 'text', text: 'Siap, pesanan sedang di kemas.' },
  ]);
  const [text, setText] = useState('');

  const onSend = () => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, side: 'left', kind: 'text', text: value },
    ]);
    setText('');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <header className="px-6 pt-12 pb-5 border-b border-gray-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/chat"
            aria-label="Back to chat list"
            className="w-10 h-10 rounded-full flex items-center justify-center text-black active:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-2xl font-bold text-black truncate">{title}</h1>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 active:bg-gray-50 transition-colors">
          <Phone size={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-300/80 text-white text-xs font-medium px-5 py-2 rounded-full">
            Hari ini
          </div>
        </div>

        <div className="flex flex-col gap-7">
          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-white px-6 pb-6 pt-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white border border-primary/40 rounded-full px-6 py-4 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSend();
              }}
              placeholder="Kirim Pesan Sekarang....."
              className="w-full text-sm text-black placeholder:text-gray-300 focus:outline-none"
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
