'use client';

import React, { useState, useMemo } from 'react';
import {
  generateMonthGrid,
  formatWeton,
  HIJRI_MONTH_NAMES,
  type CandidateResult,
  type MonthGridCell,
} from '@tanggal-baik/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthGridViewProps {
  initialYear: number;
  initialMonth?: number;
  candidates: readonly CandidateResult[];
  onOpenDrawer: (candidate: CandidateResult) => void;
}

export function MonthGridView({
  initialYear,
  initialMonth = 1,
  candidates,
  onOpenDrawer,
}: MonthGridViewProps) {
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

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

  // Map candidates by JDN for fast lookup
  const candidateMap = useMemo(() => {
    const map = new Map<number, CandidateResult>();
    for (const c of candidates) {
      map.set(c.day.jdn, c);
    }
    return map;
  }, [candidates]);

  // Generate 42-cell grid using @tanggal-baik/core
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
    <div className="bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 rounded-xl p-4 md:p-6 space-y-4">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between border-b border-sand-200 dark:border-sand-800/80 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg md:text-xl text-sand-900 dark:text-sand-50">
            {monthNamesId[currentMonth - 1]} {currentYear}
          </h3>
          <p className="text-xs text-sand-600 dark:text-sand-400">
            Penanggalan 3 Sistem: Masehi &bull; Jawa (Sultan Agungan) &bull; Hijriah (Kemenag)
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Bulan sebelumnya"
            className="p-1.5 rounded border border-sand-300 dark:border-sand-800 bg-sand-50 dark:bg-obsidian-850 hover:bg-sand-200 dark:hover:bg-obsidian-800 text-sand-700 dark:text-sand-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Bulan berikutnya"
            className="p-1.5 rounded border border-sand-300 dark:border-sand-800 bg-sand-50 dark:bg-obsidian-850 hover:bg-sand-200 dark:hover:bg-obsidian-800 text-sand-700 dark:text-sand-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Headers (Ahad s.d. Sabtu) */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-sand-600 dark:text-sand-400 py-1">
        <span>Ahad</span>
        <span>Senin</span>
        <span>Selasa</span>
        <span>Rabu</span>
        <span>Kamis</span>
        <span>Jumat</span>
        <span>Sabtu</span>
      </div>

      {/* 42-Cell Matrix */}
      <div className="grid grid-cols-7 gap-1.5">
        {gridCells.map((cell: MonthGridCell) => {
          const day = cell.day;
          const candidate = candidateMap.get(day.jdn);
          const isEligible = candidate && candidate.eliminatedBy.length === 0;
          const isEliminated = candidate && candidate.eliminatedBy.length > 0;

          const hijriKemenag = day.hijri.kemenag;
          const hijriStr = hijriKemenag
            ? `${hijriKemenag.day} ${HIJRI_MONTH_NAMES[hijriKemenag.month - 1]}`
            : '';

          return (
            <button
              key={day.jdn}
              type="button"
              disabled={!candidate}
              onClick={() => candidate && onOpenDrawer(candidate)}
              className={`min-h-[88px] md:min-h-[104px] p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                !cell.isCurrentMonth
                  ? 'opacity-35 bg-sand-200/40 dark:bg-obsidian-950/40 border-transparent'
                  : isEligible
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/50 hover:border-prada-500 hover:shadow-sm'
                    : isEliminated
                      ? 'bg-sand-50 dark:bg-obsidian-850 border-sand-200 dark:border-sand-800/80 opacity-80 hover:border-amber-500/50'
                      : 'bg-sand-50 dark:bg-obsidian-850 border-sand-200 dark:border-sand-800/80 opacity-60'
              }`}
            >
              {/* Top Bar: Hijri date + Criteria badge */}
              <div className="flex items-start justify-between w-full text-[10px] leading-tight">
                <span className="text-emerald-800 dark:text-emerald-400 font-medium truncate max-w-[50px] sm:max-w-none">
                  {hijriStr}
                </span>
                {isEligible && (
                  <span className="font-semibold text-prada-800 dark:text-prada-300 bg-prada-500/20 px-1 py-0.2 rounded">
                    {candidate.criteriaMet}/{candidate.criteriaTotal}
                  </span>
                )}
                {isEliminated && (
                  <span className="text-amber-700 dark:text-amber-400 font-bold" title="Gugur saringan adat">
                    &times;
                  </span>
                )}
              </div>

              {/* Center: Gregorian Day */}
              <div className="my-1 text-center">
                <span
                  className={`font-serif font-bold text-lg md:text-xl block ${
                    isEligible
                      ? 'text-sand-950 dark:text-sand-50'
                      : 'text-sand-700 dark:text-sand-300'
                  }`}
                >
                  {day.gregorian.day}
                </span>
              </div>

              {/* Bottom: Javanese date + Weton */}
              <div className="text-[10px] text-sand-600 dark:text-sand-400 leading-tight">
                <span className="block truncate font-medium text-prada-800 dark:text-prada-300">
                  {day.javanese.day} {day.javanese.sasi}
                </span>
                <span className="block truncate">
                  {formatWeton(day.weton)} ({day.weton.neptu})
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
