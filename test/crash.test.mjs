// Builds the app, serves it, and reproduces each of the three crashes in a
// fresh page. Needs a Chromium: `npx playwright install chromium`.
import { execSync, spawn } from 'node:child_process';
import { chromium } from 'playwright';

const CASES = [
  {
    id: 'swap',
    expect: "Failed to execute 'insertBefore' on 'Node'",
    run: async (page) => {
      await page.click('#swap .simulate');
      await page.click('#next');
    },
  },
  {
    id: 'component',
    expect: "Failed to execute 'insertBefore' on 'Node'",
    run: async (page) => {
      await page.click('#component .simulate');
      await page.click('#mount-alert');
    },
  },
  {
    id: 'intl',
    expect: "Failed to execute 'removeChild' on 'Node'",
    run: async (page) => {
      await page.click('#toggle-compact');
      await page.click('#intl .simulate');
      await page.click('#toggle-compact');
    },
  },
];

execSync('npx vite build', { stdio: 'inherit' });
const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
  stdio: 'ignore',
});
await new Promise((resolve) => setTimeout(resolve, 2500));

let failed = false;
try {
  const browser = await chromium.launch();
  for (const testCase of CASES) {
    const page = await browser.newPage();
    await page.goto('http://localhost:4173/');
    await testCase.run(page);
    const error = await page
      .locator(`#${testCase.id} .error`)
      .textContent({ timeout: 3000 })
      .catch(() => null);
    await page.close();
    if (!error || !error.includes(testCase.expect)) {
      console.error(`[${testCase.id}] expected "${testCase.expect}", got:`, error);
      failed = true;
    } else {
      console.log(`[${testCase.id}] reproduced: ${error}`);
    }
  }
  await browser.close();
} finally {
  server.kill();
}
process.exit(failed ? 1 : 0);
