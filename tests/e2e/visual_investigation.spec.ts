import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Exhaustive Visual and Functional Investigation', () => {
  const screenshotDir = path.resolve(process.cwd(), 'scratch/investigation_screenshots');

  test('Suite 1: Home Page Full Visual Walkthrough & Component Inspection', async ({ page }) => {
    test.setTimeout(60000);
    // Collect console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Visit homepage (Desktop Dark Mode by default)
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Ensure Dark Mode is active
    const html = page.locator('html');
    if (!(await html.getAttribute('class'))?.includes('dark')) {
      await page.getByRole('button', { name: /Ganti ke tema/i }).click();
    }
    await expect(html).toHaveClass(/dark/);

    // Screenshot 01: Home Desktop Dark
    await page.screenshot({
      path: path.join(screenshotDir, '01_home_desktop_dark.png'),
      fullPage: true,
    });

    // 2. Toggle to Light Mode
    const themeBtn = page.getByRole('button', { name: /Ganti ke tema/i });
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);

    // Screenshot 02: Home Desktop Light
    await page.screenshot({
      path: path.join(screenshotDir, '02_home_desktop_light.png'),
      fullPage: true,
    });

    // Return to Dark Mode for detailed component audits
    await themeBtn.click();
    await expect(html).toHaveClass(/dark/);

    // Screenshot 05: Anti-Tathayyur Banner
    const banner = page.locator('aside[aria-label="Landasan Tauhid dan Anti-Tathayyur"]');
    await expect(banner).toBeVisible();
    await banner.screenshot({
      path: path.join(screenshotDir, '05_antitathayyur_banner.png'),
    });

    // Screenshot 06: CoupleForm Default
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
    await form.screenshot({
      path: path.join(screenshotDir, '06_couple_form_default.png'),
    });

    // Screenshot 07: CoupleForm Advanced Options Expanded
    const advancedToggle = page.getByRole('button', { name: /Pengaturan Lanjutan/i });
    await advancedToggle.click();
    await page.waitForTimeout(300);
    await form.screenshot({
      path: path.join(screenshotDir, '07_couple_form_advanced_expanded.png'),
    });

    // Screenshot 08: CoupleProfilePanel
    const profilePanel = page.locator('section[aria-label="Profil Weton Pasangan"]');
    await expect(profilePanel).toBeVisible();
    await profilePanel.screenshot({
      path: path.join(screenshotDir, '08_couple_profile_panel.png'),
    });

    // Screenshot 09: Top Recommended DateCard
    const topCard = page.locator('article[aria-label^="Rekomendasi"]').first();
    await expect(topCard).toBeVisible();
    await expect(topCard.getByText(/Pilihan Utama/i)).toBeVisible();
    await topCard.screenshot({
      path: path.join(screenshotDir, '09_date_card_top_recommendation.png'),
    });

    // Screenshot 10: Subordinate DateCard
    const secondCard = page.locator('article[aria-label^="Rekomendasi"]').nth(1);
    if (await secondCard.isVisible()) {
      await secondCard.screenshot({
        path: path.join(screenshotDir, '10_date_card_subordinate.png'),
      });
    }

    // Screenshot 11: Eliminated Dates Accordion Expanded
    const eliminatedToggle = page.getByRole('button', { name: /Tanggal yang Gugur dalam Saringan Adat/i });
    if (await eliminatedToggle.isVisible()) {
      await eliminatedToggle.click();
      await page.waitForTimeout(300);
      const eliminatedSection = page.locator('div').filter({ hasText: /Tanggal yang Gugur dalam Saringan Adat/i }).first();
      await eliminatedSection.screenshot({
        path: path.join(screenshotDir, '11_eliminated_dates_accordion_expanded.png'),
      });
    }

    // Screenshot 12: Calendar Grid View
    const calViewBtn = page.getByRole('button', { name: /Kalender 3 Sistem/i });
    await calViewBtn.click();
    await page.waitForTimeout(400);
    const gridView = page.locator('div').filter({ hasText: /Penanggalan 3 Sistem: Masehi/i }).first();
    await expect(gridView).toBeVisible();
    await page.screenshot({
      path: path.join(screenshotDir, '12_view_switcher_calendar_grid.png'),
    });

    // Screenshot 13: Provenance Drawer Desktop
    // Switch back to list view and click "Lihat Dalil & Kitab Rujukan"
    await page.getByRole('button', { name: /Daftar Kartu/i }).click();
    const openDrawerBtn = page.getByRole('button', { name: /Lihat Dalil & Kitab Rujukan/i }).first();
    await openDrawerBtn.click();
    await page.waitForTimeout(400);
    const drawerDialog = page.getByRole('dialog');
    await expect(drawerDialog).toBeVisible();
    await expect(drawerDialog.getByText(/Transparansi Dalil & Kitab Rujukan/i)).toBeVisible();
    await page.screenshot({
      path: path.join(screenshotDir, '13_provenance_drawer_desktop.png'),
    });

    // Close Drawer via Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(drawerDialog).toBeHidden();

    // Screenshot 15: ShareCardModal
    const shareBtn = page.getByRole('button', { name: /Kartu Grafis/i }).first();
    await shareBtn.click();
    await page.waitForTimeout(500);
    const modalDialog = page.getByRole('dialog');
    await expect(modalDialog).toBeVisible();
    await expect(modalDialog.getByText(/Kartu Rekomendasi Hari Akad/i)).toBeVisible();
    await page.screenshot({
      path: path.join(screenshotDir, '15_share_card_modal.png'),
    });

    // Close modal
    const closeBtn = modalDialog.getByRole('button', { name: /Tutup pratinjau kartu/i });
    await closeBtn.click();
    await page.waitForTimeout(300);
    await expect(modalDialog).toBeHidden();

    // Screenshot 30: Printable Dossier Report (Media: Print)
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({
      path: path.join(screenshotDir, '30_printable_report_dossier.png'),
      fullPage: true,
    });
    await page.emulateMedia({ media: 'screen' });

    expect(consoleErrors).toEqual([]);
  });

  test('Suite 2: Mobile Viewport Walkthrough (Home & Drawer)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');

    // Screenshot 03: Home Mobile Dark
    await expect(html).toHaveClass(/dark/);
    await page.screenshot({
      path: path.join(screenshotDir, '03_home_mobile_dark.png'),
      fullPage: true,
    });

    // Toggle to Light Mode on Mobile
    const themeBtn = page.getByRole('button', { name: /Ganti ke tema/i });
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);

    // Screenshot 04: Home Mobile Light
    await page.screenshot({
      path: path.join(screenshotDir, '04_home_mobile_light.png'),
      fullPage: true,
    });

    // Toggle back to Dark Mode
    await themeBtn.click();

    // Screenshot 14: Provenance Drawer Mobile
    const openDrawerBtn = page.getByRole('button', { name: /Lihat Dalil & Kitab Rujukan/i }).first();
    await openDrawerBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(screenshotDir, '14_provenance_drawer_mobile.png'),
    });

    await page.keyboard.press('Escape');
  });

  test('Suite 3: Cek Weton Page Walkthrough', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/weton/');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Screenshot 16: Weton Page Desktop Dark
    await page.screenshot({
      path: path.join(screenshotDir, '16_weton_page_desktop_dark.png'),
      fullPage: true,
    });

    // Toggle to Light Mode
    const themeBtn = page.getByRole('button', { name: /Ganti ke tema/i });
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);

    // Screenshot 17: Weton Page Desktop Light
    await page.screenshot({
      path: path.join(screenshotDir, '17_weton_page_desktop_light.png'),
      fullPage: true,
    });

    // Return to Dark Mode
    await themeBtn.click();

    // Interactive Test: change date & toggle after sunset
    const birthInput = page.locator('#birthInput');
    await birthInput.fill('1995-08-17'); // 17 Agustus 1995: Kamis Pon (neptu 8+7 = 15)
    await page.waitForTimeout(300);

    await expect(page.getByText(/Kamis Pon/i)).toBeVisible();
    await expect(page.getByText(/Jumlah Neptu: 15/i)).toBeVisible();

    // Check "Lahir setelah waktu maghrib / surup"
    const sunsetCheckbox = page.getByRole('checkbox');
    await sunsetCheckbox.check();
    await page.waitForTimeout(300);

    // Next day: Jumat Wage (neptu 6+4 = 10)
    await expect(page.getByText(/Jumat Wage/i)).toBeVisible();
    await expect(page.getByText(/Jumlah Neptu: 10/i)).toBeVisible();

    // Screenshot 19: Weton Calculation Interaction
    await page.screenshot({
      path: path.join(screenshotDir, '19_weton_calculation_interaction.png'),
      fullPage: true,
    });

    // Mobile Viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(screenshotDir, '18_weton_page_mobile_dark.png'),
      fullPage: true,
    });
  });

  test('Suite 4: Kalender 3 Sistem Page Walkthrough', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/kalender/');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Screenshot 20: Kalender Page Desktop Dark
    await page.screenshot({
      path: path.join(screenshotDir, '20_kalender_page_desktop_dark.png'),
      fullPage: true,
    });

    // Toggle to Light Mode
    const themeBtn = page.getByRole('button', { name: /Ganti ke tema/i });
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);

    // Screenshot 21: Kalender Page Desktop Light
    await page.screenshot({
      path: path.join(screenshotDir, '21_kalender_page_desktop_light.png'),
      fullPage: true,
    });

    // Return to Dark Mode
    await themeBtn.click();

    // Navigate to next month
    const nextBtn = page.getByRole('button', { name: /Bulan berikutnya/i });
    await nextBtn.click();
    await page.waitForTimeout(300);
    await expect(page.getByRole('heading', { name: /Februari 2027/i })).toBeVisible();

    // Screenshot 23: Kalender Navigation Next Month
    await page.screenshot({
      path: path.join(screenshotDir, '23_kalender_navigation_next_month.png'),
      fullPage: true,
    });

    // Mobile Viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(screenshotDir, '22_kalender_page_mobile_dark.png'),
      fullPage: true,
    });
  });

  test('Suite 5: Glosarium Page Walkthrough', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/glossary/');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Screenshot 24: Glossary Page Desktop Dark
    await page.screenshot({
      path: path.join(screenshotDir, '24_glossary_page_desktop_dark.png'),
      fullPage: true,
    });

    // Toggle to Light Mode
    const themeBtn = page.getByRole('button', { name: /Ganti ke tema/i });
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);

    // Screenshot 25: Glossary Page Desktop Light
    await page.screenshot({
      path: path.join(screenshotDir, '25_glossary_page_desktop_light.png'),
      fullPage: true,
    });

    // Return to Dark Mode & Mobile Viewport
    await themeBtn.click();
    await page.setViewportSize({ width: 390, height: 844 });

    // Screenshot 26: Glossary Page Mobile Dark
    await page.screenshot({
      path: path.join(screenshotDir, '26_glossary_page_mobile_dark.png'),
      fullPage: true,
    });
  });

  test('Suite 6: Prototype Comparison (design-system.html)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const fileUrl = 'file:///' + path.resolve(process.cwd(), 'design-system.html').replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    // Screenshot 27: design-system.html Light Mode
    await page.screenshot({
      path: path.join(screenshotDir, '27_design_system_html_desktop_light.png'),
      fullPage: true,
    });

    // Toggle to Dark Mode in prototype
    const themeToggle = page.locator('#themeToggleBtn');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(400);
      // Screenshot 28: design-system.html Dark Mode
      await page.screenshot({
        path: path.join(screenshotDir, '28_design_system_html_desktop_dark.png'),
        fullPage: true,
      });
    }
  });

  test('Suite 7: Dynamic Form Recalculation End-to-End', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill new couple information
    await page.fill('#groomName', 'Kurniawan');
    await page.fill('#groomBirthDate', '1995-04-12'); // Rabu Legi (neptu 7+5 = 12)
    await page.fill('#brideName', 'Lestari');
    await page.fill('#brideBirthDate', '1997-09-23'); // Selasa Legi (neptu 3+5 = 8)
    await page.selectOption('#weddingYear', '2028');

    // Verify live weton feedback in form
    await expect(page.getByText(/Rabu Legi \(neptu 12\)/i).first()).toBeVisible();
    await expect(page.getByText(/Selasa Legi \(neptu 8\)/i).first()).toBeVisible();

    // Submit form
    await page.getByRole('button', { name: /Cari Rekomendasi Tanggal Baik/i }).click();
    await page.waitForTimeout(400);

    // Verify Couple Profile updated
    await expect(page.getByText(/Kurniawan/i).first()).toBeVisible();
    await expect(page.getByText(/Lestari/i).first()).toBeVisible();
    await expect(page.getByText(/Total Neptu: 20/i)).toBeVisible();

    // Verify Results List year updated to 2028
    await expect(page.getByText(/Rekomendasi Tanggal Akad \(2028\)/i)).toBeVisible();

    // Screenshot 29: Dynamic Form Recalculation Results
    await page.screenshot({
      path: path.join(screenshotDir, '29_dynamic_form_recalculation_results.png'),
      fullPage: true,
    });
  });
});
