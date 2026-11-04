import { gregorianToJdn, jdnToGregorian } from '../calendar/jdn.js';
import { getWetonFromJdn } from '../calendar/weton.js';
import { jdnToJavanese } from '../calendar/javanese.js';
import { getPawukonFromJdn } from '../calendar/pawukon.js';
import { getHijriDate } from '../calendar/hijri.js';
import { getEffectiveJdnForBirth } from '../calendar/sunset.js';
import { RULE_REGISTRY } from '../rules/registry.js';
import { getTraditionProfile } from '../rules/profiles.js';
import {
  evaluateB01,
  evaluateB02,
  evaluateJ15,
  evaluateJ16,
  evaluateJ17,
  evaluateJ22,
  evaluateJ23,
  evaluateJ24,
  evaluateJ25,
  evaluateCulturalTaboos,
} from '../rules/couple/index.js';
import {
  evaluateJ05,
  evaluateJ06,
  evaluateJ07,
  evaluateJ08,
  evaluateJ11,
  evaluateJ12,
  evaluateJ13,
  evaluateJ14,
  evaluateJ26,
  evaluateJ27,
  evaluateJ28,
  evaluateJ29,
  evaluateJ30,
  evaluateJ31,
  evaluateJ32,
  evaluateJ33,
  evaluateJ34,
  evaluateJ35,
  evaluateJ36,
} from '../rules/date/index.js';
import {
  evaluateU01,
  evaluateU02,
  evaluateU03,
  evaluateU04,
  evaluateU05,
} from '../rules/pati.js';
import { evaluateS01Iddah, evaluateS02Ihram } from '../rules/shariah.js';
import { getCoupleReminderText } from './explain.js';
import type {
  CandidateResult,
  CoupleProfileResult,
  DayPoint,
  RuleOutcome,
  SolveOptions,
  SolverResult,
  Weton,
} from '../types.js';

