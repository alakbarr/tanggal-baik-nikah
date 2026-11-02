import { describe, expect, it } from 'vitest';
import { CORE_VERSION } from '@tanggal-baik/core';

describe('web smoke test', () => {
  it('successfully links @tanggal-baik/core', () => {
    expect(CORE_VERSION).toBe('0.1.0');
  });
});
