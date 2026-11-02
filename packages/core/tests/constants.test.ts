import { describe, expect, it } from 'vitest';
import {
  NEPTU_DAY,
  NEPTU_PASARAN,
  SAPTAWARA_NAMES,
  PANCAWARA_NAMES,
  SADWARA_NAMES,
  WUKU_NAMES,
  SASI_JAWA_NAMES,
  TAHUN_WINDU_NAMES,
} from '../src/constants/neptu.js';

describe('Constants and Neptu Tables', () => {
  it('has correct day neptu table starting with Ahad=5', () => {
    expect(NEPTU_DAY).toEqual([5, 4, 3, 7, 8, 6, 9]);
    expect(NEPTU_DAY.length).toBe(7);
  });

  it('has correct pasaran neptu table starting with Legi=5', () => {
    expect(NEPTU_PASARAN).toEqual([5, 9, 7, 4, 8]);
    expect(NEPTU_PASARAN.length).toBe(5);
  });

  it('has complete, frozen name lists', () => {
    expect(SAPTAWARA_NAMES).toEqual([
      'Ahad',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ]);
    expect(PANCAWARA_NAMES).toEqual(['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']);
    expect(SADWARA_NAMES).toEqual([
      'Tungle',
      'Aryang',
      'Wurukung',
      'Paningron',
      'Uwas',
      'Mawulu',
    ]);
    expect(WUKU_NAMES.length).toBe(30);
    expect(WUKU_NAMES[0]).toBe('Sinta');
    expect(WUKU_NAMES[29]).toBe('Watugunung');
    expect(SASI_JAWA_NAMES.length).toBe(12);
    expect(SASI_JAWA_NAMES[0]).toBe('Sura');
    expect(SASI_JAWA_NAMES[11]).toBe('Besar');
    expect(TAHUN_WINDU_NAMES).toEqual([
      'Alip',
      'Ehe',
      'Jimawal',
      'Je',
      'Dal',
      'Be',
      'Wawu',
      'Jimakir',
    ]);
  });

  it('enforces immutability via Object.freeze', () => {
    expect(Object.isFrozen(NEPTU_DAY)).toBe(true);
    expect(Object.isFrozen(NEPTU_PASARAN)).toBe(true);
    expect(Object.isFrozen(SAPTAWARA_NAMES)).toBe(true);
    expect(Object.isFrozen(PANCAWARA_NAMES)).toBe(true);
    expect(Object.isFrozen(SADWARA_NAMES)).toBe(true);
    expect(Object.isFrozen(WUKU_NAMES)).toBe(true);
    expect(Object.isFrozen(SASI_JAWA_NAMES)).toBe(true);
    expect(Object.isFrozen(TAHUN_WINDU_NAMES)).toBe(true);
  });
});
