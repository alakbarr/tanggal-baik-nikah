import { test, expect } from '@playwright/test';

test.describe('E2E User Journeys (Tanggal Baik Nikah)', () => {
  test('Journey 1: Form -> Results -> Calendar Grid -> Provenance Drawer', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Tanggal Baik Nikah/i);

    // 2. Verify Anti-Tathayyur Banner & KHI
    await expect(page.getByText(/Landasan Tauhid & Fiqih Pernikahan/i)).toBeVisible();
    await expect(page.getByText(/HR\. Tirmidzi no\. 1614/i).first()).toBeVisible();

    // 3. Check Live Weton Badges
    await expect(page.getByText(/Kamis Pon \(neptu 15\)/i).first()).toBeVisible();
    await expect(page.getByText(/Kamis Legi \(neptu 13\)/i).first()).toBeVisible();

    // 4. Verify Decoupled Static Couple Profile Panel
    await expect(page.getByText(/Profil Kecocokan Pasangan \(Statis\)/i)).toBeVisible();
    await expect(page.getByText(/Total Neptu: 28/i)).toBeVisible();

    // 5. Verify Results List & Golden Recommendation Date (17 Januari 2027)
    await expect(page.getByText(/Rekomendasi Tanggal Akad \(2027\)/i)).toBeVisible();
    await expect(page.getByText(/17 Januari 2027/i).first()).toBeVisible();
    await expect(page.getByText(/8 Ruwah 1960 Be/i).first()).toBeVisible();

    // 6. Switch to Calendar Grid View
    await page.getByRole('button', { name: /Kalender 3 Sistem/i }).click();
    await expect(page.getByRole('heading', { name: /Januari 2027/i })).toBeVisible();
    await expect(page.getByText('Ahad', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Sabtu', { exact: true }).first()).toBeVisible();

    // 7. Click on a candidate date in Grid or switch back to List to open Drawer
    await page.getByRole('button', { name: /Daftar Kartu/i }).click();
    const openDrawerBtn = page.getByRole('button', { name: /Lihat Dalil & Kitab Rujukan/i }).first();
    await openDrawerBtn.click();

    // 8. Verify Drawer is open with Dual-Track Provenance
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/Transparansi Dalil & Kitab Rujukan/i)).toBeVisible();
    await expect(page.getByText(/Jalur 1: Tuntunan Syariah & Sunnah Nabi/i)).toBeVisible();
    await expect(page.getByText(/Jalur 2: Kajian Petungan Tradisi Jawa/i)).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('Journey 2: Dark Mode Theme Toggle', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Toggle theme button
    const themeBtn = page.getByRole('button', { name: /Ganti ke tema/i });
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);

    await themeBtn.click();
    await expect(html).toHaveClass(/dark/);
  });

  test('Journey 3: Static Navigation to Auxiliary Routes', async ({ page }) => {
    // 1. Weton Checker
    await page.goto('/weton/');
    await expect(page.getByRole('heading', { name: /Cek Weton & Koordinat Penanggalan Jawa/i })).toBeVisible();
    await expect(page.getByText(/Jumlah Neptu:/i)).toBeVisible();
    await expect(page.getByText(/Pawukon & Paringkelan/i)).toBeVisible();

    // 2. Interactive Calendar
    await page.goto('/kalender/');
    await expect(page.getByRole('heading', { name: /Kalender Masehi, Jawa & Hijriah/i })).toBeVisible();
    await expect(page.getByText(/Masehi, pasaran & sasi Jawa/i)).toBeVisible();

    // 3. Bilingual Glossary
    await page.goto('/glossary/');
    await expect(page.getByRole('heading', { name: /Glosarium Falak & Fiqih Nikah/i })).toBeVisible();
    await expect(page.getByText(/Pancawara/i)).toBeVisible();
    await expect(page.getByText(/Tathayyur \/ Thiyarah/i)).toBeVisible();
  });

  test('Journey 4: Privacy Audit (Zero requests leave the origin)', async ({ page }) => {
    const externalRequests: string[] = [];

    page.on('request', (req) => {
      const url = new URL(req.url());
      if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
        externalRequests.push(req.url());
      }
    });

    await page.goto('/');
    // Type new date in form
    await page.fill('#groomName', 'Raden');
    await page.fill('#brideName', 'Sekar');
    await page.getByRole('button', { name: /Cari Rekomendasi Tanggal Baik/i }).click();

    expect(externalRequests).toEqual([]);
  });
});
