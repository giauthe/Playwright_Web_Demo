import { Page, expect } from '@playwright/test';
import { config } from '../test_config/testConfig';
import { delay } from '../test_config/utils';

const selectors = {
    txtErr: '//div[text()="Sai mã bảo mật."]',
    textboxUsername: '[name="login[username]"]',
    textboxPassword: '[name="login[password]"]',
    textboxCapcha: '[name="captcha[user_login]"]',
    btnLogin: '[value="Đăng nhập"]',
    icTwitter: '[class="fab fa-twitter"]'
};

class ProgramPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    };

    async accessProgramsbuzz() {
        const [newTab] = await Promise.all([
            this.page.waitForEvent('worker'),
            this.page.waitForSelector(selectors.icTwitter),
            this.page.click(selectors.icTwitter)
        ]);
        console.log(await this.page.title());
        return newTab;
    };

    async clickSetting() {
        await this.page.click('[aria-label="Cài đặt"]')
    };


}

export default ProgramPage;
