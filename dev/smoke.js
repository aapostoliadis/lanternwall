// Smoke test: serves the folder, plays a few seconds of Lanternwall in headless Chromium and fails on any page error.
// Also checks that mute survives a reload and that phone layouts give the board the room.
// Usage: npm install && npx playwright install chromium && node dev/smoke.js
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');

const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.png': 'image/png', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const fail = msg => { throw new Error(msg); };

// Clicks a point given in the game's own 1000x620 coordinates.
async function tap(page, x, y) {
  const r = await page.locator('canvas').boundingBox();
  await page.mouse.click(r.x + x * r.width / 1000, r.y + y * r.height / 620);
}

async function play(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.waitForTimeout(500);
  await tap(page, 500, 450);                  // Light the garden
  await page.keyboard.press('1');              // firefly lantern
  await tap(page, 170 + 44, 118 + 96 * 2 + 48); // first tile of the middle lane
  await page.keyboard.press('f');              // 2x speed
  await page.waitForTimeout(3000);
  await page.keyboard.press('m');
  if (await page.evaluate(() => localStorage.getItem('lanternwall.muted')) !== '1') fail('M did not save mute');
  await page.reload();
  await page.waitForTimeout(300);
  if (await page.evaluate(() => localStorage.getItem('lanternwall.muted')) !== '1') fail('mute did not survive a reload');
  if (errors.length) fail('page errors:\n' + errors.join('\n'));
  await page.close();
  console.log('desktop: played 3s at 2x, no page errors, mute persists');
}

async function phone(browser, url, device, check) {
  const ctx = await browser.newContext(devices[device]);
  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    const vis = s => getComputedStyle(document.querySelector(s)).display !== 'none';
    const r = document.querySelector('canvas').getBoundingClientRect();
    return { rotate: vis('.rotate'), keys: vis('.keys'), tile: 88 * r.width / 1000,
             overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  check(info);
  if (info.overflow) fail(device + ': page scrolls sideways');
  await ctx.close();
  console.log(`${device}: tile ${info.tile.toFixed(0)}px, rotate hint ${info.rotate ? 'shown' : 'hidden'}, key hint ${info.keys ? 'shown' : 'hidden'}`);
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/lanternwall.html`;
  const browser = await chromium.launch();
  try {
    await play(browser, url);
    await phone(browser, url, 'iPhone 13', i => { if (!i.rotate) fail('portrait phone: no rotate hint'); });
    await phone(browser, url, 'iPhone 13 landscape', i => {
      if (i.rotate || i.keys) fail('landscape phone: hints should be hidden');
      if (i.tile < 44) fail(`landscape phone: tiles are ${i.tile.toFixed(0)}px, under 44px`);
    });
    console.log('smoke OK');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(e => { console.error(e.message); process.exit(1); });
