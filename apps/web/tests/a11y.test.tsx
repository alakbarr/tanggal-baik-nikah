import React from 'react';
import { describe, expect, it, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import axe from 'axe-core';
import { AntiTathayyurBanner } from '../src/components/AntiTathayyurBanner';
import { CoupleProfilePanel } from '../src/components/CoupleProfilePanel';
import { DateCard } from '../src/components/DateCard';
import { ResultsList } from '../src/components/ResultsList';
import { PrintableReport } from '../src/components/PrintableReport';
import { solve } from '@tanggal-baik/core';

describe('Accessibility Audits (axe-core WCAG 2.2 AA)', () => {
  afterEach(() => {
    cleanup();
  });

  it('AntiTathayyurBanner has zero axe violations', async () => {
    const { container } = render(<AntiTathayyurBanner />);
    const results = await axe.run(container, {
      rules: {
        // In JSDOM, color contrast calculation is mocked/unsupported without real browser layout engine
        'color-contrast': { enabled: false },
      },
    });
    expect(results.violations).toEqual([]);
  });

  it('CoupleProfilePanel has zero axe violations', async () => {
    const res = solve({
      couple: {
        groom: { birthDate: { year: 1998, month: 5, day: 28 } },
        bride: { birthDate: { year: 1999, month: 10, day: 28 } },
      },
      range: {
        start: { year: 2027, month: 1, day: 1 },
        end: { year: 2027, month: 1, day: 31 },
      },
    });

    const { container } = render(
      <CoupleProfilePanel
        profile={res.coupleProfile}
        groomName="Bagus"
        brideName="Raras"
      />
    );
    const results = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });

  it('DateCard has zero axe violations', async () => {
    const res = solve({
      couple: {
        groom: { birthDate: { year: 1998, month: 5, day: 28 } },
        bride: { birthDate: { year: 1999, month: 10, day: 28 } },
        traditionProfile: 'keraton',
      },
      range: {
        start: { year: 2027, month: 1, day: 1 },
        end: { year: 2027, month: 12, day: 31 },
      },
      weekendsOnly: true,
    });

    const { container } = render(
      <DateCard
        candidate={res.eligible[0]!}
        isTopRecommendation={true}
        onOpenDrawer={() => {}}
      />
    );
    const results = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });

  it('ResultsList has zero axe violations', async () => {
    const res = solve({
      couple: {
        groom: { birthDate: { year: 1998, month: 5, day: 28 } },
        bride: { birthDate: { year: 1999, month: 10, day: 28 } },
        traditionProfile: 'keraton',
      },
      range: {
        start: { year: 2027, month: 1, day: 1 },
        end: { year: 2027, month: 12, day: 31 },
      },
      weekendsOnly: true,
    });

    const { container } = render(
      <ResultsList
        eligible={res.eligible}
        eliminated={res.eliminated}
        onOpenDrawer={() => {}}
      />
    );
    const results = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });

  it('PrintableReport has zero axe violations', async () => {
    const res = solve({
      couple: {
        groom: { birthDate: { year: 1998, month: 5, day: 28 } },
        bride: { birthDate: { year: 1999, month: 10, day: 28 } },
        traditionProfile: 'keraton',
      },
      range: {
        start: { year: 2027, month: 1, day: 1 },
        end: { year: 2027, month: 12, day: 31 },
      },
      weekendsOnly: true,
    });

    const formData = {
      groomName: 'Bagus',
      groomBirthDate: '1998-05-28',
      groomBirthAfterSunset: false,
      brideName: 'Raras',
      brideBirthDate: '1999-10-28',
      brideBirthAfterSunset: false,
      weddingYear: 2027,
      weekendsOnly: true,
      traditionProfile: 'keraton' as const,
      iddahEndDate: '',
      dinaAlaVariant: 'both' as const,
    };

    const { container } = render(<PrintableReport formData={formData} solverResult={res} />);
    const results = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });
});
