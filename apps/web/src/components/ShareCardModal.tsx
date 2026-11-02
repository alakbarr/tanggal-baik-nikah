'use client';

import React, { useRef, useEffect, useState } from 'react';
import type { CandidateResult } from '@tanggal-baik/core';
import { HIJRI_MONTH_NAMES } from '@tanggal-baik/core';
import { Download, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ShareCardModalProps {
  candidate: CandidateResult | null;
  groomName: string;
  brideName: string;
  onClose: () => void;
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

export function ShareCardModal({
  candidate,
  groomName,
  brideName,
  onClose,
}: ShareCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!candidate) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 675;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Obsidian Layer
    ctx.fillStyle = '#0B0C0F';
    ctx.fillRect(0, 0, width, height);

    // Subtle radial gradient in center
    const radial = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.6);
    radial.addColorStop(0, '#161920');
    radial.addColorStop(1, '#0B0C0F');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Ornamental Border
    ctx.strokeStyle = '#DEC071';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.strokeStyle = 'rgba(222, 192, 113, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(44, 44, width - 88, height - 88);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = '#DEC071';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#DEC071';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(6, 6, 12, 12);
      ctx.restore();
    };

    drawCorner(54, 54, 0);
    drawCorner(width - 54, 54, Math.PI / 2);
    drawCorner(width - 54, height - 54, Math.PI);
    drawCorner(54, height - 54, -Math.PI / 2);

    // 3. Top Subtitle & Badge
    ctx.fillStyle = '#DEC071';
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('REKOMENDASI HARI AKAD NIKAH', width / 2, 90);

    ctx.fillStyle = 'rgba(250, 249, 245, 0.6)';
    ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Harmonisasi Adat Nusantara (Betaljemur) & Tuntunan Sunnah', width / 2, 115);

    // 4. Couple Names
    const gName = groomName || 'Calon Suami';
    const bName = brideName || 'Calon Istri';
    ctx.fillStyle = '#FAF9F5';
    ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
    ctx.fillText(`${gName} & ${bName}`, width / 2, 180);

    // Small Gold Divider
    ctx.strokeStyle = '#DEC071';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, 205);
    ctx.lineTo(width / 2 + 80, 205);
    ctx.stroke();

    // 5. Wedding Date Highlight
    const day = candidate.day;
    const g = day.gregorian;
    const j = day.javanese;
    const h = day.hijri.kemenag ?? day.hijri.khgt;
    const monthName = MONTH_NAMES_ID[g.month - 1] ?? '';
    const hMonthName = h ? (HIJRI_MONTH_NAMES[h.month - 1] ?? '') : '';

    ctx.fillStyle = '#DEC071';
    ctx.font = 'bold 54px "Playfair Display", Georgia, serif';
    ctx.fillText(`${day.weton.dayName}, ${g.day} ${monthName} ${g.year}`, width / 2, 290);

    // 6. Tri-System Calendar Alignment Bar
    ctx.fillStyle = '#161920';
    ctx.strokeStyle = 'rgba(222, 192, 113, 0.4)';
    ctx.lineWidth = 1;
    const barWidth = 760;
    const barX = (width - barWidth) / 2;
    ctx.beginPath();
    ctx.roundRect(barX, 330, barWidth, 54, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FAF9F5';
    ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    const hijriPart = h ? `  •  ${h.day} ${hMonthName} ${h.year} H` : '';
    ctx.fillText(
      `${day.weton.dayName} ${day.weton.pasaranName} (Neptu ${day.weton.neptu})  •  ${j.day} ${j.sasi} ${j.year} ${j.tahun}${hijriPart}`,
      width / 2,
      363
    );

    // 7. Criteria & Sa'at Execution Hours
    const criteriaText = `Memenuhi ${candidate.criteriaMet} dari ${candidate.criteriaTotal} Kriteria Adat Pilihan`;
    const bestSaat = candidate.saat[0];
    const saatText = bestSaat
      ? `Waktu Ijab Disarankan: Pukul ${bestSaat.start}–${bestSaat.end} WIB (${bestSaat.labelJv})`
      : 'Waktu Ijab Pilihan: Pagi Hari';

    ctx.fillStyle = '#DEC071';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText(criteriaText, width / 2, 435);

    ctx.fillStyle = 'rgba(250, 249, 245, 0.8)';
    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText(saatText, width / 2, 465);

    // 8. Bottom Monotheism Seal (Tawhid & Anti-Tathayyur)
    ctx.fillStyle = 'rgba(250, 249, 245, 0.45)';
    ctx.font = 'italic 12px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      'HR. Tirmidzi no. 1614: "Thiyarah itu syirik." Hari dan waktu adalah makhluk Allah semata tanpa daya untung/celaka.',
      width / 2,
      560
    );
    ctx.fillText(
      'Petungan adat diperlakukan murni sebagai sarana musyawarah mufakat keluarga besar.',
      width / 2,
      582
    );

    setDataUrl(canvas.toDataURL('image/png'));
  }, [candidate, groomName, brideName]);

  if (!candidate) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    const g = candidate.day.gregorian;
    a.download = `rekomendasi-akad-${g.year}-${String(g.month).padStart(2, '0')}-${String(g.day).padStart(2, '0')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm"
    >
      <div className="bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-prada-500/20 rounded-2xl max-w-2xl w-full p-5 md:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-sand-200 dark:border-sand-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-prada-500" />
            <h3 id="share-modal-title" className="font-serif font-bold text-lg text-sand-950 dark:text-sand-50">
              Kartu Rekomendasi Hari Akad
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau kartu"
            className="p-1 rounded text-sand-500 hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-50 hover:bg-sand-200 dark:hover:bg-obsidian-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden rendering canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Card Preview */}
        <div className="my-4 rounded-xl overflow-hidden border border-sand-300 dark:border-sand-800 shadow-inner bg-obsidian-950">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Kartu Rekomendasi Hari Akad Nikah"
              className="w-full h-auto object-contain"
            />
          ) : (
            <div className="py-16 text-center text-xs text-sand-500">
              Menyiapkan kartu rekomendasi...
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-sand-500 dark:text-sand-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-prada-500" />
            <span>Format PNG tajam resolusi 1200×675 untuk dibagikan ke keluarga.</span>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs rounded-lg border border-sand-300 dark:border-sand-700 text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-obsidian-800 font-medium"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs rounded-lg bg-prada-500 hover:bg-prada-400 text-obsidian-950 font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Gambar PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
