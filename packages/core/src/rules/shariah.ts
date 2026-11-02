import type { RuleOutcome } from '../types.js';

export interface IhramInterval {
  readonly startJdn: number;
  readonly endJdn: number;
}

/**
 * S-01: Bride's Iddah Limit (QS. Al-Baqarah: 235 & KHI Pasal 153)
 * The wedding contract cannot take place until the bride's iddah has completed.
 */
export function evaluateS01Iddah(
  candidateJdn: number,
  iddahEndJdn?: number
): RuleOutcome {
  if (iddahEndJdn === undefined) {
    return {
      ruleId: 'S-01',
      verdict: 'pass',
      labelJv: 'Bebas Iddah',
      explanationId: 'Tidak ada batas masa iddah yang dicatat.',
    };
  }

  const isCompleted = candidateJdn > iddahEndJdn;

  return {
    ruleId: 'S-01',
    verdict: isCompleted ? 'pass' : 'fail',
    labelJv: isCompleted ? 'Selesai Iddah' : 'Masa Iddah',
    explanationId: isCompleted
      ? 'Tanggal akad telah melewati masa iddah calon mempelai wanita (QS. Al-Baqarah: 235).'
      : 'Tanggal akad belum melewati masa iddah calon mempelai wanita (QS. Al-Baqarah: 235).',
  };
}

/**
 * S-02: Ihram Limit (HR. Muslim No. 1409)
 * Marriage contract is invalid while either spouse or the guardian (wali) is in ihram.
 */
export function evaluateS02Ihram(
  candidateJdn: number,
  ihramPeriods?: readonly IhramInterval[]
): RuleOutcome {
  if (!ihramPeriods || ihramPeriods.length === 0) {
    return {
      ruleId: 'S-02',
      verdict: 'pass',
      labelJv: 'Bebas Ihram',
      explanationId: 'Tidak ada periode ihram yang tercatat.',
    };
  }

  const conflicting = ihramPeriods.find(
    (p) => candidateJdn >= p.startJdn && candidateJdn <= p.endJdn
  );

  return {
    ruleId: 'S-02',
    verdict: conflicting ? 'fail' : 'pass',
    labelJv: conflicting ? 'Kondisi Ihram' : 'Bebas Ihram',
    explanationId: conflicting
      ? 'Akad nikah tidak sah saat mempelai atau wali sedang berihram haji/umrah (HR. Muslim No. 1409).'
      : 'Bebas dari kondisi ihram haji atau umrah.',
  };
}
