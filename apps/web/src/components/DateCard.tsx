import React from 'react';
import type { CandidateResult } from '@tanggal-baik/core';
import { HIJRI_MONTH_NAMES } from '@tanggal-baik/core';
import { Clock, BookOpen, Check, Moon, Share2 } from 'lucide-react';

interface DateCardProps {
  candidate: CandidateResult;
  isTopRecommendation?: boolean;
  onOpenDrawer: (candidate: CandidateResult) => void;
  onShareCard?: (candidate: CandidateResult) => void;
}

export function DateCard({
  candidate,
  isTopRecommendation = false,
  onOpenDrawer,
  onShareCard,
}: DateCardProps) {
  const day = candidate.day;
  const g = day.gregorian;
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

  const gregDateStr = `${day.weton.dayName} ${day.weton.pasaranName}, ${g.day} ${monthNamesId[g.month - 1]} ${g.year}`;
  const jvStr = `${day.javanese.day} ${day.javanese.sasi} ${day.javanese.year} ${day.javanese.tahun}`;

  const hijri = day.hijri.kemenag;
  const hijriMonthName = hijri ? HIJRI_MONTH_NAMES[hijri.month - 1] : '';
  const hijriStr = hijri ? `${hijri.day} ${hijriMonthName} ${hijri.year} H` : '';

  // Recommended saat: find any window labeled 'Slamet' or 'Rejeki' or take the first positive
  const goodSaat =
    candidate.saat.filter((s) => s.labelJv === 'Slamet' || s.labelJv === 'Rejeki') || [];
  const primarySaat = goodSaat[0] ?? candidate.saat[0];

  return (
    <article
      aria-label={`Rekomendasi ${gregDateStr}`}
      className={`rounded-xl p-5 md:p-6 transition-all duration-150 ${
        isTopRecommendation
          ? 'bg-sand-100 dark:bg-obsidian-900 border-2 border-prada-500 shadow-md ring-1 ring-prada-500/20'
          : 'bg-sand-50 dark:bg-obsidian-850 border border-sand-300 dark:border-sand-800/80 hover:border-prada-500/50'
      }`}
    >
      {/* Header with Title and Criteria Met Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 border-b border-sand-200 dark:border-sand-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-xl md:text-2xl text-sand-900 dark:text-sand-50">
              {gregDateStr}
            </h3>
            {isTopRecommendation && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-prada-500 text-obsidian-950">
                Pilihan Utama
              </span>
            )}
          </div>
          <p className="text-xs text-sand-600 dark:text-sand-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{jvStr}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Moon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              {hijriStr} (Kemenag)
            </span>
            <span>&bull;</span>
            <span>Wuku {day.pawukon.wuku}</span>
            <span>&bull;</span>
            <span>Neptu {day.weton.neptu}</span>
          </p>
        </div>

        {/* Count-Based Badge */}
        <div className="self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-prada-100 dark:bg-prada-950/80 text-prada-900 dark:text-prada-300 border border-prada-400/40">
            <Check className="w-3.5 h-3.5 text-prada-600 dark:text-prada-400" />
            <span>
              Memenuhi {candidate.criteriaMet} dari {candidate.criteriaTotal} kriteria adat
            </span>
          </span>
        </div>
      </div>

      {/* Criteria Checklist & Highlights */}
      <div className="py-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {candidate.outcomes
          .filter((o) => o.verdict === 'pass')
          .map((o) => (
            <div key={o.ruleId} className="flex items-start gap-1.5 text-emerald-800 dark:text-emerald-300">
              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>[{o.ruleId}]</strong> {o.labelJv}
              </span>
            </div>
          ))}

        {candidate.preferenceMatches.map((pref) => {
          const prefLabel =
            pref === 'syawal'
              ? 'Bulan Syawal (Sunnah Rasulullah ﷺ)'
              : pref === 'jumat'
                ? 'Hari Jumat (Sayyidul Ayyam)'
                : 'Akhir Pekan (Memudahkan Tamu / Maslahah)';
          return (
            <div key={pref} className="flex items-start gap-1.5 text-prada-800 dark:text-prada-300">
              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-prada-600 dark:text-prada-400" />
              <span>{prefLabel}</span>
            </div>
          );
        })}
      </div>

      {/* Execution Hours (Sa'at Ijab) & Footer */}
      <div className="pt-3 border-t border-sand-200 dark:border-sand-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-sand-700 dark:text-sand-300">
          <Clock className="w-4 h-4 text-prada-600 dark:text-prada-400 shrink-0" />
          <span>
            <strong>Waktu Ijab Disarankan:</strong> Pukul {primarySaat ? `${primarySaat.start}–${primarySaat.end} WIB (${primarySaat.labelJv})` : 'Pagi Hari'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onShareCard && (
            <button
              type="button"
              onClick={() => onShareCard(candidate)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand-700 dark:text-sand-300 hover:text-prada-700 dark:hover:text-prada-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Kartu</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenDrawer(candidate)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-prada-800 dark:text-prada-400 hover:text-prada-950 dark:hover:text-prada-200 underline underline-offset-4"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lihat Dalil &amp; Kitab Rujukan</span>
          </button>
        </div>
      </div>
    </article>
  );
}
