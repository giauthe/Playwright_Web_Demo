import { BrowserContext, Page, test, expect } from '@playwright/test';
import { config } from '../../test_config/testConfig';
import ProgramPage from '../../pageObjects/programPage';
import { delay } from '../../test_config/utils';



let context: BrowserContext;
let page: Page;
let programPage: ProgramPage;

test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
    // context.grantPermissions(['microphone', 'camera']),
    page = await context.newPage();
    programPage = new ProgramPage(page);
    console.log(`Example app listening on port ${process.env.PORT}!`);
});

test.beforeEach(async () =>{
    delay(1000)
});

test.afterAll(async () => {
    await context.close();
});

test('open newtab', async () => {
    await page.goto('https://www.programsbuzz.com/');
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        await page.click('[class="fab fa-twitter"]')
    ])
    console.log(await page.url());
    console.log(await newPage.url())
    await newPage.waitForTimeout(2000) 
    await newPage.click('[aria-label="Settings"]')
    const allPages = context.pages();
    await newPage.waitForTimeout(3000) 
    page.bringToFront()
    await page.waitForLoadState()
    await page.click('[class="fas fa-search"]')
    await page.locator('[class="form-search"]').waitFor({state:'visible'})
    await page.fill('[class="form-search"]','test')
    await newPage.waitForTimeout(2000) 
})



