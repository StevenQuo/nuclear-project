'use client';

import { useEffect } from 'react';

export default function ThemeInit() {
  useEffect(() => {
    const stored = window.localStorage.getItem('nuclear_theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored;
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, []);

  return null;
}
