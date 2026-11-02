'use client';

import React, { useState } from 'react';
import type { CandidateResult } from '@tanggal-baik/core';
import { DateCard } from './DateCard';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 rounded-xl text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <p className="font-medium text-sand-800 dark:text-sand-200">
            Ditemukan <strong>{eligible.length} tanggal</strong> yang memenuhi kriteria adat dan syariah.
          </p>
        </div>
        <p className="text-sand-600 dark:text-sand-400 text-xs">
          Diurutkan berdasarkan kelengkapan kriteria &amp; sunnah.
        </p>
      </div>

      {/* Eligible Date Cards */}
      <div className="space-y-4">
        {eligible.map((candidate, idx) => (
          <DateCard
            key={candidate.day.jdn}
            candidate={candidate}
            isTopRecommendation={idx === 0}
            onOpenDrawer={onOpenDrawer}
            {...(onShareCard ? { onShareCard } : {})}
          />
        ))}
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
