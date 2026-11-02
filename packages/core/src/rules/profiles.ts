import type { TraditionProfile, TraditionProfileId } from '../types.js';

export const TRADITION_PROFILES: Readonly<Record<TraditionProfileId, TraditionProfile>> =
  Object.freeze({
    keraton: {
      id: 'keraton',
      filters: [
        'J-07', // Kunarpaning Warsa
        'J-08', // Sangaring Warsa
        'J-12', // Anggaraksih (Selasa Kliwon)
        'J-13', // Larangan Sasi
        'J-26', // Dina Ala
        'J-27', // Dina Sangaring Asal
        'J-28', // Naasing Para Nabi
        'J-29', // Naasing Tanggal
        'J-31', // Bangas Padewan
        'J-32', // Taliwangke Sasi
        'J-33', // Ala Beciking Sasi (Sura, Mulud, Pasa, Dulkangidah dipantangkan)
      ],
      criteria: [
        'J-11', // Pati Uriping Sasi (Bulan Becik)
        'J-33', // Ala Beciking Sasi (Bulan Utama: Jumadilakir, Rejeb, Ruwah, Besar)
        'J-34', // Pilihan Dina Rupa 3 (Tumbuk Tibane Padha Becik)
      ],
      variantChoices: {
        dina_ala: 'both',
      },
    },
    pati: {
      id: 'pati',
      filters: [
        'U-01', // Ternary mod 3 == 2
        'U-02', // Weton Penganten
        'U-03', // Weton Wong Tuwa
        'U-04', // Geblak Wong Tuwa
        'U-05', // Dina Pengapesan
        'J-07', // Kunarpaning Warsa
        'J-08', // Sangaring Warsa
      ],
      criteria: [
        'J-34', // Rupa 3
        'J-33', // Ala Beciking Sasi
      ],
      variantChoices: {},
    },
    populer: {
      id: 'populer',
      filters: [
        'J-07', // Kunarpaning Warsa
        'J-08', // Sangaring Warsa
        'J-12', // Anggaraksih
        'U-02', // Weton Penganten
      ],
      criteria: [
        'J-34', // Rupa 3
        'J-33', // Ala Beciking Sasi
        'U-01', // Ternary mod 3
      ],
      variantChoices: {
        dina_ala: 'J-26',
      },
    },
    custom: {
      id: 'custom',
      filters: [
        'J-07',
        'J-08',
        'U-02',
      ],
      criteria: [
        'J-34',
        'J-33',
      ],
      variantChoices: {},
    },
  });

export function getTraditionProfile(id: TraditionProfileId = 'keraton'): TraditionProfile {
  return TRADITION_PROFILES[id] ?? TRADITION_PROFILES.keraton;
}
