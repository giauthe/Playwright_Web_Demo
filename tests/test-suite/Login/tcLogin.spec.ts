import { BrowserContext, Page, test, expect } from '@playwright/test';
import { config } from '../../test_config/testConfig';
import LoginPage from '../../pageObjects/loginPage';
import { delay } from '../../test_config/utils';



let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;

test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
    context.grantPermissions(['microphone', 'camera']),
    page = await context.newPage();
    loginPage = new LoginPage(page);
    console.log(`Example app listening on port ${process.env.PORT}!`);
});

test.beforeEach(async () =>{
    delay(1000)
});

test.afterAll(async () => {
    await context.close();
});

test('login invalid', async () => {
    await loginPage.login(config.USER, config.PASSWORD);
    await loginPage.verifyLoginInvalid();
})
