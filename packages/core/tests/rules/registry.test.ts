import { describe, expect, it } from 'vitest';
import { RULE_REGISTRY, getRuleDefinition } from '../../src/rules/registry.js';

describe('Rule Registry & Provenance Integrity', () => {
  it('contains unique rule IDs across all rules', () => {
    const ids = RULE_REGISTRY.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('guarantees every verified rule has complete provenance (locator with page)', () => {
    const verifiedRules = RULE_REGISTRY.filter((r) => r.dataStatus === 'verified');
    expect(verifiedRules.length).toBeGreaterThan(25);

    for (const rule of verifiedRules) {
      expect(rule.source.title.trim().length).toBeGreaterThan(0);
      expect(rule.source.locator.trim().length).toBeGreaterThan(0);
      // Locator must point to a page, bab, article, hadith number, or Quran verse reference
      const lower = rule.source.locator.toLowerCase();
      const hasSpecificCitation =
        lower.includes('p.') ||
        lower.includes('hlm.') ||
        lower.includes('kaca') ||
        lower.includes('pasal') ||
        lower.includes('no.') ||
        lower.includes('qs.');
      expect(
        hasSpecificCitation,
        `Rule ${rule.id} locator "${rule.source.locator}" missing specific citation`
      ).toBe(true);
    }
  });

  it('ensures pending rules are explicitly marked with dataStatus pending', () => {
    const pendingRules = RULE_REGISTRY.filter((r) => r.dataStatus === 'pending');
    const pendingIds = pendingRules.map((r) => r.id);
    expect(pendingIds).toContain('J-18');
    expect(pendingIds).toContain('J-21');
    expect(pendingIds).toContain('J-37');
  });

  it('retrieves rule definition by ID', () => {
    const r15 = getRuleDefinition('J-15');
    expect(r15).toBeDefined();
    expect(r15?.layer).toBe('couple');
    expect(r15?.nameJv).toContain('9');

    const b01 = getRuleDefinition('B-01');
    expect(b01).toBeDefined();
    expect(b01?.layer).toBe('couple');

    const u01 = getRuleDefinition('U-01');
    expect(u01).toBeDefined();
    expect(u01?.layer).toBe('date');
    expect(u01?.source.tier).toBe('T1-L');
  });
});
