const fs = require('fs');
const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: false }); // Headless mode OFF
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://www.livescore.com/en/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000); // Give dynamic elements time to render

    // Click the center of the page
    const viewport = page.viewportSize();
    if (viewport) {
      const centerX = viewport.width / 2;
      const centerY = viewport.height / 2;
      await page.mouse.click(centerX, centerY);
      console.log(`Clicked center of page at (${centerX}, ${centerY})`);
    }

    // Optional screenshot for debug
    await page.screenshot({ path: 'debug.png', fullPage: true });

    const matchLinkSelector = 'a[href^="/en/football/"]';
    const apiPathPattern = /\/_next\/data\/([^\/]+)\/en\/football\//;

    async function clickAndWaitForKey() {
      while (true) {
        let keyExtracted = null;

        const [response] = await Promise.all([
          page.waitForResponse(
            (response) => {
              const url = response.url();
              return apiPathPattern.test(url);
            },
            { timeout: 15000 }
          ).catch(() => null),
          page.click(matchLinkSelector).catch((err) => {
            console.error('Click failed:', err.message);
            return null;
          }),
        ]);

        if (response) {
          const match = apiPathPattern.exec(response.url());
          if (match && match[1]) {
            keyExtracted = match[1];
            fs.writeFileSync('key.txt', keyExtracted);
            console.log(`Key extracted and saved: ${keyExtracted}`);
            break;
          }
        }

        console.log('Retrying...');
        await page.waitForTimeout(2000);
      }
    }

    await page.waitForSelector(matchLinkSelector, { timeout: 30000 });
    await clickAndWaitForKey();

  } catch (error) {
    console.error('Script failed:', error.message);
  } finally {
    await browser.close();
  }
})();
