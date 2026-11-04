'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { CoupleProfileResult } from '@tanggal-baik/core';
import { formatWeton, NEPTU_DAY, NEPTU_PASARAN } from '@tanggal-baik/core';
import {
  X,
  Calculator,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface CalculationWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfileResult;
  groomName: string;
  brideName: string;
}

export function CalculationWalkthroughModal({
  isOpen,
  onClose,
  profile,
  groomName,
  brideName,
}: CalculationWalkthroughModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6'>('step1');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const gName = groomName.trim() || 'Calon Suami';
  const bName = brideName.trim() || 'Calon Istri';
  const gWeton = profile.groomWeton;
  const bWeton = profile.brideWeton;
  const sumNeptu = profile.totalNeptu;

  const gDayNeptu = NEPTU_DAY[gWeton.dayIndex] ?? 5;
  const gPasaranNeptu = NEPTU_PASARAN[gWeton.pasaranIndex] ?? 5;
  const bDayNeptu = NEPTU_DAY[bWeton.dayIndex] ?? 5;
  const bPasaranNeptu = NEPTU_PASARAN[bWeton.pasaranIndex] ?? 5;

  const tabs = [
    { id: 'step1', label: '1. Weton Pria' },
    { id: 'step2', label: '2. Weton Wanita' },
    { id: 'step3', label: '3. Total Neptu' },
    { id: 'step4', label: '4. Bedah Versi Modulo' },
    { id: 'step5', label: '5. Tabu Kultural' },
    { id: 'step6', label: '6. Tuntunan Syariah' },
  ] as const;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="walkthrough-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs"
    >
      <div
        ref={modalRef}
        className="w-full max-w-3xl bg-sand-50 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-sand-200 dark:border-sand-800 bg-sand-100/90 dark:bg-obsidian-950/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-prada-500/15 text-prada-800 dark:text-prada-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-prada-700 dark:text-prada-400 block">
                Bedah Rumus &amp; Aritmatika Petungan
              </span>
              <h2 id="walkthrough-title" className="font-serif font-bold text-lg sm:text-xl text-sand-900 dark:text-sand-50">
                Alur Perhitungan Tanggal Baik Langkah demi Langkah
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela perhitungan"
            className="p-1.5 rounded-lg border border-sand-300 dark:border-sand-800 hover:bg-sand-200 dark:hover:bg-obsidian-850 text-sand-700 dark:text-sand-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-sand-200 dark:border-sand-800 bg-sand-100/40 dark:bg-obsidian-950/50 p-1.5 gap-1 text-xs">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? 'bg-prada-600 text-obsidian-950 font-semibold shadow-xs'
                  : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200/80 dark:hover:bg-obsidian-850'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-sand-800 dark:text-sand-200">
          {/* STEP 1: WETON PRIA */}
          {activeTab === 'step1' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sand-100 dark:bg-obsidian-850 border border-sand-300 dark:border-sand-800 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-prada-700 dark:text-prada-400">
                  Langkah 1: Menghitung Weton Calon Suami
                </span>
                <h3 className="font-serif font-bold text-lg text-sand-950 dark:text-sand-50">
                  {gName} &bull; {formatWeton(gWeton)} (Neptu {profile.groomNeptu})
                </h3>
                <p className="text-sand-700 dark:text-sand-300 leading-relaxed">
                  Dalam penanggalan Jawa (Sultan Agungan), weton adalah pertemuan antara siklus 7 hari mingguan (<em>Saptawara</em>) dan siklus 5 hari pasaran (<em>Pancawara</em>). Masing-masing memiliki nilai angka bobot (<em>neptu</em>) yang dibukukan dalam <em>Kitab Betaljemur Adammakna</em> halaman 7.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1">
                  <span className="text-xs text-sand-500">Hari Saptawara:</span>
                  <div className="text-base font-bold font-serif text-sand-900 dark:text-sand-100">
                    {gWeton.dayName} &rarr; Neptu {gDayNeptu}
                  </div>
                  <span className="text-[11px] text-sand-500 block">
                    Bobot baku: Ahad (5), Senin (4), Selasa (3), Rabu (7), Kamis (8), Jumat (6), Sabtu (9).
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1">
                  <span className="text-xs text-sand-500">Pasaran Pancawara:</span>
                  <div className="text-base font-bold font-serif text-sand-900 dark:text-sand-100">
                    {gWeton.pasaranName} &rarr; Neptu {gPasaranNeptu}
                  </div>
                  <span className="text-[11px] text-sand-500 block">
                    Bobot baku: Legi (5), Pahing (9), Pon (7), Wage (4), Kliwon (8).
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                <strong>Rumus Matematika:</strong> Neptu Hari ({gDayNeptu}) + Neptu Pasaran ({gPasaranNeptu}) = <strong>{profile.groomNeptu}</strong>.
              </div>
            </div>
          )}

          {/* STEP 2: WETON WANITA */}
          {activeTab === 'step2' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sand-100 dark:bg-obsidian-850 border border-sand-300 dark:border-sand-800 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-prada-700 dark:text-prada-400">
                  Langkah 2: Menghitung Weton Calon Istri
                </span>
                <h3 className="font-serif font-bold text-lg text-sand-950 dark:text-sand-50">
                  {bName} &bull; {formatWeton(bWeton)} (Neptu {profile.brideNeptu})
                </h3>
                <p className="text-sand-700 dark:text-sand-300 leading-relaxed">
                  Dengan metode yang sama, hari dan pasaran kelahiran calon mempelai wanita dihitung nilai neptunya. Jika lahir setelah waktu surup/maghrib, penanggalan Jawa telah beralih ke hari berikutnya.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1">
                  <span className="text-xs text-sand-500">Hari Saptawara:</span>
                  <div className="text-base font-bold font-serif text-sand-900 dark:text-sand-100">
                    {bWeton.dayName} &rarr; Neptu {bDayNeptu}
                  </div>
                  <span className="text-[11px] text-sand-500 block">
                    Bobot baku: Ahad (5), Senin (4), Selasa (3), Rabu (7), Kamis (8), Jumat (6), Sabtu (9).
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1">
                  <span className="text-xs text-sand-500">Pasaran Pancawara:</span>
                  <div className="text-base font-bold font-serif text-sand-900 dark:text-sand-100">
                    {bWeton.pasaranName} &rarr; Neptu {bPasaranNeptu}
                  </div>
                  <span className="text-[11px] text-sand-500 block">
                    Bobot baku: Legi (5), Pahing (9), Pon (7), Wage (4), Kliwon (8).
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                <strong>Rumus Matematika:</strong> Neptu Hari ({bDayNeptu}) + Neptu Pasaran ({bPasaranNeptu}) = <strong>{profile.brideNeptu}</strong>.
              </div>
            </div>
          )}

          {/* STEP 3: TOTAL NEPTU */}
          {activeTab === 'step3' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sand-100 dark:bg-obsidian-850 border border-sand-300 dark:border-sand-800 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-prada-700 dark:text-prada-400">
                  Langkah 3: Menjumlahkan Neptu Pasangan
                </span>
                <h3 className="font-serif font-bold text-lg text-sand-950 dark:text-sand-50">
                  Total Neptu: {profile.groomNeptu} + {profile.brideNeptu} = {sumNeptu}
                </h3>
                <p className="text-sand-700 dark:text-sand-300 leading-relaxed">
                  Angka penjumlahan neptu kedua calon pengantin ({sumNeptu}) merupakan nilai dasar yang akan diproses melalui berbagai rumus pembagian siklis (<em>modulo</em>) dalam khazanah naskah primbon dan tradisi Nusantara.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sand-200/50 dark:bg-obsidian-950 border border-sand-300 dark:border-sand-800 space-y-2">
                <h4 className="font-semibold text-sand-900 dark:text-sand-100">
                  💡 Prinsip Aritmatika &amp; Sisa Pembagian (Modulo):
                </h4>
                <p className="text-xs leading-relaxed text-sand-700 dark:text-sand-300">
                  Dalam naskah primbon tradisional, perhitungan dilakukan secara berulang/siklis. Jika hasil pembagian neptu <strong>habis dibagi</strong> (dalam komputer sisa 0), dalam kaidah primbon dihitung jatuh pada <strong>kategori nomor terakhir</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-sand-600 dark:text-sand-400">
                  <li>Habis dibagi 4 (sisa 0) &rarr; jatuh pada kategori ke-4 (<em>Punggel</em>).</li>
                  <li>Habis dibagi 5 (sisa 0) &rarr; jatuh pada kategori ke-5 (<em>Pati</em>).</li>
                  <li>Habis dibagi 7 (sisa 0) &rarr; jatuh pada kategori ke-7 (<em>Bale Kedhawang</em> atau <em>Lebu Katiup Angin</em>).</li>
                  <li>Habis dibagi 9 (sisa 0) &rarr; jatuh pada kategori ke-9 (<em>Pegat</em> atau <em>Pangantèn</em>).</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 4: BEDAH VERSI MODULO */}
          {activeTab === 'step4' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-obsidian-850 border border-sand-300 dark:border-sand-800">
                <span className="text-[11px] font-semibold uppercase text-prada-700 dark:text-prada-400 block mb-1">
                  Langkah 4: Evaluasi Menyeluruh Seluruh Versi Perhitungan
                </span>
                <p className="text-xs text-sand-700 dark:text-sand-300">
                  Berikut hasil pengujian nilai neptu pasangan Anda ({sumNeptu}) terhadap berbagai versi naskah klasik dan tradisi populer:
                </p>
              </div>

              <div className="space-y-3">
                {profile.outcomes.map((rule) => (
                  <div
                    key={rule.ruleId}
                    className="p-3.5 rounded-lg bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-prada-700 dark:text-prada-400">
                          [{rule.ruleId}]
                        </span>
                        <span className="font-bold text-xs text-sand-900 dark:text-sand-100">
                          {rule.labelJv}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          rule.verdict === 'pass'
                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                            : rule.verdict === 'fail'
                              ? 'bg-amber-500/15 text-amber-800 dark:text-amber-400'
                              : 'bg-sand-200 dark:bg-obsidian-800 text-sand-700 dark:text-sand-300'
                        }`}
                      >
                        {rule.verdict === 'pass' ? 'Baik / Favourable' : rule.verdict === 'fail' ? 'Perlu Kehati-hatian' : 'Netral / Sedang'}
                      </span>
                    </div>
                    <p className="text-xs text-sand-600 dark:text-sand-300 leading-relaxed">
                      {rule.explanationId}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: TABU KULTURAL */}
          {activeTab === 'step5' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sand-100 dark:bg-obsidian-850 border border-sand-300 dark:border-sand-800 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-prada-700 dark:text-prada-400">
                  Langkah 5: Tinjauan Tabu Kultural Nusantara
                </span>
                <h3 className="font-serif font-bold text-lg text-sand-950 dark:text-sand-50">
                  Analisis Gehing, Jilu, Lusan, &amp; Tunggal Weton
                </h3>
                <p className="text-sand-700 dark:text-sand-300 leading-relaxed">
                  Selain neptu, tradisi lisan sebagian masyarakat mengenal mitos tabu pernikahan tertentu. Aplikasi ini mengkaji tabu tersebut secara adil dan ilmiah antara perspektif sosiologi adat dan aqidah Islam.
                </p>
              </div>

              <div className="space-y-3">
                {profile.culturalTaboos?.map((taboo) => (
                  <div
                    key={taboo.id}
                    className="p-4 rounded-xl bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                        {taboo.name}
                      </h4>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                          taboo.isTriggered
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-400'
                            : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {taboo.isTriggered ? 'Terdeteksi pada Pasangan' : 'Bebas dari Tabu Ini'}
                      </span>
                    </div>

                    <p className="text-xs text-sand-700 dark:text-sand-300">
                      <strong>Pandangan Adat:</strong> {taboo.adatView}
                    </p>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      <strong>Tinjauan Syariat Islam:</strong> {taboo.fiqhView}
                    </p>
                    <div className="p-2.5 rounded bg-sand-100 dark:bg-obsidian-900 text-xs text-sand-700 dark:text-sand-300">
                      <strong>Saran Hikmah:</strong> {taboo.advice}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: TUNTUNAN SYARIAH */}
          {activeTab === 'step6' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-emerald-950 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-serif font-bold text-lg">
                    Tuntunan Sunnah &amp; Syariat Islam (Tawhid &amp; Taysir)
                  </h3>
                </div>
                <p className="text-xs leading-relaxed">
                  Islam menjunjung tinggi tauhid dan menegaskan bahwa seluruh hari pada hakikatnya adalah ciptaan Allah yang baik. Keyakinan bahwa hari atau weton tertentu mendatangkan kesialan mutlak (<em>tathayyur / thiyarah</em>) adalah larangan dalam syariat.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1">
                  <h4 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                    1. Hakikat Petungan Menurut Fiqih Islam
                  </h4>
                  <p className="text-xs text-sand-700 dark:text-sand-300 leading-relaxed">
                    Petungan adat diposisikan murni sebagai kearifan budaya (<em>'urf</em>) dan sarana musyawarah mufakat demi ketenteraman keluarga besar, bukan keyakinan pembawa nasib mujur ataupun sial. Nasib baik dan buruk sepenuhnya dalam takdir Allah SWT.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1">
                  <h4 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                    2. Rukun Sah Pernikahan (KHI Pasal 14)
                  </h4>
                  <p className="text-xs text-sand-700 dark:text-sand-300 leading-relaxed">
                    Pernikahan sah secara agama dan hukum negara apabila memenuhi 5 rukun: (1) Calon suami, (2) Calon istri, (3) Wali nikah, (4) Dua orang saksi pria, dan (5) Ijab-qabul. Hitungan primbon sama sekali tidak membatalkan keabsahan pernikahan ini.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800 space-y-1">
                  <h4 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                    3. Doa Penolak Kekhawatiran (HR. Ahmad No. 7045)
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-serif italic mb-1">
                    "Allahumma la khaira illa khairuka, wa la thaira illa thairuka, wa la ilaha ghairuka."
                  </p>
                  <p className="text-xs text-sand-600 dark:text-sand-400 leading-relaxed">
                    <em>"Ya Allah, tidak ada kebaikan kecuali kebaikan dari-Mu, tidak ada kesialan kecuali yang Engkau takdirkan, dan tidak ada sesembahan yang berhak disembah selain Engkau."</em>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-sand-200 dark:border-sand-800 bg-sand-100/90 dark:bg-obsidian-950/90 flex items-center justify-between">
          <div className="flex gap-2">
            {activeTab !== 'step1' && (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex((t) => t.id === activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1]!.id);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-sand-800 text-xs font-semibold text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-850 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {activeTab !== 'step6' ? (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex((t) => t.id === activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]!.id);
                }}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-prada-500 hover:bg-prada-400 text-obsidian-950 text-xs font-bold transition-colors"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-prada-500 hover:bg-prada-400 text-obsidian-950 text-xs font-bold transition-colors"
              >
                <span>Tutup Penjelasan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