export function solve(options: SolveOptions): SolverResult {
  const { couple, range, weekendsOnly = false } = options;
  const reckoning = couple.reckoning ?? 'kurup';
  const hijriAuthority = couple.hijriAuthority ?? 'kemenag';

  // 1. Determine Groom and Bride wetons
  const groomJdn = getEffectiveJdnForBirth(
    couple.groom.birthDate,
    undefined,
    couple.groom.birthAfterSunset
  );
  const brideJdn = getEffectiveJdnForBirth(
    couple.bride.birthDate,
    undefined,
    couple.bride.birthAfterSunset
  );

  const groomWeton = getWetonFromJdn(groomJdn);
  const brideWeton = getWetonFromJdn(brideJdn);
  const coupleTotalNeptu = groomWeton.neptu + brideWeton.neptu;

  // 2. Select tradition profile
  const profile =
    couple.customProfile ??
    getTraditionProfile(couple.traditionProfile ?? 'keraton');

  // 3. Scan range
  const startJdn = gregorianToJdn(range.start.year, range.start.month, range.start.day);
  const endJdn = gregorianToJdn(range.end.year, range.end.month, range.end.day);

  const candidates: CandidateResult[] = [];

  for (let jdn = startJdn; jdn <= endJdn; jdn++) {
    const weton = getWetonFromJdn(jdn);

    // Weekday filtering
    if (weekendsOnly && weton.dayIndex !== 0 && weton.dayIndex !== 6) {
      continue;
    }

    const gregorian = jdnToGregorian(jdn);
    const javanese = jdnToJavanese(jdn, reckoning);
    const pawukon = getPawukonFromJdn(jdn);
    const hijri = {
      kemenag: getHijriDate(jdn, 'kemenag'),
      khgt: getHijriDate(jdn, 'khgt'),
    };

    const day: DayPoint = {
      jdn,
      gregorian,
      weton,
      javanese,
      pawukon,
      hijri,
    };

    const eliminatedBy: RuleOutcome[] = [];
    const criteriaOutcomes: RuleOutcome[] = [];

    // --- Hard Shariah limits ---
    if (couple.iddahEndDate) {
      const iddahJdn = gregorianToJdn(
        couple.iddahEndDate.year,
        couple.iddahEndDate.month,
        couple.iddahEndDate.day
      );
      const iddahOutcome = evaluateS01Iddah(day.jdn, iddahJdn);
      if (iddahOutcome.verdict === 'fail') {
        eliminatedBy.push(iddahOutcome);
      }
    }

    if (couple.ihramPeriods && couple.ihramPeriods.length > 0) {
      const intervals = couple.ihramPeriods.map((p) => ({
        startJdn: gregorianToJdn(p.start.year, p.start.month, p.start.day),
        endJdn: gregorianToJdn(p.end.year, p.end.month, p.end.day),
      }));
      const ihramOutcome = evaluateS02Ihram(day.jdn, intervals);
      if (ihramOutcome.verdict === 'fail') {
        eliminatedBy.push(ihramOutcome);
      }
    }

    // --- Profile Filters ---
    const variantChoices = profile.variantChoices;
    const dinaAlaChoice = variantChoices.dina_ala ?? 'both';
    const sangarChoice = variantChoices.sangaring_tanggal ?? 'J-14';

    for (const ruleId of profile.filters) {
      switch (ruleId) {
        case 'J-05': {
          const res = evaluateJ05(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-06': {
          const res = evaluateJ06(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-07': {
          const res = evaluateJ07(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-08': {
          const res = evaluateJ08(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-12': {
          const res = evaluateJ12(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-13': {
          const res = evaluateJ13(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-14': {
          if (sangarChoice === 'J-14') {
            const res = evaluateJ14(day);
            if (res.verdict === 'fail') eliminatedBy.push(res);
          }
          break;
        }
        case 'J-30': {
          if (sangarChoice === 'J-30') {
            const res = evaluateJ30(day);
            if (res.verdict === 'fail') eliminatedBy.push(res);
          }
          break;
        }
        case 'J-26': {
          if (dinaAlaChoice === 'J-26' || dinaAlaChoice === 'both') {
            const res = evaluateJ26(day);
            if (res.verdict === 'fail') eliminatedBy.push(res);
          }
          break;
        }
        case 'J-27': {
          if (dinaAlaChoice === 'J-27' || dinaAlaChoice === 'both') {
            const res = evaluateJ27(day);
            if (res.verdict === 'fail') eliminatedBy.push(res);
          }
          break;
        }
        case 'J-28': {
          const res = evaluateJ28(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-29': {
          const res = evaluateJ29(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-31': {
          const res = evaluateJ31(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-32': {
          const res = evaluateJ32(day);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'J-33': {
          const res = evaluateJ33(day);
          // When in filters, only 'ala' quality fails
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'U-01': {
          const res = evaluateU01(coupleTotalNeptu, day.weton.neptu);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'U-02': {
          const res = evaluateU02(day.weton, groomWeton, brideWeton);
          if (res.verdict === 'fail') eliminatedBy.push(res);
          break;
        }
        case 'U-03': {
          const parentsWetons: Weton[] = [];
          if (couple.groom.fatherBirthWeton) parentsWetons.push(couple.groom.fatherBirthWeton);
          if (couple.groom.motherBirthWeton) parentsWetons.push(couple.groom.motherBirthWeton);
          if (couple.bride.fatherBirthWeton) parentsWetons.push(couple.bride.fatherBirthWeton);
          if (couple.bride.motherBirthWeton) parentsWetons.push(couple.bride.motherBirthWeton);
          if (parentsWetons.length > 0) {
            const res = evaluateU03(day.weton, parentsWetons);
            if (res.verdict === 'fail') eliminatedBy.push(res);
          }
          break;
        }
        case 'U-04': {
          const geblakWetons: Weton[] = [
            ...(couple.groom.deceasedParentsGeblak ?? []),
            ...(couple.bride.deceasedParentsGeblak ?? []),
          ];
          if (geblakWetons.length > 0) {
            const res = evaluateU04(day.weton, geblakWetons);
            if (res.verdict === 'fail') eliminatedBy.push(res);
          }
          break;
        }
        case 'U-05': {
          const resGroom = evaluateU05(day.weton, groomWeton);
          const resBride = evaluateU05(day.weton, brideWeton);
          if (resGroom.verdict === 'fail') eliminatedBy.push(resGroom);
          if (resBride.verdict === 'fail') eliminatedBy.push(resBride);
          break;
        }
      }
    }

    // --- Profile Criteria ---
    let criteriaMet = 0;
    for (const ruleId of profile.criteria) {
      switch (ruleId) {
        case 'J-11': {
          const res = evaluateJ11(day);
          if (res.verdict === 'pass') criteriaMet++;
          criteriaOutcomes.push(res);
          break;
        }
        case 'J-33': {
          const res = evaluateJ33(day);
          if (res.verdict === 'pass') criteriaMet++;
          criteriaOutcomes.push(res);
          break;
        }
        case 'J-34': {
          const res = evaluateJ34(day);
          if (res.verdict === 'pass') criteriaMet++;
          criteriaOutcomes.push(res);
          break;
        }
        case 'U-01': {
          const res = evaluateU01(coupleTotalNeptu, day.weton.neptu);
          if (res.verdict === 'pass') criteriaMet++;
          criteriaOutcomes.push(res);
          break;
        }
      }
    }

    // --- Preference Matches ---
    const preferenceMatches: ('syawal' | 'jumat' | 'akhir-pekan')[] = [];
    const hijriDate = hijriAuthority === 'khgt' ? day.hijri.khgt : day.hijri.kemenag;
    if (hijriDate && hijriDate.month === 10) {
      preferenceMatches.push('syawal');
    }
    if (weton.dayIndex === 5) {
      preferenceMatches.push('jumat');
    }
    if (weton.dayIndex === 0 || weton.dayIndex === 6) {
      preferenceMatches.push('akhir-pekan');
    }

    // --- Saat execution hours ---
    const saat = evaluateJ35(day);
    const saatTanggal = evaluateJ36(day);

    candidates.push({
      day,
      eliminatedBy,
      criteriaMet,
      criteriaTotal: profile.criteria.length,
      outcomes: [...criteriaOutcomes, ...eliminatedBy],
      preferenceMatches,
      saat,
      saatTanggal,
    });
  }

  // 4. Partition eligible and eliminated
  const eligible = candidates.filter((c) => c.eliminatedBy.length === 0);
  const eliminated = candidates.filter((c) => c.eliminatedBy.length > 0);

  // 5. Deterministic sorting: criteriaMet desc → preferenceMatches.length desc → jdn asc
  eligible.sort((a, b) => {
    if (b.criteriaMet !== a.criteriaMet) {
      return b.criteriaMet - a.criteriaMet;
    }
    if (b.preferenceMatches.length !== a.preferenceMatches.length) {
      return b.preferenceMatches.length - a.preferenceMatches.length;
    }
    return a.day.jdn - b.day.jdn;
  });

  // 6. Decoupled Couple Profile calculation
  const groomJav = jdnToJavanese(groomJdn, reckoning);
  const brideJav = jdnToJavanese(brideJdn, reckoning);

  const coupleOutcomes: RuleOutcome[] = [
    evaluateB01(groomWeton.neptu, brideWeton.neptu),
    evaluateB02(groomWeton.neptu, brideWeton.neptu),
    evaluateJ15(groomWeton.neptu, brideWeton.neptu),
    evaluateJ16(groomWeton.neptu, brideWeton.neptu),
    evaluateJ17(groomWeton.dayIndex, brideWeton.dayIndex),
    evaluateJ22(groomWeton.neptu, brideWeton.neptu),
    evaluateJ23(groomWeton.neptu, brideWeton.neptu),
    evaluateJ24(groomWeton, groomJav, brideWeton, brideJav),
    evaluateJ25(groomWeton, groomJav, brideWeton, brideJav),
  ];

  const culturalTaboos = evaluateCulturalTaboos(
    groomWeton,
    brideWeton,
    couple.groom.childOrder,
    couple.bride.childOrder
  );

  const coupleProfile: CoupleProfileResult = {
    groomWeton,
    brideWeton,
    groomNeptu: groomWeton.neptu,
    brideNeptu: brideWeton.neptu,
    totalNeptu: coupleTotalNeptu,
    outcomes: coupleOutcomes,
    culturalTaboos,
    reminderText: getCoupleReminderText(),
  };

  // 7. Inactive / pending rules
  const inactiveRules = RULE_REGISTRY.filter((r) => r.dataStatus === 'pending');

  return {
    eligible,
    eliminated,
    coupleProfile,
    inactiveRules,
  };
}
