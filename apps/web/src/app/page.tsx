'use client';

import React, { useState, useEffect } from 'react';
import {
  solve,
  compareTraditions,
  type SolverResult,
  type CandidateResult,
  type MultiTraditionComparisonResult,
} from '@tanggal-baik/core';
import { AntiTathayyurBanner } from '../components/AntiTathayyurBanner';
import { Navbar } from '../components/Navbar';
import { CoupleForm } from '../components/CoupleForm';
import { CoupleProfilePanel } from '../components/CoupleProfilePanel';
import { ResultsList } from '../components/ResultsList';
import { MonthGridView } from '../components/MonthGridView';
import { TraditionComparisonView } from '../components/TraditionComparisonView';
import { CalculationWalkthroughModal } from '../components/CalculationWalkthroughModal';
import { ProvenanceDrawer } from '../components/ProvenanceDrawer';
import { PrintableReport } from '../components/PrintableReport';
import { ShareCardModal } from '../components/ShareCardModal';
import { coupleFormSchema, type CoupleFormData } from '../lib/schemas';
import {
  LayoutList,
  Calendar as CalendarIcon,
  Sparkles,
  Printer,
  Share2,
  GitCompare,
} from 'lucide-react';

const STORAGE_KEY = 'tbn:v1:couple_data';

const DEFAULT_FORM: CoupleFormData = {
  groomName: 'Bagus',
  groomBirthDate: '1998-05-28',
  groomBirthAfterSunset: false,
  brideName: 'Raras',
  brideBirthDate: '1999-10-28',
  brideBirthAfterSunset: false,
  weddingYear: 2027,
  weekendsOnly: true,
  traditionProfile: 'keraton',
  iddahEndDate: '',
  dinaAlaVariant: 'both',
};

