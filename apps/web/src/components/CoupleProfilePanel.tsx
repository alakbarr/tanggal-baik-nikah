import React from 'react';
import type { CoupleProfileResult } from '@tanggal-baik/core';
import { formatWeton } from '@tanggal-baik/core';
import { Info, HeartHandshake } from 'lucide-react';

interface CoupleProfilePanelProps {
  profile: CoupleProfileResult;
  groomName?: string;
  brideName?: string;
}

export function CoupleProfilePanel({
  profile,
  groomName = 'Calon Suami',
  brideName = 'Calon Istri',
}: CoupleProfilePanelProps) {
  const gName = groomName.trim() || 'Calon Suami';
  const bName = brideName.trim() || 'Calon Istri';

  return (
    <section
      aria-label="Profil Weton Pasangan"
      className="bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800/80 rounded-xl p-5 md:p-6 space-y-5 transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-sand-200 dark:border-sand-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-prada-700 dark:text-prada-400" />
            <h3 className="font-serif font-bold text-lg text-sand-900 dark:text-sand-50">
              Profil Kecocokan Pasangan (Statis)
            </h3>
          </div>
          <p className="text-xs text-sand-600 dark:text-sand-400 mt-1">
            {gName} ({formatWeton(profile.groomWeton)}, neptu {profile.groomNeptu}) &times; {bName} ({formatWeton(profile.brideWeton)}, neptu {profile.brideNeptu}) &bull; Total Neptu: <strong>{profile.totalNeptu}</strong>
          </p>
        </div>

        <span className="self-start md:self-auto text-xs px-2.5 py-1 rounded bg-sand-200 dark:bg-obsidian-800 text-sand-700 dark:text-sand-300 border border-sand-300 dark:border-sand-700">
          Khazanah Tradisi Jawa
        </span>
      </div>

      {/* Grid of Couple Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {profile.outcomes.map((rule) => (
          <div
            key={rule.ruleId}
            className="p-3.5 rounded-lg bg-sand-50 dark:bg-obsidian-850 border border-sand-200 dark:border-sand-800 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium text-prada-700 dark:text-prada-400">
                [{rule.ruleId}]
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
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

      {/* Edukasi Konsep Sisa Bagi (Modulo) Petungan Jawa */}
      <div className="text-[11px] text-sand-600 dark:text-sand-400 bg-sand-200/40 dark:bg-obsidian-950/40 p-3 rounded-lg border border-sand-300/80 dark:border-sand-800/60 space-y-1">
        <p className="font-semibold text-sand-800 dark:text-sand-200">
          💡 Catatan Aritmatika &amp; Sisa Pembagian (Modulo):
        </p>
        <p className="leading-relaxed">
          Dalam naskah primbon Jawa, pembagian neptu dihitung secara siklis (berulang). Jika hasil pembagian neptu <strong>habis dibagi</strong> (dalam aritmatika komputer sisa 0), maka hitungan primbon jatuh pada <strong>urutan kategori terakhir</strong> (misal: habis dibagi 4 jatuh pada kategori ke-4 <em>Punggel</em>; habis dibagi 5 jatuh pada ke-5 <em>Pati</em>; habis dibagi 7 jatuh pada ke-7 <em>Bale Kedhawang</em>).
        </p>
      </div>

      {/* Mandatory Decoupling & Anti-Fatalism Banner */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-sand-200/50 dark:bg-obsidian-950/60 border border-sand-300 dark:border-sand-800 text-xs text-sand-700 dark:text-sand-300 leading-relaxed">
        <Info className="w-4 h-4 text-prada-700 dark:text-prada-400 shrink-0 mt-0.5" />
        <p>
          <strong>Prinsip Kemandirian Tanggal:</strong> Hasil petungan weton pasangan di atas bersifat tetap untuk Anda berdua dan <em>sama sekali tidak mengurangi, menggugurkan, atau mengubah urutan rekomendasi tanggal akad nikah</em>. Apapun hasil petungan weton pasangan (seperti Pegat, Topo, atau Jodoh), semua pasangan berhak melangsungkan pernikahan pada tanggal-tanggal baik yang memenuhi kriteria adat dan syariah.
        </p>
      </div>
    </section>
  );
}
