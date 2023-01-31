import { Page, expect } from '@playwright/test';
import { config } from '../test_config/testConfig';
import { delay } from '../test_config/utils';

const selectors = {
  txtErr: '//div[text()="Sai mã bảo mật."]',
  textboxUsername: '[name="login[username]"]',
  textboxPassword: '[name="login[password]"]',
  textboxCapcha: '[name="captcha[user_login]"]',
  btnLogin: '[value="Đăng nhập"]'
};

class LoginPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  };

  async login(user: any, password: any) {
    await this.page.goto(config.URL);
    await this.page.fill(selectors.textboxUsername, user);
    await this.page.fill(selectors.textboxPassword, password);
    await this.page.fill(selectors.textboxCapcha, '123');
    await this.page.waitForSelector(selectors.btnLogin);
    await this.page.click(selectors.btnLogin);
  };

  async verifyLoginSuccess() {
    await this.page.locator(selectors.txtErr).isVisible
  };

  async verifyLoginInvalid() {
    await expect(this.page.locator(selectors.txtErr)).toBeVisible()
  };

}

export default LoginPage;
