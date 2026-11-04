'use client';

import React from 'react';
import type { MultiTraditionComparisonResult } from '@tanggal-baik/core';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Crown,
  MapPin,
  Users,
} from 'lucide-react';

interface TraditionComparisonViewProps {
  comparison: MultiTraditionComparisonResult;
  onSelectDate?: (jdn: number) => void;
}

export function TraditionComparisonView({
  comparison,
  onSelectDate,
}: TraditionComparisonViewProps) {
  const { items, summary } = comparison;

  return (
    <div className="space-y-6">
      {/* Overview Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-sand-600 dark:text-sand-400">
            <Crown className="w-3.5 h-3.5 text-prada-600 dark:text-prada-400" />
            <span>Keraton</span>
          </div>
          <div className="text-xl font-bold font-serif text-sand-900 dark:text-sand-50">
            {summary.keratonEligibleCount} <span className="text-xs font-normal text-sand-500">hari lolos</span>
          </div>
          <span className="text-[10px] text-sand-500 block">Klasik &amp; Paling Ketat</span>
        </div>

        <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-sand-600 dark:text-sand-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Pati</span>
          </div>
          <div className="text-xl font-bold font-serif text-sand-900 dark:text-sand-50">
            {summary.patiEligibleCount} <span className="text-xs font-normal text-sand-500">hari lolos</span>
          </div>
          <span className="text-[10px] text-sand-500 block">Kaidah Gathuk mod 3 == 2</span>
        </div>

        <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-sand-600 dark:text-sand-400">
            <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Populer</span>
          </div>
          <div className="text-xl font-bold font-serif text-sand-900 dark:text-sand-50">
            {summary.populerEligibleCount} <span className="text-xs font-normal text-sand-500">hari lolos</span>
          </div>
          <span className="text-[10px] text-sand-500 block">Tradisi Luas Masyarakat</span>
        </div>

        <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-sand-600 dark:text-sand-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Syariah</span>
          </div>
          <div className="text-xl font-bold font-serif text-sand-900 dark:text-sand-50">
            {summary.shariahEligibleCount} <span className="text-xs font-normal text-sand-500">hari sah</span>
          </div>
          <span className="text-[10px] text-sand-500 block">Tauhid, Iddah &amp; Ihram</span>
        </div>
      </div>

      {/* Consensus Highlight */}
      <div className="p-4 rounded-xl bg-prada-500/10 border border-prada-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 text-prada-700 dark:text-prada-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-sm text-sand-950 dark:text-sand-50">
              {summary.allTraditionsAgreedCount} Tanggal Disepakati Seluruh Tradisi
            </h4>
            <p className="text-xs text-sand-700 dark:text-sand-300 mt-0.5">
              Tanggal-tanggal ini memenuhi kriteria Keraton, kaidah gathuk Pesisiran Pati, tradisi populer Jawa, dan sah menurut syariat Islam. Pilihan paling aman untuk merangkul seluruh aspirasi keluarga besar.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-sand-300 dark:border-sand-800 bg-sand-100 dark:bg-obsidian-900">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-sand-200 dark:border-sand-800 bg-sand-200/60 dark:bg-obsidian-950/80">
              <th className="p-3.5 font-serif font-bold text-sand-900 dark:text-sand-100">
                Tanggal &amp; Weton
              </th>
              <th className="p-3.5 font-serif font-bold text-sand-900 dark:text-sand-100 text-center">
                Keraton
              </th>
              <th className="p-3.5 font-serif font-bold text-sand-900 dark:text-sand-100 text-center">
                Pati
              </th>
              <th className="p-3.5 font-serif font-bold text-sand-900 dark:text-sand-100 text-center">
                Populer
              </th>
              <th className="p-3.5 font-serif font-bold text-sand-900 dark:text-sand-100 text-center">
                Syariah
              </th>
              <th className="p-3.5 font-serif font-bold text-sand-900 dark:text-sand-100 text-center">
                Konsensus
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200 dark:divide-sand-800/80">
            {items.map((item) => {
              const k = item.verdicts.keraton;
              const p = item.verdicts.pati;
              const pop = item.verdicts.populer;
              const s = item.verdicts.shariah;

              return (
                <tr
                  key={item.jdn}
                  onClick={() => onSelectDate?.(item.jdn)}
                  className={`hover:bg-sand-200/50 dark:hover:bg-obsidian-850/50 transition-colors cursor-pointer ${
                    item.allAgreed ? 'bg-prada-500/5' : ''
                  }`}
                >
                  <td className="p-3.5 space-y-0.5">
                    <div className="font-semibold text-sand-900 dark:text-sand-50">
                      {item.day.weton.dayName} {item.day.weton.pasaranName}, {item.day.gregorian.day}/{item.day.gregorian.month}/{item.day.gregorian.year}
                    </div>
                    <div className="text-[11px] text-sand-500">
                      {item.day.javanese.day} {item.day.javanese.sasi} {item.day.javanese.year} &bull; Wuku {item.day.pawukon.wuku}
                    </div>
                  </td>

                  {/* Keraton */}
                  <td className="p-3.5 text-center">
                    {k?.isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                        <Check className="w-3 h-3" />
                        <span>Lolos ({k.criteriaMet}/{k.criteriaTotal})</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-800 dark:text-amber-400"
                        title={k?.eliminatedReasons.join('; ')}
                      >
                        <X className="w-3 h-3" />
                        <span>Gugur</span>
                      </span>
                    )}
                  </td>

                  {/* Pati */}
                  <td className="p-3.5 text-center">
                    {p?.isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                        <Check className="w-3 h-3" />
                        <span>Gathuk</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-800 dark:text-amber-400"
                        title={p?.eliminatedReasons.join('; ')}
                      >
                        <X className="w-3 h-3" />
                        <span>Gugur</span>
                      </span>
                    )}
                  </td>

                  {/* Populer */}
                  <td className="p-3.5 text-center">
                    {pop?.isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                        <Check className="w-3 h-3" />
                        <span>Lolos</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-800 dark:text-amber-400"
                        title={pop?.eliminatedReasons.join('; ')}
                      >
                        <X className="w-3 h-3" />
                        <span>Gugur</span>
                      </span>
                    )}
                  </td>

                  {/* Syariah */}
                  <td className="p-3.5 text-center">
                    {s?.isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                        <Check className="w-3 h-3" />
                        <span>Sah</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/15 text-red-800 dark:text-red-400">
                        <X className="w-3 h-3" />
                        <span>Terhalang</span>
                      </span>
                    )}
                  </td>

                  {/* Consensus */}
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.allAgreed
                          ? 'bg-prada-500 text-obsidian-950 ring-1 ring-prada-500/40'
                          : item.consensusCount >= 2
                            ? 'bg-sand-200 dark:bg-obsidian-800 text-sand-800 dark:text-sand-200'
                            : 'bg-sand-100 dark:bg-obsidian-950 text-sand-500'
                      }`}
                    >
                      {item.consensusCount} dari 4 Tradisi
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
