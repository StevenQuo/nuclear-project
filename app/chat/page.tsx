import Link from 'next/link';

type ChatThread = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
};

const threads: ChatThread[] = [
  {
    id: 'steven-bakery',
    name: 'Steven Bakery',
    lastMessage: 'Baik Terimakasih sudah memesan',
    time: '08:40',
    unreadCount: 1,
  },
  {
    id: 'nadila-bakery',
    name: 'Nadila Bakery',
    lastMessage: 'Baik Terimakasih sudah memesan',
    time: '08:40',
    unreadCount: 1,
  },
  {
    id: 'eka-pie',
    name: 'Eka Pie',
    lastMessage: 'Baik Terimakasih sudah memesan',
    time: '08:40',
    unreadCount: 1,
  },
];

function ThreadRow({ thread }: { thread: ChatThread }) {
  return (
    <Link
      href={`/chat/${thread.id}`}
      className="block w-full text-left px-6 py-6 bg-white active:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-bold text-black truncate">{thread.name}</div>
          <div className="mt-2 text-sm text-gray-300 truncate">{thread.lastMessage}</div>
        </div>
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="text-sm font-medium text-primary">{thread.time}</div>
          {thread.unreadCount > 0 ? (
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
              {thread.unreadCount}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 pt-12 pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-black">Chat</h1>
      </header>

      <main className="flex-1">
        <div className="divide-y divide-gray-200">
          {threads.map((t) => (
            <ThreadRow key={t.id} thread={t} />
          ))}
        </div>
      </main>
    </div>
  );
}
