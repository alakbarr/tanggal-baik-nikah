export type SaptawaraIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Ahad
export type SaptawaraName = 'Ahad' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export type PancawaraIndex = 0 | 1 | 2 | 3 | 4; // 0 = Legi
export type PancawaraName = 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon';

export type SadwaraName = 'Tungle' | 'Aryang' | 'Wurukung' | 'Paningron' | 'Uwas' | 'Mawulu';

export type HastawaraName =
  | 'Sri'
  | 'Indra'
  | 'Guru'
  | 'Yama'
  | 'Rudra'
  | 'Brama'
  | 'Kala'
  | 'Uma';

export type SangawaraName =
  | 'Dangu'
  | 'Jagur'
  | 'Gigis'
  | 'Kerangan'
  | 'Nohan'
  | 'Wogan'
  | 'Tulus'
  | 'Wurung'
  | 'Dadi';

export type WukuName =
  | 'Sinta'
  | 'Landep'
  | 'Wukir'
  | 'Kurantil'
  | 'Tolu'
  | 'Gumbreg'
  | 'Warigalit'
  | 'Warigagung'
  | 'Julungwangi'
  | 'Sungsang'
  | 'Galungan'
  | 'Kuningan'
  | 'Langkir'
  | 'Mandasiya'
  | 'Julungpujut'
  | 'Pahang'
  | 'Kuruwelut'
  | 'Marakeh'
  | 'Tambir'
  | 'Medangkungan'
  | 'Maktal'
  | 'Wuye'
  | 'Manahil'
  | 'Prangbakat'
  | 'Bala'
  | 'Wugu'
  | 'Wayang'
  | 'Kulawu'
  | 'Dukut'
  | 'Watugunung';

export type SasiJawa =
  | 'Sura'
  | 'Sapar'
  | 'Mulud'
  | 'Bakdamulud'
  | 'Jumadilawal'
  | 'Jumadilakir'
  | 'Rejeb'
  | 'Ruwah'
  | 'Pasa'
  | 'Sawal'
  | 'Dulkangidah'
  | 'Besar';

export type TahunWindu = 'Alip' | 'Ehe' | 'Jimawal' | 'Je' | 'Dal' | 'Be' | 'Wawu' | 'Jimakir';

/** 'kurup' = official Sultan Agungan reckoning with gugur sedina every 120 years (Asapon → Anenhing).
 *  'aboge' = community reckoning that kept Alip Rebo Wage without the 1866 J correction. */
export type JavaneseReckoning = 'kurup' | 'aboge';
export type KurupName = 'Aboge' | 'Asapon' | 'Anenhing';

export interface GregorianDate {
  readonly year: number;
  readonly month: number; // 1..12
  readonly day: number; // 1..31
}

export interface Weton {
  readonly dayIndex: SaptawaraIndex;
  readonly pasaranIndex: PancawaraIndex;
  readonly neptu: number; // 7..18
  readonly dayName?: SaptawaraName;
  readonly pasaranName?: PancawaraName;
}

export interface JavaneseDate {
  readonly day: number; // 1..30
  readonly sasi: SasiJawa;
  readonly sasiIndex: number; // 0..11
  readonly year: number; // e.g. 1960
  readonly tahun: TahunWindu;
  readonly kurup: KurupName;
  readonly isLongYear: boolean; // Besar has 30 days
}

export interface PawukonPosition {
  readonly dayInCycle: number; // d = (JDN - 146) mod 210
  readonly wukuIndex: number; // 0..29
  readonly wuku: WukuName;
  readonly sadwara: SadwaraName;
  readonly hastawara?: HastawaraName;
  readonly sangawara?: SangawaraName;
}

export type HijriAuthority = 'kemenag' | 'khgt';
export type HijriBasis = 'official' | 'forecast';

export interface HijriDate {
  readonly day: number;
  readonly month: number; // 1..12
  readonly year: number;
  readonly authority: HijriAuthority;
  readonly basis: HijriBasis; // forecast = computed, not yet ratified
}

