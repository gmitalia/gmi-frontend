const { chromium } = require('playwright');

async function testPage(url, viewport, label) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message);
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Check for horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = viewport.width;
    const hasHorizontalOverflow = bodyWidth > viewportWidth;

    // Check for hydration errors (React specific)
    const hydrationErrors = await page.evaluate(() => {
      const errors = [];
      // Check for React hydration mismatch markers
      const nodes = document.querySelectorAll('[data-reactroot], [data-reactid]');
      return errors;
    });

    console.log(`\n=== ${label} (${viewportWidth}px) ===`);
    console.log(`URL: ${url}`);
    console.log(`Body width: ${bodyWidth}px`);
    console.log(`Horizontal overflow: ${hasHorizontalOverflow ? 'YES ❌' : 'NO ✓'}`);
    console.log(`Console errors: ${errors.length}`);
    console.log(`Console warnings: ${warnings.length}`);

    if (errors.length > 0) {
      console.log('ERRORS:');
      errors.forEach(e => console.log(`  - ${e}`));
    }

    if (warnings.length > 0) {
      console.log('WARNINGS (first 5):');
      warnings.slice(0, 5).forEach(w => console.log(`  - ${w}`));
    }

    await browser.close();
    return { hasHorizontalOverflow, errors, warnings };
  } catch (e) {
    console.log(`\n=== ${label} (${viewportWidth}px) ===`);
    console.log(`ERROR loading page: ${e.message}`);
    await browser.close();
    return { hasHorizontalOverflow: true, errors: [e.message], warnings: [] };
  }
}

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  const pages = [
    '/',
    '/competizioni/',
    '/competizioni/contest/?contest=1000',
    '/competizioni/results/?contest=1000',
    '/competizioni/user/?user=15',
    '/competizioni/premi/',
    '/competizioni/rules/',
    '/competizioni/search/',
    '/competizioni/users/',
    '/blog/',
    '/blog/articoli/',
    '/tutorial/',
  ];

  const viewports = [
    { width: 375, height: 667, label: 'Mobile' },
    { width: 1280, height: 720, label: 'Desktop' },
  ];

  let allPassed = true;

  for (const pagePath of pages) {
    for (const viewport of viewports) {
      const result = await testPage(`${baseUrl}${pagePath}`, viewport, `${pagePath} - ${viewport.label}`);
      if (result.hasHorizontalOverflow || result.errors.length > 0) {
        allPassed = false;
      }
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(allPassed ? 'All tests passed! ✓' : 'Some tests failed! ❌');
  process.exit(allPassed ? 0 : 1);
}

runTests().catch(console.error);