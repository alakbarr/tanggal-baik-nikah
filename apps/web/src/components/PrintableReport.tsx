import React from 'react';
import type { SolverResult } from '@tanggal-baik/core';
import { HIJRI_MONTH_NAMES } from '@tanggal-baik/core';
import type { CoupleFormData } from '../lib/schemas';

interface PrintableReportProps {
  formData: CoupleFormData;
  solverResult: SolverResult | null;
}

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function PrintableReport({ formData, solverResult }: PrintableReportProps) {
  if (!solverResult) return null;

  const topDates = solverResult.eligible.slice(0, 15);
  const totalCount = solverResult.eligible.length + solverResult.eliminated.length;

  return (
    <div className="hidden print:block print:w-full print:text-black font-sans text-xs leading-normal">
      {/* Formal Header */}
      <div className="border-b-2 border-black pb-3 mb-4 text-center">
        <h1 className="font-serif font-bold text-lg uppercase tracking-wider text-black">
          Laporan Rekomendasi Hari Akad Nikah
        </h1>
        <p className="text-[11px] text-gray-700 italic mt-0.5">
          Harmonisasi Hisab Falak Tradisi Jawa (Kitab Betaljemur Adammakna) &amp; Tuntunan Fiqh Munakahat Sunnah
        </p>
      </div>

      {/* Tauhid & Anti-Tathayyur Foundation */}
      <div className="border border-black p-2.5 mb-4 bg-gray-50 text-[10px] leading-relaxed">
        <strong className="block font-semibold mb-1 uppercase tracking-wide">
          Landasan Tauhid &amp; Pembebasan dari Khurafat:
        </strong>
        Hari dan waktu adalah ciptaan Allah ﷻ semata yang tidak memiliki kekuasaan mandiri mendatangkan untung atau celaka. Menyakini suatu hari membawa sial secara hakiki (<em>tathayyur / thiyarah</em>) dilarang keras dalam Islam (HR. Tirmidzi no. 1614, HR. Abu Dawud no. 3910). Perhitungan petungan adat ini diperlakukan murni sebagai ikhtiar budaya (<em>&lsquo;urf</em>), penghormatan terhadap keluarga sepuh, dan sarana musyawarah mufakat.
      </div>

      {/* Couple Profiles */}
      <div className="grid grid-cols-2 gap-4 border border-black p-3 mb-4 print-avoid-break">
        <div>
          <h2 className="font-bold text-xs uppercase border-b border-gray-400 pb-1 mb-2">
            Mempelai Pria
          </h2>
          <table className="w-full text-[11px]">
            <tbody>
              <tr>
                <td className="w-24 text-gray-600">Nama:</td>
                <td className="font-semibold">{formData.groomName || 'Calon Suami'}</td>
              </tr>
              <tr>
                <td className="text-gray-600">Lahir (Masehi):</td>
                <td>{formData.groomBirthDate}</td>
              </tr>
              <tr>
                <td className="text-gray-600">Weton:</td>
                <td className="font-semibold">
                  {solverResult.coupleProfile.groomWeton.dayName}{' '}
                  {solverResult.coupleProfile.groomWeton.pasaranName} (Neptu{' '}
                  {solverResult.coupleProfile.groomWeton.neptu})
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="font-bold text-xs uppercase border-b border-gray-400 pb-1 mb-2">
            Mempelai Wanita
          </h2>
          <table className="w-full text-[11px]">
            <tbody>
              <tr>
                <td className="w-24 text-gray-600">Nama:</td>
                <td className="font-semibold">{formData.brideName || 'Calon Istri'}</td>
              </tr>
              <tr>
                <td className="text-gray-600">Lahir (Masehi):</td>
                <td>{formData.brideBirthDate}</td>
              </tr>
              <tr>
                <td className="text-gray-600">Weton:</td>
                <td className="font-semibold">
                  {solverResult.coupleProfile.brideWeton.dayName}{' '}
                  {solverResult.coupleProfile.brideWeton.pasaranName} (Neptu{' '}
                  {solverResult.coupleProfile.brideWeton.neptu})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Couple Compatibility Rules Summary */}
      <div className="border border-black p-3 mb-4 print-avoid-break">
        <h2 className="font-bold text-xs uppercase border-b border-gray-400 pb-1 mb-2">
          Ikhtisar Petungan Profil Pasangan (Statis / Tidak Mengeliminasi Hari)
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10.5px]">
          {solverResult.coupleProfile.outcomes.map((evalItem) => (
            <div key={evalItem.ruleId} className="border-b border-gray-200 pb-1">
              <span className="font-semibold text-gray-800">[{evalItem.ruleId}] </span>
              <span className="font-medium text-black">{evalItem.labelJv}</span>
              <p className="text-[9.5px] text-gray-600 mt-0.5">{evalItem.explanationId}</p>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-gray-500 italic mt-2">
          *Catatan Fiqh: Kategori petungan jodoh di atas adalah kearifan adat Jawa dan sama sekali tidak menentukan sah atau gugurnya rukun akad nikah (KHI Pasal 14).
        </p>
      </div>

      {/* Top Recommended Dates Table */}
      <div className="border border-black mb-4">
        <div className="bg-gray-100 p-2 border-b border-black">
          <h2 className="font-bold text-xs uppercase">
            Rekomendasi Hari &amp; Tanggal Akad Nikah Terpilih ({topDates.length} Hari Terbaik — Tahun {formData.weddingYear})
          </h2>
          <p className="text-[10px] text-gray-600">
            Disaring dari {totalCount} tanggal kandidat ({solverResult.eligible.length} hari memenuhi syarat adat &amp; syariat).
          </p>
        </div>

        <table className="w-full text-left border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-black bg-gray-50 font-semibold break-inside-avoid">
              <th className="p-1 border-r border-black w-7 text-center">No</th>
              <th className="p-1 border-r border-black">Hari &amp; Tanggal Masehi</th>
              <th className="p-1 border-r border-black">Weton &amp; Neptu</th>
              <th className="p-1 border-r border-black">Kalender Jawa</th>
              <th className="p-1 border-r border-black">Kalender Hijriah</th>
              <th className="p-1 border-r border-black text-center">Kriteria</th>
              <th className="p-1">Sa&apos;at Ijab (Jam Baik)</th>
            </tr>
          </thead>
          <tbody>
            {topDates.map((candidate, idx) => {
              const day = candidate.day;
              const g = day.gregorian;
              const j = day.javanese;
              const h = day.hijri.kemenag ?? day.hijri.khgt;
              const monthName = MONTH_NAMES_ID[g.month - 1] ?? '';
              const hMonthName = h ? (HIJRI_MONTH_NAMES[h.month - 1] ?? '') : '';

              const bestSaat = candidate.saat[0];
              const saatText = bestSaat
                ? `${bestSaat.start}–${bestSaat.end} (${bestSaat.labelJv})`
                : 'Pagi';

              return (
                <tr
                  key={day.jdn}
                  className={`border-b border-gray-300 break-inside-avoid ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="p-1 border-r border-black text-center font-semibold">
                    {idx + 1}
                  </td>
                  <td className="p-1 border-r border-black font-semibold">
                    {day.weton.dayName}, {g.day} {monthName} {g.year}
                  </td>
                  <td className="p-1 border-r border-black">
                    {day.weton.dayName} {day.weton.pasaranName} ({day.weton.neptu})
                  </td>
                  <td className="p-1 border-r border-black">
                    {j.day} {j.sasi} {j.year} {j.tahun}
                  </td>
                  <td className="p-1 border-r border-black">
                    {h ? `${h.day} ${hMonthName} ${h.year} H` : '-'}
                  </td>
                  <td className="p-1 border-r border-black text-center font-bold">
                    {candidate.criteriaMet}/{candidate.criteriaTotal}
                  </td>
                  <td className="p-1 text-[9px]">
                    {saatText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Shariah Pillars & Validity Seal */}
      <div className="border border-black p-2.5 mb-4 text-[10px] leading-relaxed print-avoid-break">
        <strong className="block font-semibold mb-1 uppercase tracking-wide">
          Legalitas Rukun Nikah Menurut Fiqh Munakahat &amp; Kompilasi Hukum Islam (KHI):
        </strong>
        Akad nikah sah secara agama dan hukum negara apabila terpenuhi 5 Rukun Nikah menurut KHI Pasal 14:
        (1) Calon Suami, (2) Calon Istri, (3) Wali Nikah, (4) Dua Orang Saksi yang Adil, (5) Ijab dan Qabul.
        Ketetapan hari, pasaran, atau bulan bukanlah syarat sah akad. Pemilihan tanggal ini semata-mata mengikhtiarkan kemudahan (<em>taysir</em>), kedamaian batin, dan keharmonisan keluarga besar.
      </div>

      {/* Sign-off footer */}
      <div className="flex justify-between items-end pt-3 text-[10px] text-gray-600 border-t border-gray-300">
        <div>
          <p>Dokumen diterbitkan secara otomatis oleh Aplikasi Penasihat Tanggal Baik Nikah.</p>
          <p className="text-[9px] text-gray-500">Hisab astronomis presisi (Algoritma Fliegel-Van Flandern &amp; Kurup Asapon 1936–2052 M).</p>
        </div>
        <div className="text-right">
          <p>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
        </div>
      </div>
    </div>
  );
}
