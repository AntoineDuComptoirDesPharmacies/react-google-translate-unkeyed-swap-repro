// Builds the app, serves it, simulates Google Translate, clicks "next" and
// expects the NotFoundError. Needs a Chromium: `npx playwright install chromium`.
import { spawn } from 'node:child_process';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright';

execSync('npx vite build', { stdio: 'inherit' });
const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
  stdio: 'ignore',
});
await new Promise((resolve) => setTimeout(resolve, 2500));

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/');
  await page.click('#simulate');
  await page.click('#next');
  const error = await page.locator('#error').textContent({ timeout: 3000 });
  await browser.close();
  if (!error.includes("Failed to execute 'insertBefore' on 'Node'")) {
    console.error('Unexpected error text:', error);
    process.exit(1);
  }
  console.log('Reproduced:', error);
} finally {
  server.kill();
}
