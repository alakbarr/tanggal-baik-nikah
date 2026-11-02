import { HIJRI_MONTH_NAMES } from '../constants/neptu.js';
import type { CandidateResult, DayPoint, SaatEntry } from '../types.js';

/**
 * Formats a day point into a full readable Indonesian and Javanese date string.
 * Example: "Ahad Wage, 17 Januari 2027 (8 Ruwah 1960 Bé / 9 Syaban 1448 H)"
 */
export function formatDayPointDescription(day: DayPoint): string {
  const g = day.gregorian;
  const monthNamesId = [
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
  const gregStr = `${day.weton.dayName} ${day.weton.pasaranName}, ${g.day} ${monthNamesId[g.month - 1]} ${g.year}`;
  const jvStr = `${day.javanese.day} ${day.javanese.sasi} ${day.javanese.year} ${day.javanese.tahun}`;

  const hijriKemenag = day.hijri.kemenag;
  const hijriMonthName = hijriKemenag ? HIJRI_MONTH_NAMES[hijriKemenag.month - 1] : '';
  const hijriStr = hijriKemenag
    ? `${hijriKemenag.day} ${hijriMonthName} ${hijriKemenag.year} H`
    : null;

  return hijriStr ? `${gregStr} (${jvStr} / ${hijriStr})` : `${gregStr} (${jvStr})`;
}

/**
 * Explains why a candidate date was eliminated.
 * Enumerates all failed rules with their arithmetic and manuscript citations.
 */
export function explainElimination(candidate: CandidateResult): string {
  if (candidate.eliminatedBy.length === 0) {
    return 'Tanggal ini memenuhi seluruh kriteria dan pantangan adat yang dipilih.';
  }

  const reasons = candidate.eliminatedBy.map(
    (out, idx) => `${idx + 1}. [${out.ruleId}] ${out.labelJv}: ${out.explanationId}`
  );

  return `Tanggal gugur berdasarkan ${candidate.eliminatedBy.length} pantangan:\n${reasons.join('\n')}`;
}

/**
 * Explains satisfied criteria for an eligible date.
 */
export function explainCriteria(candidate: CandidateResult): string {
  const met = candidate.criteriaMet;
  const total = candidate.criteriaTotal;

  if (total === 0) {
    return 'Tidak ada kriteria penyaring yang diaktifkan.';
  }

  const passedOutcomes = candidate.outcomes.filter((o) => o.verdict === 'pass');
  if (passedOutcomes.length === 0) {
    return `Memenuhi ${met} dari ${total} kriteria adat.`;
  }

  const details = passedOutcomes.map((o) => `• [${o.ruleId}] ${o.labelJv}: ${o.explanationId}`);
  return `Memenuhi ${met} dari ${total} kriteria adat:\n${details.join('\n')}`;
}

/**
 * Formats saat (execution hours) into a readable guidance block.
 */
export function explainSaat(saatList: readonly SaatEntry[]): string {
  if (saatList.length === 0) {
    return 'Tidak ada data saat pelaksanaan untuk hari ini.';
  }

  const lines = saatList.map((s) => `• Jam ${s.start}–${s.end}: ${s.labelJv}`);
  return `Panduan waktu pelaksanaan akad (Sa'at Pasaran):\n${lines.join('\n')}`;
}

/**
 * Returns fixed theological reminder for couple profiles according to Anti-Tathayyur & KHI.
 */
export function getCoupleReminderText(): string {
  return (
    'Hasil perhitungan weton jodoh merupakan khazanah kearifan budaya (urf) untuk musyawarah keluarga, ' +
    'bukan ramalan nasib mutlak. Keabsahan pernikahan dalam Islam ditentukan oleh terpenuhinya rukun nikah ' +
    '(KHI Pasal 14: calon mempelai, wali nikah, dua saksi, ijab kabul). ' +
    'Rasulullah ﷺ menegaskan bahwa menganggap hari atau tanda tertentu membawa sial adalah thiyarah yang terlarang ' +
    '(HR. Tirmidzi no. 1614, HR. Bukhari no. 5757).'
  );
}
