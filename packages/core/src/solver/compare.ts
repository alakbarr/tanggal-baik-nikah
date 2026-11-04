import { solve } from './solve.js';
import { formatDayPointDescription } from './explain.js';
import type {
  CandidateResult,
  DayPoint,
  SolveOptions,
  SolverResult,
  TraditionProfileId,
} from '../types.js';

export interface TraditionVerdict {
  readonly profileId: TraditionProfileId;
  readonly profileName: string;
  readonly isEligible: boolean;
  readonly criteriaMet: number;
  readonly criteriaTotal: number;
  readonly eliminatedReasons: readonly string[];
}

export interface DateComparisonItem {
  readonly jdn: number;
  readonly day: DayPoint;
  readonly dateDescription: string;
  readonly verdicts: Readonly<Record<TraditionProfileId, TraditionVerdict>>;
  readonly consensusCount: number; // 0..4 traditions eligible
  readonly allAgreed: boolean;
}

export interface MultiTraditionComparisonResult {
  readonly items: readonly DateComparisonItem[];
  readonly coupleProfile: SolverResult['coupleProfile'];
  readonly summary: {
    readonly totalScanned: number;
    readonly allTraditionsAgreedCount: number;
    readonly keratonEligibleCount: number;
    readonly patiEligibleCount: number;
    readonly populerEligibleCount: number;
    readonly shariahEligibleCount: number;
  };
}

const PROFILE_NAMES: Readonly<Record<TraditionProfileId, string>> = Object.freeze({
  keraton: 'Tradisi Keraton (Betaljemur)',
  pati: 'Tradisi Pesisiran Pati',
  populer: 'Tradisi Populer Jawa',
  shariah: 'Tuntunan Syariah & Sunnah',
  custom: 'Kustom',
});

/**
 * Runs a multi-tradition cross-evaluation for the specified couple and date range.
 * Evaluates candidates simultaneously under Keraton, Pati, Populer, and Shariah profiles.
 */
export function compareTraditions(options: SolveOptions): MultiTraditionComparisonResult {
  const profilesToCompare: TraditionProfileId[] = ['keraton', 'pati', 'populer', 'shariah'];

  const resultsByProfile = new Map<TraditionProfileId, SolverResult>();

  for (const profId of profilesToCompare) {
    const res = solve({
      ...options,
      couple: {
        ...options.couple,
        traditionProfile: profId,
      },
    });
    resultsByProfile.set(profId, res);
  }

  // Use the keraton result's candidates (both eligible and eliminated) as the baseline day list
  const baseResult = resultsByProfile.get('keraton')!;
  const allCandidatesMap = new Map<number, DayPoint>();

  for (const c of [...baseResult.eligible, ...baseResult.eliminated]) {
    allCandidatesMap.set(c.day.jdn, c.day);
  }

  // Build candidate lookup per profile
  const profileCandidateMaps = new Map<TraditionProfileId, Map<number, CandidateResult>>();
  for (const profId of profilesToCompare) {
    const sRes = resultsByProfile.get(profId)!;
    const map = new Map<number, CandidateResult>();
    for (const c of [...sRes.eligible, ...sRes.eliminated]) {
      map.set(c.day.jdn, c);
    }
    profileCandidateMaps.set(profId, map);
  }

  const items: DateComparisonItem[] = [];
  const sortedJdns = Array.from(allCandidatesMap.keys()).sort((a, b) => a - b);

  let keratonCount = 0;
  let patiCount = 0;
  let populerCount = 0;
  let shariahCount = 0;
  let allAgreedCount = 0;

  for (const jdn of sortedJdns) {
    const day = allCandidatesMap.get(jdn)!;
    const verdictsObj: Partial<Record<TraditionProfileId, TraditionVerdict>> = {};

    let consensus = 0;

    for (const profId of profilesToCompare) {
      const c = profileCandidateMaps.get(profId)?.get(jdn);
      const isEligible = c ? c.eliminatedBy.length === 0 : false;
      const reasons = c ? c.eliminatedBy.map((e) => e.explanationId) : [];

      if (isEligible) {
        consensus++;
        if (profId === 'keraton') keratonCount++;
        if (profId === 'pati') patiCount++;
        if (profId === 'populer') populerCount++;
        if (profId === 'shariah') shariahCount++;
      }

      verdictsObj[profId] = {
        profileId: profId,
        profileName: PROFILE_NAMES[profId] ?? profId,
        isEligible,
        criteriaMet: c?.criteriaMet ?? 0,
        criteriaTotal: c?.criteriaTotal ?? 0,
        eliminatedReasons: reasons,
      };
    }

    const allAgreed = consensus === profilesToCompare.length;
    if (allAgreed) allAgreedCount++;

    items.push({
      jdn,
      day,
      dateDescription: formatDayPointDescription(day),
      verdicts: verdictsObj as Record<TraditionProfileId, TraditionVerdict>,
      consensusCount: consensus,
      allAgreed,
    });
  }

  return {
    items,
    coupleProfile: baseResult.coupleProfile,
    summary: {
      totalScanned: items.length,
      allTraditionsAgreedCount: allAgreedCount,
      keratonEligibleCount: keratonCount,
      patiEligibleCount: patiCount,
      populerEligibleCount: populerCount,
      shariahEligibleCount: shariahCount,
    },
  };
}
