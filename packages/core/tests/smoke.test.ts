import { describe, expect, it } from 'vitest';
import { CORE_VERSION } from '../src/index.js';

describe('core smoke test', () => {
  it('exports CORE_VERSION', () => {
    expect(CORE_VERSION).toBe('0.1.0');
  });
});
