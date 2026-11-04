'use client';

import React, { useMemo } from 'react';
import {
  getEffectiveJdnForBirth,
  getWetonFromJdn,
  formatWeton,
  type Weton,
} from '@tanggal-baik/core';
import { Sparkles, Trash2, SlidersHorizontal } from 'lucide-react';
import type { CoupleFormData } from '../lib/schemas';

interface CoupleFormProps {
  formData: CoupleFormData;
  onChange: (data: CoupleFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function CoupleForm({
  formData,
  onChange,
  onSubmit,
  onReset,
  isLoading = false,
}: CoupleFormProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Compute Groom Weton live
  const groomWeton: (Weton & { text: string }) | null = useMemo(() => {
    if (!formData.groomBirthDate || formData.groomBirthDate.length < 10) return null;
    const parts = formData.groomBirthDate.split('-').map(Number);
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    if (!year || !month || !day) return null;

    try {
      const jdn = getEffectiveJdnForBirth(
        { year, month, day },
        undefined,
        formData.groomBirthAfterSunset
      );
      const w = getWetonFromJdn(jdn);
      return {
        ...w,
        text: `${formatWeton(w)} (neptu ${w.neptu})`,
      };
    } catch {
      return null;
    }
  }, [formData.groomBirthDate, formData.groomBirthAfterSunset]);

  // Compute Bride Weton live
  const brideWeton: (Weton & { text: string }) | null = useMemo(() => {
    if (!formData.brideBirthDate || formData.brideBirthDate.length < 10) return null;
    const parts = formData.brideBirthDate.split('-').map(Number);
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    if (!year || !month || !day) return null;

    try {
      const jdn = getEffectiveJdnForBirth(
        { year, month, day },
        undefined,
        formData.brideBirthAfterSunset
      );
      const w = getWetonFromJdn(jdn);
      return {
        ...w,
        text: `${formatWeton(w)} (neptu ${w.neptu})`,
      };
    } catch {
      return null;
    }
  }, [formData.brideBirthDate, formData.brideBirthAfterSunset]);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-sand-100 dark:bg-obsidian-900 border border-sand-300 dark:border-prada-500/20 rounded-xl p-5 md:p-7 shadow-sm transition-colors"
    >
      <div className="flex items-center justify-between border-b border-sand-200 dark:border-sand-800/80 pb-4 mb-6">
        <div>
          <h2 className="font-serif font-bold text-xl md:text-2xl text-sand-900 dark:text-sand-50">
            Data Calon Pengantin
          </h2>
          <p className="text-xs md:text-sm text-sand-600 dark:text-sand-400 mt-0.5">
            Masukkan tanggal lahir untuk menghitung weton dan mencari tanggal akad yang selaras.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs flex items-center gap-1.5 text-sand-600 hover:text-amber-700 dark:text-sand-400 dark:hover:text-amber-400 px-2.5 py-1.5 rounded border border-sand-300 dark:border-sand-800 hover:bg-sand-200 dark:hover:bg-obsidian-850 transition-colors"
          title="Hapus data tersimpan"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Groom Section */}
        <fieldset className="bg-sand-50 dark:bg-obsidian-850 p-4 md:p-5 rounded-lg border border-sand-300 dark:border-sand-800/80 space-y-4">
          <legend className="font-serif font-semibold text-base text-prada-800 dark:text-prada-400 px-1">
            Calon Mempelai Pria
          </legend>

          <div>
            <label
              htmlFor="groomName"
              className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1"
            >
              Nama Lengkap (Opsional)
            </label>
            <input
              id="groomName"
              type="text"
              value={formData.groomName}
              onChange={(e) => onChange({ ...formData, groomName: e.target.value })}
              placeholder="Contoh: Bagus"
              className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="groomBirthDate"
                className="block text-xs font-medium text-sand-700 dark:text-sand-300"
              >
                Tanggal Lahir <span className="text-amber-600 dark:text-amber-500">*</span>
              </label>
              {groomWeton && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-prada-500/20 text-prada-800 dark:text-prada-300">
                  {groomWeton.text}
                </span>
              )}
            </div>
            <input
              id="groomBirthDate"
              type="date"
              required
              value={formData.groomBirthDate}
              onChange={(e) => onChange({ ...formData, groomBirthDate: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-sand-600 dark:text-sand-400 pt-1">
            <input
              type="checkbox"
              checked={formData.groomBirthAfterSunset}
              onChange={(e) =>
                onChange({ ...formData, groomBirthAfterSunset: e.target.checked })
              }
              className="rounded border-sand-400 text-prada-600 focus:ring-prada-500"
            />
            <span>Lahir setelah maghrib / surup (berganti weton Jawa)</span>
          </label>

          <div>
            <label
              htmlFor="groomChildOrder"
              className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1"
            >
              Urutan Kelahiran Anak (Opsional)
            </label>
            <select
              id="groomChildOrder"
              value={formData.groomChildOrder ?? ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  groomChildOrder: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
            >
              <option value="">Belum ditentukan / Lewati</option>
              <option value="1">Anak ke-1 (Sulung)</option>
              <option value="2">Anak ke-2</option>
              <option value="3">Anak ke-3</option>
              <option value="4">Anak ke-4</option>
              <option value="5">Anak ke-5</option>
              <option value="6">Anak ke-6 atau lebih</option>
            </select>
            <span className="text-[10px] text-sand-500 dark:text-sand-400 mt-1 block">
              Diperlukan untuk memeriksa pantangan adat Jilu (anak ke-1 &amp; anak ke-3).
            </span>
          </div>
        </fieldset>

        {/* Bride Section */}
        <fieldset className="bg-sand-50 dark:bg-obsidian-850 p-4 md:p-5 rounded-lg border border-sand-300 dark:border-sand-800/80 space-y-4">
          <legend className="font-serif font-semibold text-base text-prada-800 dark:text-prada-400 px-1">
            Calon Mempelai Wanita
          </legend>

          <div>
            <label
              htmlFor="brideName"
              className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1"
            >
              Nama Lengkap (Opsional)
            </label>
            <input
              id="brideName"
              type="text"
              value={formData.brideName}
              onChange={(e) => onChange({ ...formData, brideName: e.target.value })}
              placeholder="Contoh: Raras"
              className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="brideBirthDate"
                className="block text-xs font-medium text-sand-700 dark:text-sand-300"
              >
                Tanggal Lahir <span className="text-amber-600 dark:text-amber-500">*</span>
              </label>
              {brideWeton && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-prada-500/20 text-prada-800 dark:text-prada-300">
                  {brideWeton.text}
                </span>
              )}
            </div>
            <input
              id="brideBirthDate"
              type="date"
              required
              value={formData.brideBirthDate}
              onChange={(e) => onChange({ ...formData, brideBirthDate: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-sand-600 dark:text-sand-400 pt-1">
            <input
              type="checkbox"
              checked={formData.brideBirthAfterSunset}
              onChange={(e) =>
                onChange({ ...formData, brideBirthAfterSunset: e.target.checked })
              }
              className="rounded border-sand-400 text-prada-600 focus:ring-prada-500"
            />
            <span>Lahir setelah maghrib / surup (berganti weton Jawa)</span>
          </label>

          <div>
            <label
              htmlFor="brideChildOrder"
              className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1"
            >
              Urutan Kelahiran Anak (Opsional)
            </label>
            <select
              id="brideChildOrder"
              value={formData.brideChildOrder ?? ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  brideChildOrder: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
            >
              <option value="">Belum ditentukan / Lewati</option>
              <option value="1">Anak ke-1 (Sulung)</option>
              <option value="2">Anak ke-2</option>
              <option value="3">Anak ke-3</option>
              <option value="4">Anak ke-4</option>
              <option value="5">Anak ke-5</option>
              <option value="6">Anak ke-6 atau lebih</option>
            </select>
            <span className="text-[10px] text-sand-500 dark:text-sand-400 mt-1 block">
              Diperlukan untuk memeriksa pantangan adat Jilu (anak ke-1 &amp; anak ke-3).
            </span>
          </div>
        </fieldset>
      </div>

      {/* Target Year, Weekends, and Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-sand-200 dark:border-sand-800/80">
        <div>
          <label
            htmlFor="weddingYear"
            className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1"
          >
            Tahun Rencana Akad
          </label>
          <select
            id="weddingYear"
            value={formData.weddingYear}
            onChange={(e) => onChange({ ...formData, weddingYear: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
          >
            {[2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map((yr) => (
              <option key={yr} value={yr}>
                Tahun {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="traditionProfile"
            className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1"
          >
            Aliran Petungan Tradisi
          </label>
          <select
            id="traditionProfile"
            value={formData.traditionProfile}
            onChange={(e) =>
              onChange({
                ...formData,
                traditionProfile: e.target.value as CoupleFormData['traditionProfile'],
              })
            }
            className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-obsidian-950 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-prada-500"
          >
            <option value="keraton">Keraton (Kitab Betaljemur Adammakna)</option>
            <option value="pati">Pati / Pesisiran (Naskah Winong, Modulo 3)</option>
            <option value="populer">Tradisi Umum Populer</option>
            <option value="custom">Kustom (Pilihan Bebas)</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer h-10 px-3 py-2 rounded border border-sand-300 dark:border-sand-800 bg-sand-50 dark:bg-obsidian-850 text-xs font-medium text-sand-800 dark:text-sand-200">
            <input
              type="checkbox"
              checked={formData.weekendsOnly}
              onChange={(e) => onChange({ ...formData, weekendsOnly: e.target.checked })}
              className="rounded border-sand-400 text-prada-600 focus:ring-prada-500"
            />
            <span>Hanya Akhir Pekan (Sabtu & Ahad)</span>
          </label>
        </div>
      </div>

      {/* Advanced Collapsible Section */}
      <div className="mt-4 pt-3 border-t border-sand-200 dark:border-sand-850">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs flex items-center gap-1.5 text-sand-600 dark:text-sand-400 hover:text-prada-600 dark:hover:text-prada-400 font-medium"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Sembunyikan Pengaturan Lanjutan' : 'Tampilkan Pengaturan Lanjutan (Iddah & Varian)'}</span>
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-4 bg-sand-50/70 dark:bg-obsidian-950/50 rounded-lg border border-sand-200 dark:border-sand-800/80">
            <div>
              <label
                htmlFor="iddahEndDate"
                className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1"
              >
                Batas Akhir Masa Iddah (Bila Ada)
              </label>
              <input
                id="iddahEndDate"
                type="date"
                value={formData.iddahEndDate}
                onChange={(e) => onChange({ ...formData, iddahEndDate: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded bg-white dark:bg-obsidian-900 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50"
              />
              <span className="text-[11px] text-sand-500 dark:text-sand-400 block mt-1">
                Akad dihindari sebelum masa iddah selesai (QS. Al-Baqarah: 235).
              </span>
            </div>

            <div>
              <label
                htmlFor="dinaAlaVariant"
                className="block text-xs font-medium text-sand-700 dark:text-sand-300 mb-1"
              >
                Varian Pantangan Dina Ala (Betaljemur)
              </label>
              <select
                id="dinaAlaVariant"
                value={formData.dinaAlaVariant}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    dinaAlaVariant: e.target.value as CoupleFormData['dinaAlaVariant'],
                  })
                }
                className="w-full px-3 py-1.5 text-xs rounded bg-white dark:bg-obsidian-900 border border-sand-600 dark:border-sand-600 text-sand-900 dark:text-sand-50"
              >
                <option value="both">Keduanya (No. 26 & No. 27 Aktif)</option>
                <option value="J-26">Hanya Varian No. 26 (Dina Ala)</option>
                <option value="J-27">Hanya Varian No. 27 (Dina Sangaring Asal)</option>
              </select>
              <span className="text-[11px] text-sand-500 dark:text-sand-400 block mt-1">
                Keringanan pemilihan hari jika akhir pekan Sawal dipantangkan.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-3 rounded-lg bg-prada-500 hover:bg-prada-400 text-obsidian-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-prada-500 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'Menghitung...' : 'Cari Rekomendasi Tanggal Baik'}</span>
        </button>
      </div>
    </form>
  );
}
