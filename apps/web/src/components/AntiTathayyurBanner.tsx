import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function AntiTathayyurBanner() {
  return (
    <aside
      aria-label="Landasan Tauhid dan Anti-Tathayyur"
      className="border-b border-emerald-700/20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 px-4 py-3 text-xs md:text-sm"
    >
      <div className="max-w-6xl mx-auto flex items-start gap-3">
        <ShieldCheck
          className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-900 dark:text-emerald-300">
            Landasan Tauhid & Fiqih Pernikahan (Anti-Tathayyur)
          </p>
          <p className="text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
            Pernikahan adalah ikatan suci (<em>mitsaqan ghalizha</em>). Hari dan tanggal tidak memiliki kekuatan mandiri
            untuk mendatangkan celaka atau keberuntungan. Meyakini kesialan pada hari tertentu (<em>thiyarah/tathayyur</em>)
            dilarang dalam Islam (HR. Tirmidzi no. 1614, HR. Bukhari no. 5757). Keabsahan akad sepenuhnya bersandar
            pada 5 rukun nikah (KHI Pasal 14), sedangkan petungan adat berfungsi sebagai sarana musyawarah (<em>&lsquo;urf</em>)
            demi kemaslahatan dan ketenteraman keluarga.
          </p>
        </div>
      </div>
    </aside>
  );
}
