'use client';

import React, { useState, useMemo } from 'react';
import {
  gregorianToJdn,
  getWetonFromJdn,
  formatWeton,
  jdnToJavanese,
  getPawukonFromJdn,
  getHijriDate,
  HIJRI_MONTH_NAMES,
  calculateDinaPengapesan,
  solve,
} from '@tanggal-baik/core';
import { Navbar } from '../../components/Navbar';
import { AntiTathayyurBanner } from '../../components/AntiTathayyurBanner';
import {
  Calculator,
  Info,
  User,
  Users,
  Sparkles,
} from 'lucide-react';

export default function WetonCheckerPage() {
  const [mode, setMode] = useState<'single' | 'couple'>('single');

  // Single mode state
  const [birthDate, setBirthDate] = useState('1998-05-28');
  const [afterSunset, setAfterSunset] = useState(false);

  // Couple mode state
  const [groomBirthDate, setGroomBirthDate] = useState('1998-05-28');
  const [groomAfterSunset, setGroomAfterSunset] = useState(false);
  const [groomChildOrder, setGroomChildOrder] = useState<number>(1);

  const [brideBirthDate, setBrideBirthDate] = useState('1999-10-28');
  const [brideAfterSunset, setBrideAfterSunset] = useState(false);
  const [brideChildOrder, setBrideChildOrder] = useState<number>(2);

  // Single calculations
  const singleWetonData = useMemo(() => {
    if (!birthDate || birthDate.length < 10) return null;
    const parts = birthDate.split('-').map(Number);
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    if (!year || !month || !day) return null;

    try {
      let jdn = gregorianToJdn(year, month, day);
      if (afterSunset) jdn += 1;

      const weton = getWetonFromJdn(jdn);
      const javanese = jdnToJavanese(jdn);
      const pawukon = getPawukonFromJdn(jdn);
      const hijriKemenag = getHijriDate(jdn, 'kemenag');
      const hijriKhgt = getHijriDate(jdn, 'khgt');
      const pengapesan = calculateDinaPengapesan(weton);

      return {
        jdn,
        weton,
        javanese,
        pawukon,
        hijriKemenag,
        hijriKhgt,
        pengapesan,
      };
    } catch {
      return null;
    }
  }, [birthDate, afterSunset]);

  // Couple calculations
  const coupleData = useMemo(() => {
    if (!groomBirthDate || !brideBirthDate) return null;
    const gParts = groomBirthDate.split('-').map(Number);
    const bParts = brideBirthDate.split('-').map(Number);

    const gy = gParts[0];
    const gm = gParts[1];
    const gd = gParts[2];

    const by = bParts[0];
    const bm = bParts[1];
    const bd = bParts[2];

    if (!gy || !gm || !gd || !by || !bm || !bd) return null;

    try {
      let gJdn = gregorianToJdn(gy, gm, gd);
      if (groomAfterSunset) gJdn += 1;
      const gWeton = getWetonFromJdn(gJdn);

      let bJdn = gregorianToJdn(by, bm, bd);
      if (brideAfterSunset) bJdn += 1;
      const bWeton = getWetonFromJdn(bJdn);

      const solver = solve({
        couple: {
          groom: {
            birthDate: { year: gy, month: gm, day: gd },
            birthAfterSunset: groomAfterSunset,
            childOrder: groomChildOrder,
          },
          bride: {
            birthDate: { year: by, month: bm, day: bd },
            birthAfterSunset: brideAfterSunset,
            childOrder: brideChildOrder,
          },
        },
        range: {
          start: { year: 2027, month: 1, day: 1 },
          end: { year: 2027, month: 1, day: 1 },
        },
      });

      return {
        gWeton,
        bWeton,
        profile: solver.coupleProfile,
        taboos: solver.coupleProfile.culturalTaboos ?? [],
      };
    } catch {
      return null;
    }
  }, [
    groomBirthDate,
    groomAfterSunset,
    groomChildOrder,
    brideBirthDate,
    brideAfterSunset,
    brideChildOrder,
  ]);

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-obsidian-950 bg-batik-pattern transition-colors">
      <AntiTathayyurBanner />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-prada-500/15 text-prada-800 dark:text-prada-300 border border-prada-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Falak &amp; Weton Nusantara</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-sand-950 dark:text-sand-50">
            Cek Weton &amp; Analisis Perjodohan Jawa
          </h1>
          <p className="text-xs md:text-sm text-sand-600 dark:text-sand-400 max-w-xl mx-auto">
            Hitung weton kelahiran, neptu, wuku, sadwara (paringkelan), dan telaah kecocokan weton pasangan berdasarkan naskah Kitab Betaljemur Adammakna dan tradisi nusantara.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center">
          <div
            role="group"
            aria-label="Pilihan Mode Analisis"
            className="inline-flex p-1 rounded-xl border border-sand-300 dark:border-sand-800 bg-sand-100 dark:bg-obsidian-900 text-xs font-semibold"
          >
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
                mode === 'single'
                  ? 'bg-prada-500 text-obsidian-950 shadow-xs'
                  : 'text-sand-700 dark:text-sand-300 hover:text-sand-950 dark:hover:text-sand-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Cek Weton Individu</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('couple')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
                mode === 'couple'
                  ? 'bg-prada-500 text-obsidian-950 shadow-xs'
                  : 'text-sand-700 dark:text-sand-300 hover:text-sand-950 dark:hover:text-sand-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Analisis Weton Pasangan</span>
            </button>
          </div>
        </div>

        {/* SINGLE MODE */}
        {mode === 'single' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 shadow-sm max-w-xl mx-auto space-y-4">
              <div>
                <label htmlFor="birthInput" className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1">
                  Pilih Tanggal Lahir (Masehi)
                </label>
                <input
                  id="birthInput"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-300 dark:border-sand-700 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-sand-600 dark:text-sand-400">
                <input
                  type="checkbox"
                  checked={afterSunset}
                  onChange={(e) => setAfterSunset(e.target.checked)}
                  className="rounded border-sand-400 text-prada-600 focus:ring-prada-500"
                />
                <span>Lahir setelah waktu maghrib / surup (+1 hari pada kalender Jawa &amp; Hijriah)</span>
              </label>
            </div>

            {singleWetonData && (
              <div className="p-6 md:p-8 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 space-y-6 animate-in fade-in duration-200">
                <div className="text-center pb-4 border-b border-sand-200 dark:border-sand-800">
                  <span className="text-xs uppercase tracking-wider font-royal text-prada-700 dark:text-prada-400 font-semibold block">
                    Hasil Perhitungan Weton
                  </span>
                  <h2 className="font-serif font-bold text-3xl md:text-4xl text-sand-950 dark:text-sand-50 mt-1">
                    {formatWeton(singleWetonData.weton)}
                  </h2>
                  <p className="text-sm text-prada-800 dark:text-prada-300 font-semibold mt-0.5">
                    Jumlah Neptu: {singleWetonData.weton.neptu}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                    <span className="text-sand-500 dark:text-sand-400 block">Penanggalan Jawa</span>
                    <span className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100 block">
                      {singleWetonData.javanese.day} {singleWetonData.javanese.sasi} {singleWetonData.javanese.year} {singleWetonData.javanese.tahun}
                    </span>
                    <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                      Kurup {singleWetonData.javanese.kurup}
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                    <span className="text-sand-500 dark:text-sand-400 block">Penanggalan Hijriah</span>
                    <span className="font-serif font-bold text-sm text-emerald-800 dark:text-emerald-300 block">
                      {singleWetonData.hijriKemenag
                        ? `${singleWetonData.hijriKemenag.day} ${HIJRI_MONTH_NAMES[singleWetonData.hijriKemenag.month - 1]} ${singleWetonData.hijriKemenag.year} H`
                        : 'Prakiraan hisab'}
                    </span>
                    <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                      Kementerian Agama RI
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                    <span className="text-sand-500 dark:text-sand-400 block">Pawukon &amp; Paringkelan</span>
                    <span className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100 block">
                      Wuku {singleWetonData.pawukon.wuku}
                    </span>
                    <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                      Sadwara: {singleWetonData.pawukon.sadwara}
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                    <span className="text-sand-500 dark:text-sand-400 block">Dina Pengapesan</span>
                    <span className="font-serif font-bold text-sm text-amber-800 dark:text-amber-400 block">
                      {formatWeton(singleWetonData.pengapesan)}
                    </span>
                    <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                      Hari ke-{singleWetonData.weton.neptu} dari hari kelahiran
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                    <span className="text-sand-500 dark:text-sand-400 block">Julian Day Number (JDN)</span>
                    <span className="font-mono font-bold text-sm text-sand-900 dark:text-sand-100 block">
                      {singleWetonData.jdn}
                    </span>
                    <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                      Fliegel &amp; Van Flandern
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                    <span className="text-sand-500 dark:text-sand-400 block">Rincian Neptu</span>
                    <span className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100 block">
                      {singleWetonData.weton.dayName} + {singleWetonData.weton.pasaranName}
                    </span>
                    <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                      Saptawara + Pancawara
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800/80 text-xs text-sand-700 dark:text-sand-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-prada-700 dark:text-prada-400 shrink-0 mt-0.5" />
                  <p>
                    Petungan weton adalah kearifan budaya Jawa untuk mawas diri dan memahami siklus waktu, bukan sarana meramal takdir mutlak. Kehidupan dan jodoh berada sepenuhnya dalam ketetapan Allah ﷻ.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COUPLE MODE */}
        {mode === 'couple' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Groom Card */}
              <div className="p-5 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-sand-200 dark:border-sand-800 pb-2">
                  <User className="w-4 h-4 text-prada-700 dark:text-prada-400" />
                  <h3 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-50">
                    Data Calon Suami
                  </h3>
                </div>

                <div>
                  <label htmlFor="groomBirth" className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    id="groomBirth"
                    type="date"
                    value={groomBirthDate}
                    onChange={(e) => setGroomBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-300 dark:border-sand-700 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
                  />
                </div>

                <div>
                  <label htmlFor="groomOrder" className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1">
                    Urutan Kelahiran (Anak ke-)
                  </label>
                  <input
                    id="groomOrder"
                    type="number"
                    min={1}
                    max={15}
                    value={groomChildOrder}
                    onChange={(e) => setGroomChildOrder(Number(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-300 dark:border-sand-700 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-sand-600 dark:text-sand-400">
                  <input
                    type="checkbox"
                    checked={groomAfterSunset}
                    onChange={(e) => setGroomAfterSunset(e.target.checked)}
                    className="rounded border-sand-400 text-prada-600 focus:ring-prada-500"
                  />
                  <span>Lahir setelah maghrib / surup</span>
                </label>
              </div>

              {/* Bride Card */}
              <div className="p-5 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-sand-200 dark:border-sand-800 pb-2">
                  <User className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-50">
                    Data Calon Istri
                  </h3>
                </div>

                <div>
                  <label htmlFor="brideBirth" className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    id="brideBirth"
                    type="date"
                    value={brideBirthDate}
                    onChange={(e) => setBrideBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-300 dark:border-sand-700 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
                  />
                </div>

                <div>
                  <label htmlFor="brideOrder" className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1">
                    Urutan Kelahiran (Anak ke-)
                  </label>
                  <input
                    id="brideOrder"
                    type="number"
                    min={1}
                    max={15}
                    value={brideChildOrder}
                    onChange={(e) => setBrideChildOrder(Number(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-300 dark:border-sand-700 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-sand-600 dark:text-sand-400">
                  <input
                    type="checkbox"
                    checked={brideAfterSunset}
                    onChange={(e) => setBrideAfterSunset(e.target.checked)}
                    className="rounded border-sand-400 text-prada-600 focus:ring-prada-500"
                  />
                  <span>Lahir setelah maghrib / surup</span>
                </label>
              </div>
            </div>

            {/* Couple Results */}
            {coupleData && (
              <div className="p-6 md:p-8 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 space-y-6 animate-in fade-in duration-200">
                <div className="text-center pb-4 border-b border-sand-200 dark:border-sand-800">
                  <span className="text-xs uppercase tracking-wider font-royal text-prada-700 dark:text-prada-400 font-semibold block">
                    Kecocokan Weton Pasangan
                  </span>
                  <h2 className="font-serif font-bold text-2xl md:text-3xl text-sand-950 dark:text-sand-50 mt-1">
                    {formatWeton(coupleData.gWeton)} &times; {formatWeton(coupleData.bWeton)}
                  </h2>
                  <p className="text-sm text-sand-600 dark:text-sand-400 mt-1">
                    Neptu Suami: <strong>{coupleData.gWeton.neptu}</strong> &bull; Neptu Istri: <strong>{coupleData.bWeton.neptu}</strong> &bull; Total Neptu: <strong>{coupleData.gWeton.neptu + coupleData.bWeton.neptu}</strong>
                  </p>
                </div>

                {/* Cultural Taboos Assessment */}
                <div className="p-4 rounded-xl bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-prada-700 dark:text-prada-400" />
                    <h4 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                      Audit Pantangan Kultural Adat (Gehing, Jilu, Tunggal Weton)
                    </h4>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {coupleData.taboos.map((taboo) => {
                      const isDetected = taboo.isTriggered;
                      return (
                        <div key={taboo.id} className="p-3 rounded-lg bg-sand-100 dark:bg-obsidian-900 border border-sand-200 dark:border-sand-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sand-900 dark:text-sand-100">
                              {taboo.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                isDetected
                                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                                  : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                              }`}
                            >
                              {isDetected ? 'Terdeteksi Pantangan' : 'Bebas Pantangan'}
                            </span>
                          </div>
                          <p className="text-sand-700 dark:text-sand-300">{taboo.adatView}</p>
                          <p className="text-emerald-800 dark:text-emerald-300"><strong>Syariat:</strong> {taboo.fiqhView}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 9 Couple Rules Grid */}
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                    Hasil Kaidah Pasatohan &amp; Pancasuda ({coupleData.profile.outcomes.length} Kaidah)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {coupleData.profile.outcomes.map((rule) => (
                      <div
                        key={rule.ruleId}
                        className="p-3.5 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-medium text-prada-700 dark:text-prada-400">
                            [{rule.ruleId}]
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-semibold ${
                              rule.verdict === 'pass'
                                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                                : rule.verdict === 'fail'
                                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-400'
                                  : 'bg-sand-200 dark:bg-obsidian-800 text-sand-700 dark:text-sand-300'
                            }`}
                          >
                            {rule.labelJv}
                          </span>
                        </div>
                        <p className="text-xs text-sand-700 dark:text-sand-300 leading-snug">
                          {rule.explanationId}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mandatory Decoupling Notice */}
                <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-950 border border-sand-200 dark:border-sand-800/80 text-xs text-sand-700 dark:text-sand-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-prada-700 dark:text-prada-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Kemandirian Tanggal Akad:</strong> Hasil kecocokan pasangan di atas merupakan kajian profil statis. Perbedaan kategori weton tidak menggugurkan hak pasangan untuk menikah dan tidak mengubah status hari-hari baik yang direkomendasikan pada halaman utama.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
