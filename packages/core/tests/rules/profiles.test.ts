import { describe, expect, it } from 'vitest';
import {
  TRADITION_PROFILES,
  getTraditionProfile,
} from '../../src/rules/profiles.js';

describe('Tradition Profiles', () => {
  it('defines the 4 canonical profiles: keraton, pati, populer, custom', () => {
    expect(TRADITION_PROFILES.keraton).toBeDefined();
    expect(TRADITION_PROFILES.pati).toBeDefined();
    expect(TRADITION_PROFILES.populer).toBeDefined();
    expect(TRADITION_PROFILES.custom).toBeDefined();
  });

  it('keraton profile contains complete classical pantangan set', () => {
    const k = getTraditionProfile('keraton');
    expect(k.filters).toContain('J-07'); // Kunarpaning Warsa
    expect(k.filters).toContain('J-08'); // Sangaring Warsa
    expect(k.filters).toContain('J-12'); // Anggaraksih
    expect(k.filters).toContain('J-13'); // Larangan Sasi
    expect(k.filters).toContain('J-28'); // Naas Nabi
    expect(k.filters).toContain('J-31'); // Bangas Padewan
    expect(k.criteria).toContain('J-34'); // Rupa 3
  });

  it('pati profile activates U-01 through U-05', () => {
    const p = getTraditionProfile('pati');
    expect(p.filters).toContain('U-01'); // mod 3 == 2
    expect(p.filters).toContain('U-02'); // Weton penganten
    expect(p.filters).toContain('U-03'); // Weton orang tua
    expect(p.filters).toContain('U-04'); // Geblak orang tua
    expect(p.filters).toContain('U-05'); // Dina pengapesan
  });

  it('populer profile is balanced and allows user-friendly family consensus', () => {
    const pop = getTraditionProfile('populer');
    expect(pop.filters).toContain('J-07');
    expect(pop.filters).toContain('J-08');
    expect(pop.criteria).toContain('J-34');
  });
});
