import type {
  HastawaraName,
  PancawaraName,
  SadwaraName,
  SangawaraName,
  SaptawaraName,
  SasiJawa,
  TahunWindu,
  WukuName,
} from '../types.js';

export const NEPTU_DAY: readonly [number, number, number, number, number, number, number] =
  Object.freeze([5, 4, 3, 7, 8, 6, 9]);

export const NEPTU_PASARAN: readonly [number, number, number, number, number] =
  Object.freeze([5, 9, 7, 4, 8]);

export const SAPTAWARA_NAMES: readonly SaptawaraName[] = Object.freeze([
  'Ahad',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
]);

export const PANCAWARA_NAMES: readonly PancawaraName[] = Object.freeze([
  'Legi',
  'Pahing',
  'Pon',
  'Wage',
  'Kliwon',
]);

export const SADWARA_NAMES: readonly SadwaraName[] = Object.freeze([
  'Tungle',
  'Aryang',
  'Wurukung',
  'Paningron',
  'Uwas',
  'Mawulu',
]);

export const HASTAWARA_NAMES: readonly HastawaraName[] = Object.freeze([
  'Sri',
  'Indra',
  'Guru',
  'Yama',
  'Rudra',
  'Brama',
  'Kala',
  'Uma',
]);

export const SANGAWARA_NAMES: readonly SangawaraName[] = Object.freeze([
  'Dangu',
  'Jagur',
  'Gigis',
  'Kerangan',
  'Nohan',
  'Wogan',
  'Tulus',
  'Wurung',
  'Dadi',
]);

export const WUKU_NAMES: readonly WukuName[] = Object.freeze([
  'Sinta',
  'Landep',
  'Wukir',
  'Kurantil',
  'Tolu',
  'Gumbreg',
  'Warigalit',
  'Warigagung',
  'Julungwangi',
  'Sungsang',
  'Galungan',
  'Kuningan',
  'Langkir',
  'Mandasiya',
  'Julungpujut',
  'Pahang',
  'Kuruwelut',
  'Marakeh',
  'Tambir',
  'Medangkungan',
  'Maktal',
  'Wuye',
  'Manahil',
  'Prangbakat',
  'Bala',
  'Wugu',
  'Wayang',
  'Kulawu',
  'Dukut',
  'Watugunung',
]);

export const SASI_JAWA_NAMES: readonly SasiJawa[] = Object.freeze([
  'Sura',
  'Sapar',
  'Mulud',
  'Bakdamulud',
  'Jumadilawal',
  'Jumadilakir',
  'Rejeb',
  'Ruwah',
  'Pasa',
  'Sawal',
  'Dulkangidah',
  'Besar',
]);

export const TAHUN_WINDU_NAMES: readonly TahunWindu[] = Object.freeze([
  'Alip',
  'Ehe',
  'Jimawal',
  'Je',
  'Dal',
  'Be',
  'Wawu',
  'Jimakir',
]);

export const HIJRI_MONTH_NAMES: readonly string[] = Object.freeze([
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  'Syaban',
  'Ramadan',
  'Syawal',
  'Zulkaidah',
  'Zulhijah',
]);
