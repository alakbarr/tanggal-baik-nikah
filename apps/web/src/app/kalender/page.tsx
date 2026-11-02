'use client';

import React, { useState, useMemo } from 'react';
import {
  generateMonthGrid,
  formatWeton,
  HIJRI_MONTH_NAMES,
  type MonthGridCell,
} from '@tanggal-baik/core';
import { Navbar } from '../../components/Navbar';
import { AntiTathayyurBanner } from '../../components/AntiTathayyurBanner';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function KalenderTriSystemPage() {
  const [currentYear, setCurrentYear] = useState(2027);
  const [currentMonth, setCurrentMonth] = useState(1);

  const monthNamesId = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const gridCells = useMemo(() => {
    return generateMonthGrid(currentYear, currentMonth).cells;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-obsidian-950 bg-batik-pattern transition-colors">
      <AntiTathayyurBanner />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-prada-500/15 text-prada-800 dark:text-prada-300 border border-prada-500/20">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Kalender 3 Sistem Berdampingan</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-sand-950 dark:text-sand-50">
            Kalender Masehi, Jawa &amp; Hijriah
          </h1>
          <p className="text-xs md:text-sm text-sand-600 dark:text-sand-400 max-w-xl mx-auto">
            Menampilkan tanggal Masehi, pasaran &amp; sasi Jawa (Sultan Agungan), serta penanggalan Hijriah Kemenag secara harmonis.
          </p>
        </div>

        {/* Calendar Card */}
        <div className="bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 rounded-xl p-4 md:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sand-200 dark:border-sand-800/80 pb-4">
            <div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-sand-900 dark:text-sand-50">
                {monthNamesId[currentMonth - 1]} {currentYear}
              </h2>
              <span className="text-xs text-sand-600 dark:text-sand-400">
                Penanggalan Falak Nusantara
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
                className="p-2 rounded border border-sand-300 dark:border-sand-800 bg-sand-50 dark:bg-obsidian-850 text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Bulan berikutnya"
                className="p-2 rounded border border-sand-300 dark:border-sand-800 bg-sand-50 dark:bg-obsidian-850 text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Strip */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-sand-600 dark:text-sand-400 py-1">
            <span>Ahad</span>
            <span>Senin</span>
            <span>Selasa</span>
            <span>Rabu</span>
            <span>Kamis</span>
            <span>Jumat</span>
            <span>Sabtu</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {gridCells.map((cell: MonthGridCell) => {
              const day = cell.day;
              const hijri = day.hijri.kemenag;
              const hijriStr = hijri
                ? `${hijri.day} ${HIJRI_MONTH_NAMES[hijri.month - 1]}`
                : '';

              return (
                <div
                  key={day.jdn}
                  className={`min-h-[96px] p-2 rounded-lg border text-left flex flex-col justify-between ${
                    !cell.isCurrentMonth
                      ? 'opacity-35 bg-sand-200/40 dark:bg-obsidian-950/40 border-transparent'
                      : 'bg-sand-50 dark:bg-obsidian-850 border-sand-200 dark:border-sand-800/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between w-full text-[10px] leading-tight">
                    <span className="text-emerald-800 dark:text-emerald-400 font-medium truncate">
                      {hijriStr}
                    </span>
                    <span className="text-sand-500 font-mono text-[9px]">
                      #{day.weton.neptu}
                    </span>
                  </div>

                  <div className="text-center my-1">
                    <span className="font-serif font-bold text-lg md:text-xl text-sand-900 dark:text-sand-100">
                      {day.gregorian.day}
                    </span>
                  </div>

                  <div className="text-[10px] text-sand-600 dark:text-sand-400 leading-tight">
                    <span className="block truncate font-medium text-prada-800 dark:text-prada-300">
                      {day.javanese.day} {day.javanese.sasi}
                    </span>
                    <span className="block truncate">
                      {formatWeton(day.weton)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
