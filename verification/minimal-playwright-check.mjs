import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
await page.goto('http://127.0.0.1:4174/', { waitUntil: 'domcontentloaded', timeout: 15000 });
console.log(await page.title());
console.log(await page.locator('body').evaluate(el => el.innerText.slice(0, 120)));
await browser.close();
