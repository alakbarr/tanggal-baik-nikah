'use client';

import React, { useEffect, useRef } from 'react';
import type { CandidateResult } from '@tanggal-baik/core';
import { formatDayPointDescription } from '@tanggal-baik/core';
import { X, BookOpen, ShieldCheck, Scale, Compass, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ProvenanceDrawerProps {
  candidate: CandidateResult | null;
  onClose: () => void;
}

export function ProvenanceDrawer({ candidate, onClose }: ProvenanceDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape & trap focus
  useEffect(() => {
    if (!candidate) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [candidate, onClose]);

  if (!candidate) return null;

  const day = candidate.day;
  const isEligible = candidate.eliminatedBy.length === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
    >
      <div
        ref={drawerRef}
        className="w-full max-w-2xl bg-sand-50 dark:bg-obsidian-900 border-l border-sand-300 dark:border-sand-800 h-full overflow-y-auto flex flex-col shadow-2xl transition-all"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-sand-100/95 dark:bg-obsidian-900/95 backdrop-blur border-b border-sand-200 dark:border-sand-800">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-royal text-prada-700 dark:text-prada-400 font-semibold block">
              Transparansi Dalil &amp; Kitab Rujukan
            </span>
            <h2 id="drawer-title" className="font-serif font-bold text-lg md:text-xl text-sand-900 dark:text-sand-50">
              {formatDayPointDescription(day)}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela penjelasan"
            className="p-2 rounded-lg border border-sand-300 dark:border-sand-800 hover:bg-sand-200 dark:hover:bg-obsidian-800 text-sand-700 dark:text-sand-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 md:p-6 space-y-6 flex-1 text-xs md:text-sm">
          {/* Status Badge */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isEligible
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-900 dark:text-amber-200'
            }`}
          >
            <Scale className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                {isEligible
                  ? `Tanggal Memenuhi Syarat (${candidate.criteriaMet} dari ${candidate.criteriaTotal} kriteria adat)`
                  : `Tanggal Gugur (${candidate.eliminatedBy.length} pantangan adat terdeteksi)`}
              </p>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {isEligible
                  ? 'Tanggal ini lolos dari seluruh pantangan keras tahunan dan bulanan, serta memenuhi kriteria utama rekomendasi.'
                  : 'Tanggal ini bertepatan dengan hari/tanggal yang dipantangkan dalam naskah primbon tradisi yang dipilih.'}
              </p>
            </div>
          </div>

          {/* Dual-Track Section */}
          <div className="space-y-6">
            {/* Track 1: Fiqh & Sunnah */}
            <section className="bg-sand-100 dark:bg-obsidian-850 p-4 rounded-xl border border-sand-300 dark:border-sand-800 space-y-3">
              <div className="flex items-center justify-between border-b border-sand-200 dark:border-sand-800 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-serif font-bold text-base text-sand-900 dark:text-sand-50">
                    Jalur 1: Tuntunan Syariah &amp; Sunnah Nabi ﷺ
                  </h3>
                </div>

                <Link
                  href="/glossary"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <span>Glosarium Fiqih</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3 text-sand-700 dark:text-sand-300 leading-relaxed text-xs">
                <div>
                  <p className="font-semibold text-sand-900 dark:text-sand-100">1. Kebebasan Waktu Akad (Anti-Tathayyur / Thiyarah)</p>
                  <p>
                    Dalam pandangan Islam, seluruh hari diciptakan baik oleh Allah ﷻ. Tidak ada hari yang membawa sial atau kesempitan bawaan. Rasulullah ﷺ bersabda: <em>&ldquo;Bukan golongan kami orang yang beranggapan sial atau dianggapkan sial baginya.&rdquo;</em> (HR. Thabrani, hasan; HR. Tirmidzi no. 1614).
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-sand-900 dark:text-sand-100">2. Keabsahan 5 Rukun Nikah (KHI Pasal 14)</p>
                  <p>
                    Perkawinan sah apabila memenuhi: (1) Calon suami, (2) Calon istri, (3) Wali nikah, (4) Dua orang saksi pria yang adil, dan (5) Ijab dan kabul. Mahar wajib diberikan namun bukan rukun akad (KHI Pasal 34 ayat 1). Pantangan tanggal adat sama sekali tidak membatalkan keabsahan pernikahan.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-sand-900 dark:text-sand-100">3. Waktu yang Dianjurkan (Sunnah &amp; Maslahah)</p>
                  <p>
                    Menikah di bulan Syawal memiliki preseden langsung dari pernikahan Rasulullah ﷺ dengan Ibunda Aisyah radhiyallahu &lsquo;anha (HR. Muslim no. 1423). Hari Jumat adalah hari terbaik dalam sepekan (HR. Muslim no. 854), dan akhir pekan memudahkan silaturahmi para tamu undangan (prinsip <em>taysir</em> / kemudahan).
                  </p>
                </div>
              </div>
            </section>

            {/* Track 2: Javanese Petungan */}
            <section className="bg-sand-100 dark:bg-obsidian-850 p-4 rounded-xl border border-sand-300 dark:border-sand-800 space-y-3">
              <div className="flex items-center justify-between border-b border-sand-200 dark:border-sand-800 pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-prada-700 dark:text-prada-400" />
                  <h3 className="font-serif font-bold text-base text-sand-900 dark:text-sand-50">
                    Jalur 2: Kajian Petungan Tradisi Jawa
                  </h3>
                </div>

                <Link
                  href="/glossary"
                  className="inline-flex items-center gap-1 text-[11px] text-prada-700 dark:text-prada-400 hover:underline"
                >
                  <span>Glosarium Adat</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Evaluated Rules Details */}
              <div className="space-y-2.5">
                {candidate.outcomes.map((outcome) => (
                  <div
                    key={outcome.ruleId}
                    className="p-3 rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-prada-800 dark:text-prada-400">
                        [{outcome.ruleId}] {outcome.labelJv}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                          outcome.verdict === 'pass'
                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                            : outcome.verdict === 'fail'
                              ? 'bg-amber-500/15 text-amber-800 dark:text-amber-400'
                              : 'bg-sand-200 dark:bg-obsidian-800 text-sand-700 dark:text-sand-300'
                        }`}
                      >
                        {outcome.verdict === 'pass'
                          ? 'Memenuhi'
                          : outcome.verdict === 'fail'
                            ? 'Pantangan'
                            : 'Keterangan'}
                      </span>
                    </div>
                    <p className="text-xs text-sand-700 dark:text-sand-300 leading-snug">
                      {outcome.explanationId}
                    </p>
                  </div>
                ))}
              </div>

              {/* Saat Pasaran execution hours (Betaljemur No. 35) */}
              <div className="mt-4 p-3.5 rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-prada-900 dark:text-prada-300">
                  <Compass className="w-4 h-4" />
                  <span>Panduan Waktu Ijab: Sa&lsquo;at Pasaran ({day.weton.pasaranName}) &bull; Betaljemur No. 35</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-sand-700 dark:text-sand-300 font-mono">
                  {candidate.saat.map((s) => (
                    <div
                      key={s.start}
                      className={`px-2 py-1 rounded flex items-center justify-between ${
                        s.labelJv === 'Slamet' || s.labelJv === 'Rejeki'
                          ? 'bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-500/20'
                          : 'bg-sand-100 dark:bg-obsidian-900 text-sand-600 dark:text-sand-400'
                      }`}
                    >
                      <span>Pukul {s.start}–{s.end} WIB</span>
                      <span>{s.labelJv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saat Tanggal execution hours (Betaljemur No. 36) */}
              {candidate.saatTanggal && candidate.saatTanggal.length > 0 && (
                <div className="p-3.5 rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-prada-900 dark:text-prada-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Sa&lsquo;at Tanggal &amp; Malaikat Penjaga (Tanggal {day.javanese.day} Jawa) &bull; Betaljemur No. 36</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-sand-700 dark:text-sand-300 font-mono">
                    {candidate.saatTanggal.map((st) => (
                      <div
                        key={st.start}
                        className={`px-2 py-1 rounded flex items-center justify-between ${
                          st.verdict === 'pass'
                            ? 'bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-500/20'
                            : 'bg-sand-100 dark:bg-obsidian-900 text-sand-600 dark:text-sand-400'
                        }`}
                      >
                        <span>Pukul {st.start}–{st.end} ({st.angel})</span>
                        <span>{st.quality}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-sand-100 dark:bg-obsidian-950 border-t border-sand-200 dark:border-sand-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-sand-200 dark:bg-obsidian-800 hover:bg-sand-300 dark:hover:bg-obsidian-750 text-sand-800 dark:text-sand-200 transition-colors"
          >
            Tutup Penjelasan
          </button>
        </div>
      </div>
    </div>
  );
}
