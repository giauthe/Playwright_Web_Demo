import { devices, PlaywrightTestConfig } from '@playwright/test';

const xrayOptions = {
  // Whether to add <properties> with all annotations; default is false
  embedAnnotationsAsProperties: true,

  // By default, annotation is reported as <property name='' value=''>.
  // These annotations are reported as <property name=''>value</property>.
  textContentAnnotations: ['test_description'],

  // This will create a "testrun_evidence" property that contains all attachments. Each attachment is added as an inner <item> element.
  // Disables [[ATTACHMENT|path]] in the <system-out>.
  embedAttachmentsAsProperty: 'testrun_evidence',

  // Where to put the report.
  outputDir: 'test-results/',
  outputFile: 'test-results/xray-report.xml'
};

const config: PlaywrightTestConfig = {
  // retries: 1,
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined, //Global timeout for the whole test run:
  workers: process.env.CI ? 0 : 1,
  timeout: 5 * 6 * 1000, // timeout test
  expect: {
    timeout: 15000,  //Default timeout for async expect matchers in milliseconds, defaults to 5000ms./Timeout for each assertion:
  },
  // fullyParallel: true,
  use: {
    headless: true,
    acceptDownloads: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1366, height: 768 },
    ignoreHTTPSErrors: true,
    // launchOptions: {
    //     args: ['--use-fake-device-for-media-stream'],
    //     firefoxUserPrefs: {
    //         // use fake audio and video media
    //         "media.navigator.streams.fake": true,
    //         "permissions.default.microphone": 1,
    //         "permissions.default.camera": 1,
    //     },
    // },
    navigationTimeout: 30000,   //Timeout for each navigation action in milliseconds. 
    actionTimeout: 15000   //Default timeout for each Playwright action in milliseconds, ( page.setDefaultTimeout(timeout).)
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Desktop Chromium',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'Desktop Safari',
      use: {
        browserName: 'webkit',
      }
    },
    {
      name: 'Desktop Firefox',
      use: {
        browserName: 'firefox',
      }
    },
  ],
  reporter: [
    ['html'],
    ['line'],
    ['allure-playwright'],
    ['junit', xrayOptions]
  ],

};

export default config;

