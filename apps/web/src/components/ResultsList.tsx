'use client';

import React, { useState, useMemo } from 'react';
import type { CandidateResult } from '@tanggal-baik/core';
import { DateCard } from './DateCard';
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Filter,
  Search,
  RotateCcw,
} from 'lucide-react';

const MONTH_NAMES_ID = [
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

interface ResultsListProps {
  eligible: readonly CandidateResult[];
  eliminated: readonly CandidateResult[];
  onOpenDrawer: (candidate: CandidateResult) => void;
  onShareCard?: (candidate: CandidateResult) => void;
}

export function ResultsList({
  eligible,
  eliminated,
  onOpenDrawer,
  onShareCard,
}: ResultsListProps) {
  const [showEliminated, setShowEliminated] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedPref, setSelectedPref] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEligible = useMemo(() => {
    return eligible.filter((cand) => {
      const day = cand.day;

      // Filter by day of week
      if (selectedDay !== 'all') {
        const dayIdx = day.weton.dayIndex;
        if (selectedDay === 'weekend') {
          if (dayIdx !== 0 && dayIdx !== 6) return false;
        } else if (dayIdx !== Number(selectedDay)) {
          return false;
        }
      }

      // Filter by Gregorian month
      if (selectedMonth !== 'all' && day.gregorian.month !== Number(selectedMonth)) {
        return false;
      }

      // Filter by preference
      if (selectedPref === 'top') {
        if (cand.criteriaMet < cand.criteriaTotal) return false;
      } else if (selectedPref === 'syawal') {
        if (!cand.preferenceMatches.includes('syawal')) return false;
      } else if (selectedPref === 'jumat') {
        if (!cand.preferenceMatches.includes('jumat')) return false;
      } else if (selectedPref === 'weekend') {
        if (!cand.preferenceMatches.includes('akhir-pekan')) return false;
      }

      // Search query (matches weton name, month name, wuku name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullWeton = `${day.weton.dayName} ${day.weton.pasaranName}`.toLowerCase();
        const monthName = MONTH_NAMES_ID[day.gregorian.month - 1]?.toLowerCase() ?? '';
        const sasiJawa = day.javanese.sasi.toLowerCase();
        const wuku = day.pawukon.wuku.toLowerCase();

        const match =
          fullWeton.includes(q) ||
          monthName.includes(q) ||
          sasiJawa.includes(q) ||
          wuku.includes(q);

        if (!match) return false;
      }

      return true;
    });
  }, [eligible, selectedDay, selectedMonth, selectedPref, searchQuery]);

  const hasActiveFilters =
    selectedDay !== 'all' ||
    selectedMonth !== 'all' ||
    selectedPref !== 'all' ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedDay('all');
    setSelectedMonth('all');
    setSelectedPref('all');
    setSearchQuery('');
  };

  if (eligible.length === 0 && eliminated.length === 0) {
    return (
      <div className="p-8 text-center bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 rounded-xl text-sand-600 dark:text-sand-400">
        Belum ada pencarian tanggal. Silakan lengkapi form di atas lalu klik &ldquo;Cari Rekomendasi Tanggal Baik&rdquo;.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 rounded-xl text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <p className="font-medium text-sand-800 dark:text-sand-200">
            Ditemukan <strong>{eligible.length} tanggal</strong> yang memenuhi kriteria adat dan syariah.
          </p>
        </div>
        <p className="text-sand-600 dark:text-sand-400 text-xs">
          Diurutkan berdasarkan kelengkapan kriteria &amp; keselarasan sunnah.
        </p>
      </div>

      {/* Interactive Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 dark:border-sand-800 pb-2.5">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-sand-800 dark:text-sand-200">
            <Filter className="w-4 h-4 text-prada-600 dark:text-prada-400" />
            <span>Saring Tanggal Rekomendasi</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-prada-700 dark:text-prada-400 hover:text-prada-900 dark:hover:text-prada-200 self-start sm:self-auto font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Saringan</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Day of Week */}
          <div>
            <label htmlFor="filter-day" className="block text-[11px] font-medium text-sand-600 dark:text-sand-400 mb-1">
              Hari Pelaksanaan
            </label>
            <select
              id="filter-day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-obsidian-850 text-sand-900 dark:text-sand-100 focus:outline-none focus:ring-1 focus:ring-prada-500"
            >
              <option value="all">Semua Hari</option>
              <option value="weekend">Akhir Pekan (Sabtu / Ahad)</option>
              <option value="5">Hari Jumat (Sayyidul Ayyam)</option>
              <option value="6">Hari Sabtu</option>
              <option value="0">Hari Ahad</option>
              <option value="1">Hari Senin</option>
              <option value="2">Hari Selasa</option>
              <option value="3">Hari Rabu</option>
              <option value="4">Hari Kamis</option>
            </select>
          </div>

          {/* Month */}
          <div>
            <label htmlFor="filter-month" className="block text-[11px] font-medium text-sand-600 dark:text-sand-400 mb-1">
              Bulan Masehi
            </label>
            <select
              id="filter-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-obsidian-850 text-sand-900 dark:text-sand-100 focus:outline-none focus:ring-1 focus:ring-prada-500"
            >
              <option value="all">Semua Bulan (Januari–Desember)</option>
              {MONTH_NAMES_ID.map((name, i) => (
                <option key={name} value={String(i + 1)}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Preferences */}
          <div>
            <label htmlFor="filter-pref" className="block text-[11px] font-medium text-sand-600 dark:text-sand-400 mb-1">
              Kategori Khusus
            </label>
            <select
              id="filter-pref"
              value={selectedPref}
              onChange={(e) => setSelectedPref(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-obsidian-850 text-sand-900 dark:text-sand-100 focus:outline-none focus:ring-1 focus:ring-prada-500"
            >
              <option value="all">Semua Kriteria</option>
              <option value="top">Hanya Pilihan Utama (Kriteria Penuh)</option>
              <option value="syawal">Bulan Syawal (Sunnah Nabi ﷺ)</option>
              <option value="jumat">Hari Jumat (Hari Terbaik)</option>
              <option value="weekend">Akhir Pekan (Taysir / Memudahkan Tamu)</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label htmlFor="filter-search" className="block text-[11px] font-medium text-sand-600 dark:text-sand-400 mb-1">
              Cari Weton / Sasi / Wuku
            </label>
            <div className="relative">
              <input
                id="filter-search"
                type="text"
                placeholder="Contoh: Kliwon, Ruwah, Sinta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-obsidian-850 text-sand-900 dark:text-sand-100 placeholder:text-sand-400 focus:outline-none focus:ring-1 focus:ring-prada-500 text-xs"
              />
              <Search className="w-3.5 h-3.5 text-sand-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Filter results summary */}
        <div className="flex items-center justify-between text-[11px] text-sand-600 dark:text-sand-400 pt-1">
          <span>
            Menampilkan <strong>{filteredEligible.length}</strong> dari <strong>{eligible.length}</strong> tanggal yang lolos saringan adat.
          </span>
          {hasActiveFilters && (
            <span className="font-medium text-prada-700 dark:text-prada-400">
              Saringan aktif
            </span>
          )}
        </div>
      </div>

      {/* Eligible Date Cards */}
      <div className="space-y-4">
        {filteredEligible.length > 0 ? (
          filteredEligible.map((candidate, idx) => (
            <DateCard
              key={candidate.day.jdn}
              candidate={candidate}
              isTopRecommendation={idx === 0 && !hasActiveFilters}
              onOpenDrawer={onOpenDrawer}
              {...(onShareCard ? { onShareCard } : {})}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 rounded-xl space-y-2">
            <p className="font-semibold text-sand-800 dark:text-sand-200 text-sm">
              Tidak ada tanggal yang cocok dengan saringan yang dipilih.
            </p>
            <p className="text-xs text-sand-600 dark:text-sand-400">
              Silakan atur ulang filter hari, bulan, atau kata kunci pencarian.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-obsidian-800 text-xs font-semibold text-sand-800 dark:text-sand-200 hover:bg-sand-300 dark:hover:bg-obsidian-750 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bersihkan Saringan</span>
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Dropped Dates (Tanggal yang Gugur) */}
      {eliminated.length > 0 && (
        <div className="border border-sand-300 dark:border-sand-800 rounded-xl overflow-hidden bg-sand-50 dark:bg-obsidian-900">
          <button
            type="button"
            onClick={() => setShowEliminated(!showEliminated)}
            className="w-full flex items-center justify-between p-4 bg-sand-100 dark:bg-obsidian-850 hover:bg-sand-200/50 dark:hover:bg-obsidian-800 text-left transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
              <span className="font-serif font-semibold text-sm text-sand-900 dark:text-sand-100">
                Tanggal yang Gugur dalam Saringan Adat ({eliminated.length} Tanggal)
              </span>
            </div>
            {showEliminated ? (
              <ChevronUp className="w-4 h-4 text-sand-600 dark:text-sand-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-sand-600 dark:text-sand-400" />
            )}
          </button>

          {showEliminated && (
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto divide-y divide-sand-200 dark:divide-sand-800 text-xs">
              {eliminated.map((candidate) => {
                const g = candidate.day.gregorian;
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const dateStr = `${candidate.day.weton.dayName} ${candidate.day.weton.pasaranName}, ${g.day} ${monthNames[g.month - 1]} ${g.year}`;
                const jvStr = `${candidate.day.javanese.day} ${candidate.day.javanese.sasi} ${candidate.day.javanese.year}`;

                return (
                  <div key={candidate.day.jdn} className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                    <div>
                      <span className="font-semibold text-sand-900 dark:text-sand-200 block">
                        {dateStr} ({jvStr})
                      </span>
                      <ul className="list-disc list-inside text-amber-800 dark:text-amber-400 space-y-0.5 mt-0.5">
                        {candidate.eliminatedBy.map((o) => (
                          <li key={o.ruleId}>
                            [{o.ruleId}] {o.labelJv}: {o.explanationId}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenDrawer(candidate)}
                      className="text-prada-800 dark:text-prada-400 hover:underline shrink-0 self-start sm:self-auto text-[11px]"
                    >
                      Buka Dalil
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
