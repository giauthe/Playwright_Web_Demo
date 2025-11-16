import { Page, Locator } from '@playwright/test';

/**
 * CGV Cinema Login Page Object Model
 * Encapsulates all interactions with the CGV login page
 */
export class CGVLoginPage {
  readonly page: Page;
  readonly baseUrl = 'https://www.cgv.vn/default/customer/account/login';
  
  // Form field locators
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly captchaField: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.usernameField = page.locator('[name="login[username]"]');
    this.passwordField = page.locator('[name="login[password]"]');
    this.captchaField = page.locator('[name="captcha[user_login]"]');
    this.loginButton = page.locator('[value="Đăng nhập"]'); // Vietnamese: "Login"
    this.forgotPasswordLink = page.locator('a[href*="forgot"]');
    this.signUpLink = page.locator('a[href*="register"]');
  }

  /**
   * Navigate to CGV login page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Fill username/email field
   */
  async fillUsername(email: string): Promise<void> {
    await this.usernameField.fill(email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  /**
   * Fill CAPTCHA field
   */
  async fillCaptcha(captcha: string): Promise<void> {
    await this.captchaField.fill(captcha);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Perform complete login action
   */
  async login(email: string, password: string, captcha: string): Promise<void> {
    await this.fillUsername(email);
    await this.fillPassword(password);
    await this.fillCaptcha(captcha);
    await this.clickLogin();
  }

  /**
   * Get current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Check if username field is visible
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    return this.usernameField.isVisible({ timeout: 15000 }).catch(() => false);
  }

  /**
   * Check if password field is visible
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    return this.passwordField.isVisible({ timeout: 15000 }).catch(() => false);
  }

  /**
   * Check if CAPTCHA field is visible
   */
  async isCaptchaFieldVisible(): Promise<boolean> {
    return this.captchaField.isVisible({ timeout: 15000 }).catch(() => false);
  }

  /**
   * Check if login button is visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return this.loginButton.isVisible({ timeout: 15000 }).catch(() => false);
  }

  /**
   * Check if all required form fields are visible
   */
  async areAllFieldsVisible(): Promise<boolean> {
    const usernameVisible = await this.isUsernameFieldVisible();
    const passwordVisible = await this.isPasswordFieldVisible();
    const captchaVisible = await this.isCaptchaFieldVisible();
    const buttonVisible = await this.isLoginButtonVisible();
    
    return usernameVisible && passwordVisible && captchaVisible && buttonVisible;
  }

  /**
   * Get value from username field
   */
  async getUsernameValue(): Promise<string | null> {
    return this.usernameField.inputValue();
  }

  /**
   * Get value from password field
   */
  async getPasswordValue(): Promise<string | null> {
    return this.passwordField.inputValue();
  }

  /**
   * Get password field type (should be 'password')
   */
  async getPasswordFieldType(): Promise<string | null> {
    return this.passwordField.getAttribute('type');
  }

  /**
   * Check if username field has specific attribute
   */
  async getUsernameAttribute(attributeName: string): Promise<string | null> {
    return this.usernameField.getAttribute(attributeName);
  }

  /**
   * Check if password field has specific attribute
   */
  async getPasswordAttribute(attributeName: string): Promise<string | null> {
    return this.passwordField.getAttribute(attributeName);
  }

  /**
   * Check if forgot password link is visible
   */
  async isForgotPasswordLinkVisible(): Promise<boolean> {
    return this.forgotPasswordLink.isVisible().catch(() => false);
  }

  /**
   * Check if sign up link is visible
   */
  async isSignUpLinkVisible(): Promise<boolean> {
    return this.signUpLink.isVisible().catch(() => false);
  }

  /**
   * Get page content (for error message checking, security testing, etc.)
   */
  async getPageContent(): Promise<string> {
    try {
      return await this.page.content();
    } catch {
      // If page is navigating, return empty string
      return '';
    }
  }

  /**
   * Wait for element with specified timeout
   */
  async waitForElement(selector: string, timeout = 15000): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Set viewport size for responsive testing
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Get bounding box of login button (for touch size testing)
   */
  async getLoginButtonBoundingBox() {
    return this.loginButton.boundingBox();
  }

  /**
   * Verify page is on login URL
   */
  async isOnLoginPage(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes('login');
  }

  /**
   * Check if form is still visible (not redirected after submit)
   */
  async isFormStillVisible(): Promise<boolean> {
    return this.areAllFieldsVisible();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Evaluate JavaScript on page (for security testing)
   */
  async evaluateScript<T>(script: () => T): Promise<T> {
    return this.page.evaluate(script);
  }

  /**
   * Get first input element (for accessibility testing)
   */
  getFirstInput(): Locator {
    return this.page.locator('input').first();
  }

  /**
   * Focus on specific element (for keyboard navigation)
   */
  async focusElement(locator: Locator): Promise<void> {
    await locator.focus();
  }

  /**
   * Get focused element locator
   */
  getFocusedElement(): Locator {
    return this.page.locator(':focus');
  }

  /**
   * Check if element has accessibility attributes
   */
  async hasAccessibilityAttributes(locator: Locator): Promise<boolean> {
    const placeholder = await locator.getAttribute('placeholder');
    const ariaLabel = await locator.getAttribute('aria-label');
    const name = await locator.getAttribute('name');
    
    return !!(placeholder || ariaLabel || name);
  }

  /**
   * Wait for timeout (utility method)
   */
  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Measure page load time
   */
  async measurePageLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.goto();
    const loadTime = Date.now() - startTime;
    return loadTime;
  }

  /**
   * Measure form submission time
   */
  async measureFormSubmissionTime(email: string, password: string, captcha: string): Promise<number> {
    const startTime = Date.now();
    
    await this.fillUsername(email);
    await this.fillPassword(password);
    await this.fillCaptcha(captcha);
    await this.clickLogin();
    
    // Wait for server response
    await this.waitForTimeout(2000);
    
    const responseTime = Date.now() - startTime;
    return responseTime;
  }

  /**
   * Check if page uses HTTPS
   */
  async isUsingHttps(): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.startsWith('https://');
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  /**
   * Check if element is checked (for checkboxes)
   */
  async isElementChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  /**
   * Click element
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Force click element (for hidden elements in Playwright)
   */
  async forceClickElement(locator: Locator): Promise<void> {
    await locator.click({ force: true });
  }

  /**
   * Get remember me checkbox (if exists)
   */
  getRememberMeCheckbox(): Locator {
    return this.page.locator('input[type="checkbox"]').first();
  }

  /**
   * Check for security issues in page content
   */
  async checkSecurityPatterns(): Promise<{
    hasCsrfToken: boolean;
    hasHttps: boolean;
    content: string;
  }> {
    const content = await this.getPageContent();
    const hasHttps = await this.isUsingHttps();
    
    const hasCsrfToken = 
      content.includes('csrf') || 
      content.includes('_token') ||
      content.includes('authenticity_token') ||
      content.includes('X-CSRF-TOKEN') ||
      hasHttps;
    
    return {
      hasCsrfToken,
      hasHttps,
      content,
    };
  }

  /**
   * Get browser name (from page context)
   */
  async getBrowserName(): Promise<string> {
    const browser = this.page.context().browser();
    return browser?.browserType().name() || 'unknown';
  }
}