export interface DayPoint {
  readonly jdn: number;
  readonly gregorian: GregorianDate;
  readonly weton: Weton;
  readonly javanese: JavaneseDate;
  readonly pawukon: PawukonPosition;
  readonly hijri: {
    readonly kemenag: HijriDate | null;
    readonly khgt: HijriDate | null;
  };
}

// ---------------------------------------------------------------- rules
export type RuleLayer = 'couple' | 'date' | 'shariah';
export type SourceTier = 'T0' | 'T1' | 'T1-L' | 'T2' | 'T3';

export interface RuleDefinition {
  readonly id: string; // 'J-12', 'B-01', 'U-01', 'S-01'
  readonly layer: RuleLayer;
  readonly nameJv: string;
  readonly summaryId: string; // Indonesian UI copy
  readonly source: {
    readonly title: string;
    readonly locator: string;
    readonly tier: SourceTier;
  };
  readonly dataStatus: 'verified' | 'secondary' | 'pending';
  readonly kurupAssumption?: KurupName;
  readonly conflictsWith?: readonly string[];
}

export interface RuleOutcome {
  readonly ruleId: string;
  readonly verdict: 'pass' | 'fail' | 'info';
  readonly labelJv: string; // e.g. 'Taliwangke', 'Pesthi'
  readonly explanationId: string; // arithmetic explanation
}

// ---------------------------------------------------------------- solver
export type TraditionProfileId = 'keraton' | 'pati' | 'populer' | 'custom';

export interface TraditionProfile {
  readonly id: TraditionProfileId;
  readonly filters: readonly string[]; // date rules that eliminate a date
  readonly criteria: readonly string[]; // date rules that count as "criteria met"
  readonly variantChoices: Readonly<Record<string, string>>; // e.g. { 'J-26/J-27': 'both' }
}

export interface SaatEntry {
  readonly start: string;
  readonly end: string;
  readonly labelJv: string;
}

export interface CandidateResult {
  readonly day: DayPoint;
  readonly eliminatedBy: readonly RuleOutcome[]; // empty → date is eligible
  readonly criteriaMet: number;
  readonly criteriaTotal: number;
  readonly outcomes: readonly RuleOutcome[];
  readonly preferenceMatches: readonly ('syawal' | 'jumat' | 'akhir-pekan')[];
  readonly saat: readonly SaatEntry[];
}

export interface PersonProfile {
  readonly name?: string;
  readonly birthDate: GregorianDate;
  readonly birthAfterSunset?: boolean;
  readonly fatherBirthWeton?: Weton;
  readonly motherBirthWeton?: Weton;
  readonly deceasedParentsGeblak?: readonly Weton[];
}

export interface CoupleInput {
  readonly groom: PersonProfile;
  readonly bride: PersonProfile;
  readonly traditionProfile?: TraditionProfileId;
  readonly customProfile?: TraditionProfile;
  readonly reckoning?: JavaneseReckoning;
  readonly hijriAuthority?: HijriAuthority;
  readonly iddahEndDate?: GregorianDate;
  readonly ihramPeriods?: readonly {
    readonly start: GregorianDate;
    readonly end: GregorianDate;
  }[];
}

export interface DateRange {
  readonly start: GregorianDate;
  readonly end: GregorianDate;
}

export interface SolveOptions {
  readonly couple: CoupleInput;
  readonly range: DateRange;
  readonly weekendsOnly?: boolean;
  readonly preferredMonthsHijri?: readonly number[];
}

export interface CoupleProfileResult {
  readonly groomWeton: Weton;
  readonly brideWeton: Weton;
  readonly groomNeptu: number;
  readonly brideNeptu: number;
  readonly totalNeptu: number;
  readonly outcomes: readonly RuleOutcome[];
  readonly reminderText: string;
}

export interface SolverResult {
  readonly eligible: readonly CandidateResult[];
  readonly eliminated: readonly CandidateResult[];
  readonly coupleProfile: CoupleProfileResult;
  readonly inactiveRules: readonly RuleDefinition[];
}
