'use client';

import React, { useState } from 'react';
import type { CoupleProfileResult } from '@tanggal-baik/core';
import { formatWeton } from '@tanggal-baik/core';
import {
  Info,
  HeartHandshake,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface CoupleProfilePanelProps {
  profile: CoupleProfileResult;
  groomName?: string;
  brideName?: string;
  onOpenWalkthrough?: () => void;
}

interface RuleMeta {
  title: string;
  sourceText: string;
  categoryDesc: string;
  guidanceOnFail?: string;
}

const RULE_METADATA: Record<string, RuleMeta> = {
  'B-01': {
    title: 'Tabel 8 Kategori (Pegat s.d. Pesthi)',
    sourceText: 'Tradisi Populer Modulo 9',
    categoryDesc: 'Pemetaan kerukunan dan komunikasi harian rumah tangga.',
    guidanceOnFail:
      'Hasil seperti Padu atau Pegat disikapi dengan saling menahan ego, menjaga komunikasi terbuka, dan tidak membesarkan masalah sepele.',
  },
  'B-02': {
    title: 'Bale Kedhawang (7 Kategori)',
    sourceText: 'Tradisi Populer Modulo 7',
    categoryDesc: 'Siklus perjalanan ujian dan keteguhan bahtera keluarga.',
    guidanceOnFail:
      'Disikapi dengan mempererat kesabaran menghadapi dinamika rezeki serta cobaan hidup bersama.',
  },
  'J-15': {
    title: 'Pasatohan 9x9 (Matriks 2 Dimensi)',
    sourceText: 'Kitab Betaljemur Adammakna Bab No. 15',
    categoryDesc: 'Koordinat neptu pria dan wanita secara independen.',
    guidanceOnFail:
      'Perbanyak doa kelanggengan (istikharah) dan sedekah tolak bala, serta perkuat komitmen saling percaya.',
  },
  'J-16': {
    title: 'Petungan Modulo 4 (Gondhang - Punggel)',
    sourceText: 'Kitab Betaljemur Adammakna Bab No. 16',
    categoryDesc: 'Klasifikasi 4 karakter kelangsungan rumah tangga.',
    guidanceOnFail:
      'Bila jatuh pada Punggel, leluhur menasihati agar selalu saling mendoakan keselamatan jiwa dan raga pasangan.',
  },
  'J-17': {
    title: 'Kombinasi Hari Lahir (Saptawara)',
    sourceText: 'Kitab Betaljemur Adammakna Bab No. 17',
    categoryDesc: 'Harmonisasi watak bawaan hari kelahiran kedua mempelai.',
    guidanceOnFail:
      'Saling memahami watak dasar pasangan dan menghargai perbedaan pembawaan lahir.',
  },
  'J-22': {
    title: 'Pancasuda Modulo 10/7 (Sumursinaba, dll.)',
    sourceText: 'Kitab Betaljemur Adammakna Bab No. 22',
    categoryDesc: 'Peran sosial, wibawa, dan keberkahan pasangan di masyarakat.',
    guidanceOnFail:
      'Tetap rendah hati, saling mendukung, dan gemar berderma kepada lingkungan sekitar.',
  },
  'J-23': {
    title: 'Petungan Modulo 5 (Sri s.d. Pati)',
    sourceText: 'Kitab Betaljemur Adammakna Bab No. 23',
    categoryDesc: 'Siklus 5 pilar kemakmuran dan ujian fisik/kesehatan.',
    guidanceOnFail:
      'Bila jatuh pada Lara, jaga pola hidup sehat bersama dan hindari membebani pasangan di luar kesanggupannya.',
  },
  'J-24': {
    title: 'Koordinat Lahir Jawa Modulo 9',
    sourceText: 'Kitab Betaljemur Adammakna Bab No. 24',
    categoryDesc: 'Perpaduan hisab weton, sasi, tanggal Jawa, dan tahun windu.',
    guidanceOnFail:
      'Kedepankan musyawarah keluarga dengan kepala dingin dan ikhtiar lahir batin.',
  },
  'J-25': {
    title: 'Koordinat Lahir Jawa Modulo 3',
    sourceText: 'Kitab Betaljemur Adammakna Bab No. 25',
    categoryDesc: 'Siklus 3 pilar: Begja (Untung), Lara (Ujian), Pati (Ketahanan).',
    guidanceOnFail:
      'Kuatkan kesabaran dan tawakal menghadapi setiap dinamika bahtera rumah tangga.',
  },
};

export function CoupleProfilePanel({
  profile,
  groomName = 'Calon Suami',
  brideName = 'Calon Istri',
  onOpenWalkthrough,
}: CoupleProfilePanelProps) {
  const gName = groomName.trim() || 'Calon Suami';
  const bName = brideName.trim() || 'Calon Istri';

  const [activeTab, setActiveTab] = useState<'all' | 'betaljemur' | 'populer'>('all');
  const [showTabooDetails, setShowTabooDetails] = useState(true);
  const [showCodeGuide, setShowCodeGuide] = useState(false);

  const betaljemurRules = profile.outcomes.filter((r) => r.ruleId.startsWith('J-'));
  const populerRules = profile.outcomes.filter((r) => r.ruleId.startsWith('B-'));

  const displayedRules =
    activeTab === 'betaljemur'
      ? betaljemurRules
      : activeTab === 'populer'
        ? populerRules
        : profile.outcomes;

  const detectedTaboos = profile.culturalTaboos?.filter((t) => t.isTriggered) ?? [];

  return (
    <section
      aria-label="Profil Weton Pasangan"
      className="bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800/80 rounded-xl p-5 md:p-6 space-y-6 transition-colors"
    >
      {/* Header with Title and Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-200 dark:border-sand-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-prada-700 dark:text-prada-400" />
            <h3 className="font-serif font-bold text-lg md:text-xl text-sand-900 dark:text-sand-50">
              Profil Pasangan &amp; Petungan Karakter (Statis)
            </h3>
          </div>
          <p className="text-xs text-sand-600 dark:text-sand-400 mt-1">
            {gName} ({formatWeton(profile.groomWeton)}, neptu {profile.groomNeptu}) &times; {bName} ({formatWeton(profile.brideWeton)}, neptu {profile.brideNeptu}) &bull; Total Neptu: <strong>{profile.totalNeptu}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setShowCodeGuide(!showCodeGuide)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-sand-800 bg-sand-50 dark:bg-obsidian-850 hover:bg-sand-200 dark:hover:bg-obsidian-800 text-sand-800 dark:text-sand-200 text-xs font-semibold transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-prada-600 dark:text-prada-400" />
            <span>Panduan Makna Kode B &amp; J</span>
          </button>

          {onOpenWalkthrough && (
            <button
              type="button"
              onClick={onOpenWalkthrough}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prada-500 hover:bg-prada-400 text-obsidian-950 text-xs font-semibold shadow-xs transition-colors"
              title="Buka panduan langkah demi langkah rumus hisab"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Pelajari Rumus &amp; Tahapan Hitung</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Decoupling & Theological Assurance Callout */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 text-xs text-sand-800 dark:text-sand-200">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sand-900 dark:text-sand-100">
            Prinsip Kemandirian Tanggal:
          </p>
          <p className="leading-relaxed text-sand-700 dark:text-sand-300">
            Petungan karakter pasangan di bawah ini bersifat <strong>statis seumur hidup</strong> dan dirancang para leluhur sebagai sarana <em>mawas diri (introspeksi watak)</em>, bukan vonis kepastian nasib apalagi larangan menikah. Apapun hasilnya (seperti <em>Pegat, Lara, Padu,</em> atau <em>Yuwana</em>), hasil ini <strong>sama sekali tidak menggugurkan atau memengaruhi rekomendasi tanggal akad nikah</strong>. Tanggal akad tetap dipilih dari hari-hari yang paling suci, mustajab, dan lapang secara hisab falak dan syariat Islam.
          </p>
        </div>
      </div>

      {/* Expandable Comprehensive Guide on Codes B & J */}
      {showCodeGuide && (
        <div className="p-4 rounded-xl bg-sand-50 dark:bg-obsidian-850 border border-sand-300 dark:border-sand-800 text-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-sand-900 dark:text-sand-100 border-b border-sand-200 dark:border-sand-800 pb-2">
            <BookOpen className="w-4 h-4 text-prada-600 dark:text-prada-400" />
            <span>Cara Memahami Kode Aturan &amp; Mengapa Hasilnya Beragam:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed text-sand-700 dark:text-sand-300">
            <div className="space-y-1.5 bg-white dark:bg-obsidian-950 p-3 rounded-lg border border-sand-200 dark:border-sand-800">
              <h5 className="font-bold text-prada-800 dark:text-prada-300">
                1. Arti Huruf Kode: B dan J
              </h5>
              <p>
                <strong>Kode B (Tradisi Populer / Buku):</strong> Merujuk pada kaidah petungan neptu yang beredar luas dalam tradisi lisan dan buku primbon umum di masyarakat Jawa (misalnya B-01 tabel 8 kategori Pegat–Pesthi dan B-02 Bale Kedhawang).
              </p>
              <p>
                <strong>Kode J (Kitab Betaljemur Adammakna):</strong> Merujuk langsung pada naskah klasik susunan Kangjeng Pangeran Harya Tjakraningrat. Angka di belakang huruf J (seperti J-15, J-17, J-22) adalah <strong>nomor bab asli</strong> di naskah Betaljemur.
              </p>
            </div>

            <div className="space-y-1.5 bg-white dark:bg-obsidian-950 p-3 rounded-lg border border-sand-200 dark:border-sand-800">
              <h5 className="font-bold text-prada-800 dark:text-prada-300">
                2. Mengapa Hasil Tiap Metode Bisa Berbeda?
              </h5>
              <p>
                Satu pasangan bisa mendapatkan hasil yang sangat baik di satu bab (misalnya <em>Yuwana</em> di J-17, <em>Sumursinaba</em> di J-22, atau <em>Begja</em> di J-25), namun mendapat catatan kehati-hatian di bab lain (seperti <em>Padu</em> di B-01 atau <em>Lara</em> di J-23).
              </p>
              <p>
                Ini karena para leluhur menyusun setiap bab untuk memotret sudut pandang berbeda: interaksi watak hari, posisi sosial di masyarakat, dinamika komunikasi sehari-hari, hingga ujian raga. Ini membuktikan bahwa primbon bukanlah ramalan takdir biner mutlak, melainkan instrumen mawas diri.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cultural Taboos Section (Pantangan Kultural Pasangan: Gehing, Jilu, Tunggal Weton) */}
      {profile.culturalTaboos && profile.culturalTaboos.length > 0 && (
        <div className="rounded-xl border border-sand-300 dark:border-sand-800 overflow-hidden bg-sand-50 dark:bg-obsidian-850">
          <div className="flex items-center justify-between p-3.5 bg-sand-200/60 dark:bg-obsidian-800 border-b border-sand-300 dark:border-sand-800">
            <div className="flex items-center gap-2">
              {detectedTaboos.length > 0 ? (
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <h4 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                Pemeriksaan Pantangan Kultural Adat Pasangan ({profile.culturalTaboos.length} Kaidah)
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setShowTabooDetails(!showTabooDetails)}
              className="text-xs font-semibold text-sand-700 dark:text-sand-300 hover:text-sand-950 dark:hover:text-sand-100 flex items-center gap-1"
            >
              <span>{showTabooDetails ? 'Sembunyikan' : 'Lihat Rincian'}</span>
              {showTabooDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showTabooDetails && (
            <div className="p-4 space-y-3 divide-y divide-sand-200 dark:divide-sand-800/80">
              {profile.culturalTaboos.map((taboo) => {
                const isApplicable = taboo.isApplicable !== false;
                const isDetected = taboo.isTriggered;

                return (
                  <div key={taboo.id} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sand-900 dark:text-sand-100 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            !isApplicable
                              ? 'bg-sand-400 dark:bg-sand-600'
                              : isDetected
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                          }`}
                        />
                        {taboo.name}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          !isApplicable
                            ? 'bg-sand-200 dark:bg-obsidian-800 text-sand-700 dark:text-sand-300 border border-sand-300 dark:border-sand-700'
                            : isDetected
                              ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {!isApplicable
                          ? 'Perlu Data Urutan Anak'
                          : isDetected
                            ? 'Terdeteksi Pantangan Adat'
                            : 'Bebas Pantangan'}
                      </span>
                    </div>

                    <p className="text-sand-700 dark:text-sand-300 leading-relaxed">
                      <strong>Kajian Adat:</strong> {taboo.adatView}
                    </p>
                    <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      <strong>Tuntunan Syariah:</strong> {taboo.fiqhView}
                    </p>
                    <p className="text-sand-600 dark:text-sand-400 bg-sand-200/50 dark:bg-obsidian-900 p-2.5 rounded-lg border border-sand-300/60 dark:border-sand-800 leading-relaxed">
                      💡 <strong>Ikhtiar &amp; Nasihat:</strong> {taboo.advice}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tabs Filter for Couple Rules */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 dark:border-sand-800 pb-2">
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-prada-500 text-obsidian-950 font-bold'
                : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800'
            }`}
          >
            Semua Kaidah ({profile.outcomes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('betaljemur')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'betaljemur'
                ? 'bg-prada-500 text-obsidian-950 font-bold'
                : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800'
            }`}
          >
            Betaljemur Adammakna ({betaljemurRules.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('populer')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'populer'
                ? 'bg-prada-500 text-obsidian-950 font-bold'
                : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800'
            }`}
          >
            Tradisi Populer ({populerRules.length})
          </button>
        </div>

        <span className="text-[11px] text-sand-500 dark:text-sand-400">
          Menampilkan {displayedRules.length} analisis pasangan
        </span>
      </div>

      {/* Grid of Couple Rules with Clear Titles and Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {displayedRules.map((rule) => {
          const meta = RULE_METADATA[rule.ruleId];

          return (
            <div
              key={rule.ruleId}
              className="p-4 rounded-xl bg-sand-50 dark:bg-obsidian-850 border border-sand-300/80 dark:border-sand-800 space-y-3 flex flex-col justify-between shadow-2xs"
            >
              <div className="space-y-2">
                {/* Header: Rule Code, Clear Title, and Verdict Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-sand-200 dark:bg-obsidian-800 text-prada-800 dark:text-prada-300">
                        {rule.ruleId}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-sand-900 dark:text-sand-100">
                        {meta?.title ?? rule.ruleId}
                      </h4>
                    </div>
                    <p className="text-[10px] text-sand-500 dark:text-sand-400 mt-0.5">
                      {meta?.sourceText ??
                        (rule.ruleId.startsWith('B-')
                          ? 'Naskah Tradisi Populer'
                          : 'Kitab Betaljemur Adammakna')}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-bold shrink-0 ${
                      rule.verdict === 'pass'
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                        : rule.verdict === 'fail'
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-sand-200 dark:bg-obsidian-800 text-sand-700 dark:text-sand-300 border border-sand-300 dark:border-sand-700'
                    }`}
                  >
                    {rule.labelJv}
                  </span>
                </div>

                {/* Calculation Arithmetic Explanation */}
                <p className="text-xs text-sand-700 dark:text-sand-300 leading-relaxed">
                  {rule.explanationId}
                </p>

                {/* Guidance on Fail / Caution */}
                {meta?.guidanceOnFail && rule.verdict === 'fail' && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-[11px] text-sand-700 dark:text-sand-300 leading-snug">
                    💡 <strong>Penyelarasan Sikap:</strong> {meta.guidanceOnFail}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-sand-200/80 dark:border-sand-800/80 flex items-center justify-between text-[10px] text-sand-500 dark:text-sand-400">
                <span className="truncate">{meta?.categoryDesc ?? 'Kaidah Petungan Karakter'}</span>
                <span className="font-semibold text-sand-700 dark:text-sand-300">
                  {rule.verdict === 'pass' ? 'Rahayu / Baik' : 'Perlu Mawas Diri'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edukasi Konsep Sisa Bagi (Modulo) Petungan Jawa */}
      <div className="text-[11px] text-sand-600 dark:text-sand-400 bg-sand-200/40 dark:bg-obsidian-950/40 p-3.5 rounded-lg border border-sand-300/80 dark:border-sand-800/60 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-sand-800 dark:text-sand-200">
          <Sparkles className="w-3.5 h-3.5 text-prada-600 dark:text-prada-400" />
          <span>Kaidah Aritmatika &amp; Sisa Pembagian (Modulo) Siklis:</span>
        </div>
        <p className="leading-relaxed">
          Dalam naskah primbon Jawa, pembagian neptu dihitung secara siklis (berulang). Jika hasil pembagian neptu <strong>habis dibagi</strong> (dalam aritmatika komputer sisa 0), maka hitungan primbon jatuh pada <strong>urutan kategori terakhir</strong>. Contoh: sisa pembagian 4 jatuh pada ke-4 <em>Punggel</em>; sisa pembagian 5 jatuh pada ke-5 <em>Pati</em>; sisa pembagian 7 jatuh pada ke-7 <em>Bale Kedhawang</em>; sisa pembagian 9 jatuh pada ke-9 <em>Dadi Pangauban</em>.
        </p>
      </div>
    </section>
  );
}
