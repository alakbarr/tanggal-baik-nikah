'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const swUrl = `${basePath}/sw.js`;
      const scope = basePath ? `${basePath}/` : '/';

      navigator.serviceWorker
        .register(swUrl, { scope })
        .then((reg) => {
          console.log('[Serwist PWA] Service worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('[Serwist PWA] Service worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
