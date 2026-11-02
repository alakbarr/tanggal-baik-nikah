import React from 'react';
import { Navbar } from '../../components/Navbar';
import { AntiTathayyurBanner } from '../../components/AntiTathayyurBanner';
import { BookOpen, ShieldCheck, Bookmark } from 'lucide-react';

export default function GlossaryPage() {
  const fiqhTerms = [
    {
      term: 'Tathayyur / Thiyarah',
      arabic: 'التَّطَيُّر',
      desc: 'Keyakinan syirik bahwa hari, bulan, angka, burung, atau tanda-tanda alam tertentu membawa kesialan atau nasib buruk. Dilarang keras dalam Islam (HR. Tirmidzi no. 1614, Abu Dawud no. 3910). Seluruh hari adalah ciptaan Allah dan pada hakikatnya adalah baik.',
    },
    {
      term: 'Rukun Nikah (5 Syarat Sah)',
      arabic: 'أَرْكَانُ النِّكَاحِ',
      desc: 'Pilar penentu sahnya akad pernikahan menurut syariat Islam dan hukum positif Indonesia (KHI Pasal 14): (1) Calon mempelai pria, (2) Calon mempelai wanita, (3) Wali nikah, (4) Dua saksi pria yang adil, dan (5) Ijab dan kabul. Perhitungan adat sama sekali tidak membatalkan rukun ini.',
    },
    {
      term: 'Masa Iddah',
      arabic: 'العِدَّةُ',
      desc: 'Masa tunggu bagi wanita setelah perceraian atau wafatnya suami sebelum diperbolehkan menikah kembali (QS. Al-Baqarah: 235). Larangan akad selama masa iddah adalah batasan syariah yang bersifat mutlak.',
    },
    {
      term: 'Larangan Ihram',
      arabic: 'الإِحْرَامُ',
      desc: 'Keadaan suci jamaah saat haji atau umrah. Rasulullah ﷺ melarang orang yang sedang berihram untuk melangsungkan akad nikah atau menikahkan orang lain (HR. Muslim no. 1409).',
    },
    {
      term: 'Taysir (Kemudahan) & Maslahah',
      arabic: 'التَّيْسِيرُ وَالمَصْلَحَةُ',
      desc: 'Kaidah syariah yang menghendaki kemudahan bagi umat. Memilih hari akhir pekan (Sabtu/Ahad) agar sanak saudara dan tetangga dapat hadir bersilaturahmi adalah wujud maslahah yang sangat dianjurkan.',
    },
  ];

  const adatTerms = [
    {
      term: 'Weton & Neptu',
      jv: 'ꦮꦼꦠꦺꦴꦤ꧀ & ꦤꦼꦥ꧀ꦠꦸ',
      desc: 'Weton adalah perpaduan siklus 7 hari Saptawara (Ahad s.d. Sabtu) dan 5 hari pasaran Pancawara (Legi, Pahing, Pon, Wage, Kliwon). Neptu adalah bobot angka spiritual masing-masing hari yang dijumlahkan.',
    },
    {
      term: 'Pawukon (30 Wuku)',
      jv: 'ꦥꦮꦸꦏꦺꦴꦤ꧀',
      desc: 'Siklus 210 hari yang terbagi menjadi 30 babak wuku (masing-masing 7 hari), dimulai dari Wuku Sinta dan berakhir pada Wuku Watugunung.',
    },
    {
      term: 'Kurup Asapon (1867–1986 Jawa / 1936–2052 M)',
      jv: 'ꦏꦸꦫꦸꦥ꧀ ꦄꦱꦥꦺꦴꦤ꧀',
      desc: 'Reckoning kalender Sultan Agungan 120 tahun di mana tahun Alip dimulai pada Selasa Pon (Alip Selasa Pon = Asapon). Setiap 120 tahun terjadi koreksi gugur sedina (1 hari kabisat dibatalkan) untuk menjaga keselarasan dengan bulan qamariyah.',
    },
    {
      term: 'Kunarpaning Warsa & Sangaring Warsa',
      jv: 'ꦏꦸꦤꦂꦥꦤꦶꦁ ꦮꦂꦱ & ꦱꦔꦫꦶꦁ ꦮꦂꦱ',
      desc: 'Kunarpaning Warsa adalah hari terakhir di bulan Besar (akhir tahun Jawa). Sangaring Warsa adalah tanggal 3 Sura. Keduanya dihindari secara adat dalam tradisi keraton demi kehati-hatian awal dan akhir tahun.',
    },
    {
      term: 'Anggaraksih',
      jv: 'ꦄꦁꦒꦫꦏꦱꦶꦃ',
      desc: 'Hari Selasa Kliwon. Dalam Kitab Betaljemur Adammakna No. 12, bulan Jawa yang tidak memiliki hari Selasa Kliwon (sasi suwung) dihindari untuk pelaksanaan akad nikah.',
    },
    {
      term: 'Sa\'at Pasaran',
      jv: 'ꦱꦲꦠꦤ꧀ ꦥꦱꦫꦤ꧀',
      desc: 'Pembagian 5 jendela waktu dalam sehari (masing-masing 2 jam 24 menit dari pukul 06.00 hingga 18.00) berdasarkan hari pasaran untuk menentukan jam pelaksanaan ijab yang tenteram (Slamet/Rejeki).',
    },
  ];

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-obsidian-950 bg-batik-pattern transition-colors">
      <AntiTathayyurBanner />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-prada-500/15 text-prada-800 dark:text-prada-300 border border-prada-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kamus Istilah &amp; Rujukan</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-sand-950 dark:text-sand-50">
            Glosarium Falak &amp; Fiqih Nikah
          </h1>
          <p className="text-xs md:text-sm text-sand-600 dark:text-sand-400 max-w-xl mx-auto">
            Memahami istilah penanggalan tradisi Jawa dan hukum syariat Islam secara jernih, objektif, dan berlandaskan ilmu.
          </p>
        </div>

        {/* Fiqh Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-300 dark:border-sand-800 pb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-serif font-bold text-xl text-sand-900 dark:text-sand-50">
              Istilah Fiqih &amp; Sunnah Syariat
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {fiqhTerms.map((t) => (
              <div
                key={t.term}
                className="p-4 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                    {t.term}
                  </h3>
                  <span className="font-serif text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                    {t.arabic}
                  </span>
                </div>
                <p className="text-xs text-sand-700 dark:text-sand-300 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Adat Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-300 dark:border-sand-800 pb-2">
            <Bookmark className="w-5 h-5 text-prada-700 dark:text-prada-400" />
            <h2 className="font-serif font-bold text-xl text-sand-900 dark:text-sand-50">
              Istilah Petungan Tradisi Jawa
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {adatTerms.map((t) => (
              <div
                key={t.term}
                className="p-4 rounded-xl bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-sand-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-sand-900 dark:text-sand-100">
                    {t.term}
                  </h3>
                  <span className="font-serif text-prada-800 dark:text-prada-400 font-semibold text-xs">
                    {t.jv}
                  </span>
                </div>
                <p className="text-xs text-sand-700 dark:text-sand-300 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
