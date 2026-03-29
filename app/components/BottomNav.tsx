'use client';

import { Home, MessageSquare, ClipboardList, Percent } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const shouldHide = pathname.startsWith('/chat/') && pathname !== '/chat';
  if (shouldHide) return null;

  const navItems = [
    { icon: MessageSquare, label: 'Chat', href: '/chat' },
    { icon: Home, label: 'Home', href: '/' },
    { icon: ClipboardList, label: 'Aktivitas', href: '/activity' },
    { icon: Percent, label: 'Promo', href: '/promo' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] flex justify-between items-center rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
      {navItems.map((item) => {
        const isActive = item.href === '/chat' ? pathname === '/chat' || pathname.startsWith('/chat/') : pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
          >
            <div className={`transition-colors ${isActive ? 'text-primary' : 'text-[#FFD95A]/40'}`}>
              <Icon size={isActive ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-primary border-b-2 border-primary pb-0.5 px-2' : 'text-[#FFD95A]/40'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