export default function HomePage() {
  const [formData, setFormData] = useState<CoupleFormData>(DEFAULT_FORM);
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<MultiTraditionComparisonResult | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'calendar' | 'compare'>('list');
  const [drawerCandidate, setDrawerCandidate] = useState<CandidateResult | null>(null);
  const [shareCandidate, setShareCandidate] = useState<CandidateResult | null>(null);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isComputing, setIsComputing] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid = coupleFormSchema.safeParse(parsed);
        if (valid.success) {
          setFormData(valid.data);
          runCalculation(valid.data);
          return;
        }
      }
    } catch {
      // Ignore storage parse error
    }

    // Default initial run
    runCalculation(DEFAULT_FORM);
  }, []);

  const runCalculation = (data: CoupleFormData) => {
    setIsComputing(true);
    try {
      const gParts = data.groomBirthDate.split('-').map(Number);
      const bParts = data.brideBirthDate.split('-').map(Number);

      const groomYear = gParts[0] ?? 1998;
      const groomMonth = gParts[1] ?? 5;
      const groomDay = gParts[2] ?? 28;

      const brideYear = bParts[0] ?? 1999;
      const brideMonth = bParts[1] ?? 10;
      const brideDay = bParts[2] ?? 28;

      let iddahEnd: { year: number; month: number; day: number } | undefined;
      if (data.iddahEndDate && data.iddahEndDate.length >= 10) {
        const iddahParts = data.iddahEndDate.split('-').map(Number);
        if (iddahParts[0] && iddahParts[1] && iddahParts[2]) {
          iddahEnd = {
            year: iddahParts[0],
            month: iddahParts[1],
            day: iddahParts[2],
          };
        }
      }

      const groomChildOrder = data.groomChildOrder ? Number(data.groomChildOrder) : undefined;
      const brideChildOrder = data.brideChildOrder ? Number(data.brideChildOrder) : undefined;

      const solveOptions = {
        couple: {
          groom: {
            name: data.groomName,
            birthDate: { year: groomYear, month: groomMonth, day: groomDay },
            birthAfterSunset: data.groomBirthAfterSunset,
            ...(groomChildOrder ? { childOrder: groomChildOrder } : {}),
          },
          bride: {
            name: data.brideName,
            birthDate: { year: brideYear, month: brideMonth, day: brideDay },
            birthAfterSunset: data.brideBirthAfterSunset,
            ...(brideChildOrder ? { childOrder: brideChildOrder } : {}),
          },
          traditionProfile: data.traditionProfile,
          ...(iddahEnd ? { iddahEndDate: iddahEnd } : {}),
        },
        range: {
          start: { year: data.weddingYear, month: 1, day: 1 },
          end: { year: data.weddingYear, month: 12, day: 31 },
        },
        weekendsOnly: data.weekendsOnly,
      };

      const res = solve(solveOptions);
      setSolverResult(res);

      // Also compute 4-tradition comparison
      const comp = compareTraditions(solveOptions);
      setComparisonResult(comp);

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setIsComputing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCalculation(formData);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(DEFAULT_FORM);
    runCalculation(DEFAULT_FORM);
  };

  // Combine eligible + eliminated for full month grid lookup
  const allCandidates = React.useMemo(() => {
    if (!solverResult) return [];
    return [...solverResult.eligible, ...solverResult.eliminated];
  }, [solverResult]);

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-obsidian-950 bg-batik-pattern transition-colors">
      <AntiTathayyurBanner />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-prada-500/15 text-prada-800 dark:text-prada-300 border border-prada-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Harmonisasi Adat Nusantara &amp; Syariat Islam</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-sand-950 dark:text-sand-50 tracking-tight leading-tight">
            Penasihat Waktu Akad Nikah
          </h1>

          <p className="text-sm md:text-base text-sand-700 dark:text-sand-300 leading-relaxed">
            Menghitung dan merekomendasikan tanggal-tanggal akad nikah terbaik dengan hisab falak tradisi Jawa (<em>Kitab Betaljemur Adammakna</em>) serta tuntunan Sunnah Nabi ﷺ yang menenangkan dan bebas dari khurafat.
          </p>
        </div>

        {/* Input Form Card */}
        <section aria-label="Formulir Data Mempelai">
          <CoupleForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isLoading={isComputing}
          />
        </section>

        {/* Results Section */}
        {solverResult && (
          <section aria-label="Hasil Analisis dan Rekomendasi" className="space-y-8">
            {/* Decoupled Static Couple Profile Panel */}
            <CoupleProfilePanel
              profile={solverResult.coupleProfile}
              groomName={formData.groomName}
              brideName={formData.brideName}
              onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
            />

            {/* View Switcher & Action Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 dark:border-sand-800 pb-3">
              <div>
                <h2 className="font-serif font-bold text-2xl text-sand-950 dark:text-sand-50">
                  Rekomendasi Tanggal Akad ({formData.weddingYear})
                </h2>
                <p className="text-xs text-sand-600 dark:text-sand-400 mt-0.5">
                  Menampilkan daftar hari yang bebas dari pantangan adat dan memenuhi kriteria utama kebaikan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-sand-800 bg-sand-100 dark:bg-obsidian-900 text-xs font-semibold text-sand-800 dark:text-sand-200 hover:bg-sand-200 dark:hover:bg-obsidian-850 transition-colors shadow-xs"
                  title="Cetak Laporan Lengkap (PDF)"
                >
                  <Printer className="w-3.5 h-3.5 text-prada-600 dark:text-prada-400" />
                  <span>Cetak Laporan</span>
                </button>

                {solverResult.eligible.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShareCandidate(solverResult.eligible[0] ?? null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-sand-800 bg-sand-100 dark:bg-obsidian-900 text-xs font-semibold text-sand-800 dark:text-sand-200 hover:bg-sand-200 dark:hover:bg-obsidian-850 transition-colors shadow-xs"
                    title="Unduh Kartu Gambar Rekomendasi (PNG)"
                  >
                    <Share2 className="w-3.5 h-3.5 text-prada-600 dark:text-prada-400" />
                    <span>Kartu Grafis</span>
                  </button>
                )}

                {/* Segmented View Control */}
                <div
                  role="group"
                  aria-label="Pilihan Tampilan Hasil"
                  className="inline-flex p-1 rounded-lg border border-sand-300 dark:border-sand-800 bg-sand-100 dark:bg-obsidian-900 text-xs font-medium"
                >
                  <button
                    type="button"
                    onClick={() => setActiveView('list')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      activeView === 'list'
                        ? 'bg-prada-500 text-obsidian-950 font-semibold shadow-xs'
                        : 'text-sand-700 dark:text-sand-300 hover:text-sand-950 dark:hover:text-sand-50'
                    }`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span>Daftar Kartu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('calendar')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      activeView === 'calendar'
                        ? 'bg-prada-500 text-obsidian-950 font-semibold shadow-xs'
                        : 'text-sand-700 dark:text-sand-300 hover:text-sand-950 dark:hover:text-sand-50'
                    }`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Kalender 3 Sistem</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('compare')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      activeView === 'compare'
                        ? 'bg-prada-500 text-obsidian-950 font-semibold shadow-xs'
                        : 'text-sand-700 dark:text-sand-300 hover:text-sand-950 dark:hover:text-sand-50'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Komparasi 4 Tradisi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active View Rendering */}
            {activeView === 'list' ? (
              <ResultsList
                eligible={solverResult.eligible}
                eliminated={solverResult.eliminated}
                onOpenDrawer={(c) => setDrawerCandidate(c)}
                {...(setShareCandidate ? { onShareCard: (c) => setShareCandidate(c) } : {})}
              />
            ) : activeView === 'calendar' ? (
              <MonthGridView
                initialYear={formData.weddingYear}
                initialMonth={1}
                candidates={allCandidates}
                onOpenDrawer={(c) => setDrawerCandidate(c)}
              />
            ) : comparisonResult ? (
              <TraditionComparisonView
                comparison={comparisonResult}
                onSelectDate={(jdn) => {
                  const match = allCandidates.find((c) => c.day.jdn === jdn);
                  if (match) setDrawerCandidate(match);
                }}
              />
            ) : null}
          </section>
        )}
      </main>

      {/* Slide-over Provenance Drawer */}
      <ProvenanceDrawer
        candidate={drawerCandidate}
        onClose={() => setDrawerCandidate(null)}
      />

      {/* Calculation Walkthrough Modal */}
      {solverResult && (
        <CalculationWalkthroughModal
          isOpen={isWalkthroughOpen}
          onClose={() => setIsWalkthroughOpen(false)}
          profile={solverResult.coupleProfile}
          groomName={formData.groomName}
          brideName={formData.brideName}
        />
      )}

      {/* Share Card Modal */}
      <ShareCardModal
        candidate={shareCandidate}
        groomName={formData.groomName}
        brideName={formData.brideName}
        onClose={() => setShareCandidate(null)}
      />

      {/* Printable Report (Phase 6.4 — Clean A4 Print Layout) */}
      <PrintableReport
        formData={formData}
        solverResult={solverResult}
      />

      {/* Footer */}
      <footer className="border-t border-sand-200 dark:border-sand-800/80 mt-16 py-8 text-center text-xs text-sand-600 dark:text-sand-400">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-serif font-semibold text-sand-800 dark:text-sand-200">
            Tanggal Baik Nikah &bull; Khazanah Falak Jawa &amp; Fiqih Sunnah
          </p>
          <p className="max-w-xl mx-auto leading-relaxed">
            Dihitung menggunakan hisab Fliegel-Van Flandern, siklus 210 hari Pawukon, kurup Asapon 1867–1986 Jawa,
            serta verifikasi naskah primer Kitab Betaljemur Adammakna dan dalil hadits shahih.
          </p>
        </div>
      </footer>
    </div>
  );
}
