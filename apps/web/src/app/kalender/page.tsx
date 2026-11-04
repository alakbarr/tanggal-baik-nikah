'use client';

import React, { useState, useMemo } from 'react';
import {
  generateMonthGrid,
  formatWeton,
  HIJRI_MONTH_NAMES,
  type MonthGridCell,
  type DayPoint,
  evaluateJ05,
  evaluateJ06,
  evaluateJ07,
  evaluateJ08,
  evaluateJ31,
  evaluateJ35,
  evaluateJ36,
} from '@tanggal-baik/core';
import { Navbar } from '../../components/Navbar';
import { AntiTathayyurBanner } from '../../components/AntiTathayyurBanner';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function KalenderTriSystemPage() {
  const [currentYear, setCurrentYear] = useState(2027);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [selectedDayPoint, setSelectedDayPoint] = useState<DayPoint | null>(null);

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

  // Inspect pantangan adat on a selected day point
  const selectedDayAudit = useMemo(() => {
    if (!selectedDayPoint) return null;

    const j05 = evaluateJ05(selectedDayPoint);
    const j06 = evaluateJ06(selectedDayPoint);
    const j07 = evaluateJ07(selectedDayPoint);
    const j08 = evaluateJ08(selectedDayPoint);
    const j31 = evaluateJ31(selectedDayPoint);
    const saat = evaluateJ35(selectedDayPoint);
    const saatTanggal = evaluateJ36(selectedDayPoint);

    const pantanganFound = [j05, j06, j07, j08, j31].filter((r) => r.verdict === 'fail');

    return {
      pantanganFound,
      saat,
      saatTanggal,
      j05,
      j06,
      j07,
      j08,
      j31,
    };
  }, [selectedDayPoint]);

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
            Menampilkan tanggal Masehi, pasaran &amp; sasi Jawa (Sultan Agungan), serta penanggalan Hijriah Kemenag secara harmonis. Klik tanggal untuk melihat rincian hisab lengkap.
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
                Hisab Falak Nusantara Kurup Asapon 1936–2052 M
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
            <span className="text-amber-800 dark:text-amber-400">Ahad</span>
            <span>Senin</span>
            <span>Selasa</span>
            <span>Rabu</span>
            <span>Kamis</span>
            <span className="text-emerald-800 dark:text-emerald-400">Jumat</span>
            <span className="text-amber-800 dark:text-amber-400">Sabtu</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {gridCells.map((cell: MonthGridCell) => {
              const day = cell.day;
              const hijri = day.hijri.kemenag;
              const hijriStr = hijri
                ? `${hijri.day} ${HIJRI_MONTH_NAMES[hijri.month - 1]}`
                : '';
              const isSelected = selectedDayPoint?.jdn === day.jdn;

              return (
                <button
                  key={day.jdn}
                  type="button"
                  onClick={() => setSelectedDayPoint(day)}
                  className={`min-h-[96px] p-2 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    !cell.isCurrentMonth
                      ? 'opacity-35 bg-sand-200/40 dark:bg-obsidian-950/40 border-transparent'
                      : isSelected
                        ? 'bg-prada-50 dark:bg-obsidian-800 border-2 border-prada-500 shadow-md ring-1 ring-prada-500/30'
                        : 'bg-sand-50 dark:bg-obsidian-850 border-sand-200 dark:border-sand-800/80 hover:border-prada-500/50 shadow-xs'
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector Dialog / Card */}
        {selectedDayPoint && selectedDayAudit && (
          <div className="p-6 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-sand-200 dark:border-sand-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-royal text-prada-700 dark:text-prada-400 font-semibold block">
                  Detail Koordinat Falak &amp; Hari
                </span>
                <h3 className="font-serif font-bold text-2xl text-sand-950 dark:text-sand-50 mt-0.5">
                  {selectedDayPoint.weton.dayName} {selectedDayPoint.weton.pasaranName}, {selectedDayPoint.gregorian.day} {monthNamesId[selectedDayPoint.gregorian.month - 1]} {selectedDayPoint.gregorian.year}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDayPoint(null)}
                aria-label="Tutup detail hari"
                className="p-1.5 rounded-lg border border-sand-300 dark:border-sand-700 text-sand-600 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Calendar Systems Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Javanese */}
              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block font-medium">Kalender Jawa (Sultan Agungan)</span>
                <span className="font-serif font-bold text-base text-sand-900 dark:text-sand-100 block">
                  {selectedDayPoint.javanese.day} {selectedDayPoint.javanese.sasi} {selectedDayPoint.javanese.year} {selectedDayPoint.javanese.tahun}
                </span>
                <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                  Kurup {selectedDayPoint.javanese.kurup} &bull; Wuku {selectedDayPoint.pawukon.wuku}
                </span>
                <span className="text-sand-500 dark:text-sand-400 block text-[10px]">
                  Sadwara: {selectedDayPoint.pawukon.sadwara} &bull; Neptu Weton: {selectedDayPoint.weton.neptu}
                </span>
              </div>

              {/* Hijri Kemenag */}
              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block font-medium">Kalender Hijriah Kemenag RI</span>
                <span className="font-serif font-bold text-base text-emerald-800 dark:text-emerald-300 block">
                  {selectedDayPoint.hijri.kemenag
                    ? `${selectedDayPoint.hijri.kemenag.day} ${HIJRI_MONTH_NAMES[selectedDayPoint.hijri.kemenag.month - 1]} ${selectedDayPoint.hijri.kemenag.year} H`
                    : 'Prakiraan hisab'}
                </span>
                <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                  Kriteria Visibilitas MABIMS 3° / 6.4°
                </span>
              </div>

              {/* Hijri KHGT */}
              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block font-medium">Kalender Hijriah Global (KHGT)</span>
                <span className="font-serif font-bold text-base text-blue-800 dark:text-blue-300 block">
                  {selectedDayPoint.hijri.khgt
                    ? `${selectedDayPoint.hijri.khgt.day} ${HIJRI_MONTH_NAMES[selectedDayPoint.hijri.khgt.month - 1]} ${selectedDayPoint.hijri.khgt.year} H`
                    : 'Hisab Astronomis'}
                </span>
                <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                  Hisab Global Muhammadiyah
                </span>
              </div>
            </div>

            {/* Adat Pantangan Status */}
            <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                {selectedDayAudit.pantanganFound.length === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                  {selectedDayAudit.pantanganFound.length === 0
                    ? 'Hari ini Bebas dari Pantangan Keras Tahunan & Bulanan Adat'
                    : `Terdeteksi ${selectedDayAudit.pantanganFound.length} Pantangan Adat pada Hari Ini`}
                </span>
              </div>

              {selectedDayAudit.pantanganFound.length > 0 && (
                <ul className="list-disc list-inside text-amber-800 dark:text-amber-400 space-y-1 pt-1">
                  {selectedDayAudit.pantanganFound.map((p) => (
                    <li key={p.ruleId}>
                      <strong>[{p.ruleId}] {p.labelJv}:</strong> {p.explanationId}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Saat Pasaran Execution Hours */}
            <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-prada-900 dark:text-prada-300">
                <Clock className="w-4 h-4" />
                <span>Panduan Waktu Hajat: Sa&lsquo;at Pasaran ({selectedDayPoint.weton.pasaranName}) &bull; Betaljemur No. 35</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
                {selectedDayAudit.saat.map((s) => (
                  <div
                    key={s.start}
                    className={`p-2.5 rounded-lg text-center ${
                      s.labelJv === 'Slamet' || s.labelJv === 'Rejeki'
                        ? 'bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-500/25'
                        : 'bg-sand-100 dark:bg-obsidian-900 text-sand-600 dark:text-sand-400'
                    }`}
                  >
                    <span className="block text-[10px] opacity-80">{s.start}–{s.end}</span>
                    <span className="block font-sans text-xs mt-0.5">{s.labelJv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note on Shariah decoupling */}
            <div className="text-[11px] text-sand-600 dark:text-sand-400 flex items-start gap-2 bg-sand-200/40 dark:bg-obsidian-950/40 p-3 rounded-lg border border-sand-300/60 dark:border-sand-800">
              <Info className="w-4 h-4 text-prada-700 dark:text-prada-400 shrink-0 mt-0.5" />
              <p>
                <strong>Catatan Fiqih:</strong> Status pantangan di atas adalah ikhtiar penataan sosial dalam tradisi budaya Jawa. Secara hukum syariat Islam, seluruh hari adalah milik Allah ﷻ dan sah untuk melangsungkan akad pernikahan.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
