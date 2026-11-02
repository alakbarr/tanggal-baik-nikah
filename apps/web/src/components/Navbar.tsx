'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Sparkles, Calendar, BookOpen, Calculator } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tbn:theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tbn:theme', 'light');
    }
  };

  const navLinks = [
    { href: '/', label: 'Kalkulator', icon: Sparkles },
    { href: '/weton', label: 'Cek Weton', icon: Calculator },
    { href: '/kalender', label: 'Kalender 3 Sistem', icon: Calendar },
    { href: '/glossary', label: 'Glosarium', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-sand-50/90 dark:bg-obsidian-950/90 backdrop-blur-md border-b border-sand-300 dark:border-sand-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-prada-500 flex items-center justify-center text-obsidian-950 font-royal font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            ꦠ
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-sand-900 dark:text-sand-50 block leading-tight">
              Tanggal Baik Nikah
            </span>
            <span className="text-[10px] uppercase tracking-wider font-royal text-prada-700 dark:text-prada-400 block">
              Nawa Rahayu & Sakinah
            </span>
          </div>
        </Link>

        <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  active
                    ? 'bg-prada-500/15 text-prada-800 dark:text-prada-300 font-semibold'
                    : 'text-sand-700 dark:text-sand-400 hover:text-sand-950 dark:hover:text-sand-50 hover:bg-sand-200/50 dark:hover:bg-obsidian-850'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            className="p-2 rounded-md border border-sand-300 dark:border-sand-800 bg-sand-100 dark:bg-obsidian-900 text-sand-700 dark:text-sand-300 hover:border-prada-500 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <nav aria-label="Navigasi Mobile" className="flex md:hidden border-t border-sand-200 dark:border-sand-850 px-2 py-1 justify-around text-xs">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded ${
                active
                  ? 'text-prada-700 dark:text-prada-400 font-semibold'
                  : 'text-sand-600 dark:text-sand-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
