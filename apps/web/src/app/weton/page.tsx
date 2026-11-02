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
} from '@tanggal-baik/core';
import { Navbar } from '../../components/Navbar';
import { AntiTathayyurBanner } from '../../components/AntiTathayyurBanner';
import { Calculator, Info } from 'lucide-react';

export default function WetonCheckerPage() {
  const [birthDate, setBirthDate] = useState('1998-05-28');
  const [afterSunset, setAfterSunset] = useState(false);

  const wetonData = useMemo(() => {
    if (!birthDate || birthDate.length < 10) return null;
    const parts = birthDate.split('-').map(Number);
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    if (!year || !month || !day) return null;

    try {
      let jdn = gregorianToJdn(year, month, day);
      if (afterSunset) {
        jdn += 1;
      }

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

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-obsidian-950 bg-batik-pattern transition-colors">
      <AntiTathayyurBanner />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-prada-500/15 text-prada-800 dark:text-prada-300 border border-prada-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Weton Lengkap</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-sand-950 dark:text-sand-50">
            Cek Weton &amp; Koordinat Penanggalan Jawa
          </h1>
          <p className="text-xs md:text-sm text-sand-600 dark:text-sand-400 max-w-xl mx-auto">
            Ketahui weton lahir, neptu, wuku, sadwara (paringkelan), tahun windu, hingga tanggal hijriah secara akurat.
          </p>
        </div>

        {/* Input Card */}
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
              className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
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

        {/* Result Breakdown Card */}
        {wetonData && (
          <div className="p-6 md:p-8 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 space-y-6">
            <div className="text-center pb-4 border-b border-sand-200 dark:border-sand-800">
              <span className="text-xs uppercase tracking-wider font-royal text-prada-700 dark:text-prada-400 font-semibold block">
                Hasil Perhitungan Weton
              </span>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-sand-950 dark:text-sand-50 mt-1">
                {formatWeton(wetonData.weton)}
              </h2>
              <p className="text-sm text-prada-800 dark:text-prada-300 font-semibold mt-0.5">
                Jumlah Neptu: {wetonData.weton.neptu}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block">Penanggalan Jawa</span>
                <span className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100 block">
                  {wetonData.javanese.day} {wetonData.javanese.sasi} {wetonData.javanese.year} {wetonData.javanese.tahun}
                </span>
                <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                  Kurup {wetonData.javanese.kurup}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block">Penanggalan Hijriah</span>
                <span className="font-serif font-bold text-sm text-emerald-800 dark:text-emerald-300 block">
                  {wetonData.hijriKemenag
                    ? `${wetonData.hijriKemenag.day} ${HIJRI_MONTH_NAMES[wetonData.hijriKemenag.month - 1]} ${wetonData.hijriKemenag.year} H`
                    : 'Prakiraan hisab'}
                </span>
                <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                  Kementerian Agama RI
                </span>
              </div>

              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block">Pawukon &amp; Paringkelan</span>
                <span className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100 block">
                  Wuku {wetonData.pawukon.wuku}
                </span>
                <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                  Sadwara: {wetonData.pawukon.sadwara}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block">Dina Pengapesan</span>
                <span className="font-serif font-bold text-sm text-amber-800 dark:text-amber-400 block">
                  {formatWeton(wetonData.pengapesan)}
                </span>
                <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                  Hari ke-{wetonData.weton.neptu} dari hari kelahiran
                </span>
              </div>

              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block">Julian Day Number (JDN)</span>
                <span className="font-mono font-bold text-sm text-sand-900 dark:text-sand-100 block">
                  {wetonData.jdn}
                </span>
                <span className="text-sand-600 dark:text-sand-400 block text-[11px]">
                  Fliegel &amp; Van Flandern
                </span>
              </div>

              <div className="p-4 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1">
                <span className="text-sand-500 dark:text-sand-400 block">Rincian Neptu</span>
                <span className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100 block">
                  {wetonData.weton.dayName} ({wetonData.weton.neptu - (wetonData.weton.pasaranIndex === 0 ? 5 : wetonData.weton.pasaranIndex === 1 ? 9 : wetonData.weton.pasaranIndex === 2 ? 7 : wetonData.weton.pasaranIndex === 3 ? 4 : 8)}) + {wetonData.weton.pasaranName}
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
      </main>
    </div>
  );
}
