import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { AntiTathayyurBanner } from '../src/components/AntiTathayyurBanner';
import { CoupleForm } from '../src/components/CoupleForm';
import { CoupleProfilePanel } from '../src/components/CoupleProfilePanel';
import { DateCard } from '../src/components/DateCard';
import { ResultsList } from '../src/components/ResultsList';
import { PrintableReport } from '../src/components/PrintableReport';
import { ShareCardModal } from '../src/components/ShareCardModal';
import { solve } from '@tanggal-baik/core';

describe('Web UI Components (Nawa Rahayu & Sakinah)', () => {
  afterEach(() => {
    cleanup();
  });
  it('AntiTathayyurBanner: renders theological anchor and hadith citations', () => {
    render(<AntiTathayyurBanner />);

    expect(
      screen.getByText(/Landasan Tauhid & Fiqih Pernikahan \(Anti-Tathayyur\)/i)
    ).toBeDefined();
    expect(
      screen.getByText(/HR\. Tirmidzi no\. 1614/i)
    ).toBeDefined();
    expect(
      screen.getByText(/KHI Pasal 14/i)
    ).toBeDefined();
  });

  it('CoupleForm: calculates and displays live weton badge (Kamis Pon 15, Kamis Legi 13)', () => {
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

    render(
      <CoupleForm
        formData={formData}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        onReset={vi.fn()}
      />
    );

    // Live badges should appear
    expect(screen.getByText(/Kamis Pon \(neptu 15\)/i)).toBeDefined();
    expect(screen.getByText(/Kamis Legi \(neptu 13\)/i)).toBeDefined();
  });

  it('CoupleProfilePanel: renders decoupled panel with standing reminder', () => {
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

    render(
      <CoupleProfilePanel
        profile={res.coupleProfile}
        groomName="Bagus"
        brideName="Raras"
      />
    );

    // Total neptu 28
    expect(screen.getByText(/Total Neptu:/i)).toBeDefined();
    // B-01 Pegat
    expect(screen.getByText(/B-01/i)).toBeDefined();
    expect(screen.getAllByText(/Pegat/i).length).toBeGreaterThan(0);
    // Anti-fatalism decoupling statement
    expect(screen.getByText(/Prinsip Kemandirian Tanggal:/i)).toBeDefined();
  });

  it('DateCard: renders count-based criteria badge and saat window', () => {
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

    const topCandidate = res.eligible[0]!;
    const onOpenDrawer = vi.fn();

    render(
      <DateCard
        candidate={topCandidate}
        isTopRecommendation={true}
        onOpenDrawer={onOpenDrawer}
      />
    );

    expect(screen.getByText(/Pilihan Utama/i)).toBeDefined();
    expect(screen.getByText(/Memenuhi 2 dari 3 kriteria adat/i)).toBeDefined();
    expect(screen.getByText(/17 Januari 2027/i)).toBeDefined();
    expect(screen.getByText(/8 Ruwah 1960 Be/i)).toBeDefined();

    // Click button to open drawer
    const openBtn = screen.getByRole('button', { name: /Lihat Dalil & Kitab Rujukan/i });
    fireEvent.click(openBtn);
    expect(onOpenDrawer).toHaveBeenCalledWith(topCandidate);
  });

  it('ResultsList: renders eligible candidates and collapsible eliminated list', () => {
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

    render(
      <ResultsList
        eligible={res.eligible}
        eliminated={res.eliminated}
        onOpenDrawer={vi.fn()}
      />
    );

    expect(screen.getByText(/Ditemukan/i)).toBeDefined();
    expect(screen.getByText(/Tanggal yang Gugur dalam Saringan Adat/i)).toBeDefined();
  });

  it('PrintableReport: renders clean print layout with tauhid foundation and KHI pillars', () => {
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

    render(<PrintableReport formData={formData} solverResult={res} />);

    expect(screen.getByText(/Laporan Rekomendasi Hari Akad Nikah/i)).toBeDefined();
    expect(screen.getByText(/Landasan Tauhid & Pembebasan dari Khurafat/i)).toBeDefined();
    expect(screen.getByText(/Legalitas Rukun Nikah Menurut Fiqh Munakahat & Kompilasi Hukum Islam \(KHI\)/i)).toBeDefined();
    expect(screen.getByText(/Bagus/i)).toBeDefined();
    expect(screen.getByText(/Raras/i)).toBeDefined();
  });

  it('ShareCardModal: renders modal dialog with PNG download trigger', () => {
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

    const topCandidate = res.eligible[0]!;
    const onClose = vi.fn();

    render(
      <ShareCardModal
        candidate={topCandidate}
        groomName="Bagus"
        brideName="Raras"
        onClose={onClose}
      />
    );

    expect(screen.getByText(/Kartu Rekomendasi Hari Akad/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Unduh Gambar PNG/i })).toBeDefined();

    const closeBtn = screen.getByRole('button', { name: /^Tutup$/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
