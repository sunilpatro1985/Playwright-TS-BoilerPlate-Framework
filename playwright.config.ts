import { getDynamicBaseUrl, testConfig } from './testConfig';
import { defineConfig, devices } from '@playwright/test';

const BROWSER = process.env.BROWSER?.trim();

// Support single or multiple browsers (comma-separated), default to 'chrome'
const selectedBrowsers = (BROWSER && BROWSER.length > 0 ? BROWSER : 'chrome')
  .toLowerCase()
  .split(',')
  .map(b => b.trim())
  .filter(b => b.length > 0);


//const envName = ENV as keyof typeof testConfig;

const sharedUse = {
  baseURL: getDynamicBaseUrl(),
  actionTimeout: 10000,
  headless: true,
  viewport: { width: 1500, height: 730 },
  ignoreHTTPSErrors: true,
  acceptDownloads: true,
  screenshot: `only-on-failure` as const,
  video: `retain-on-failure` as const,
  trace: `retain-on-failure` as const,
  launchOptions: {
    slowMo: 0
  }
};

const browserProjects = [
  {
    name: 'Chrome',
    use: {
      browserName: 'chromium' as const,
      channel: 'chrome' as const,
      headless: false
    }
  },
  {
    name: 'Chromium',
    use: {
      browserName: 'chromium' as const,
    }
  },
  {
    name: 'Firefox',
    use: {
      browserName: 'firefox' as const,
    }
  },
  {
    name: 'Edge',
    use: {
      browserName: 'chromium' as const,
      channel: 'msedge' as const,
      headless: false,
    }
  },
  {
    name: 'WebKit',
    use: {
      browserName: 'webkit' as const,
    }
  },
  {
    name: 'Device',
    use: {
      ...devices['Pixel 4a (5G)'],
      browserName: 'chromium' as const,
      channel: 'chrome' as const,
    }
  },
  {
      name: `DB`,
      use: {
        //Any specific parameters for DB can be added here
      }
    },
    {
      name: `API`,
      use: {
        //any specific parameters for API can be added here
      }
    }
];

const filteredProjects = browserProjects.filter((project) => {
  return selectedBrowsers.includes(project.name.toLowerCase());
});

//const config: PlaywrightTestConfig = {
export default defineConfig({

  //Global Setup to run before all tests
  globalSetup: `./global-setup`,

  //Global Teardown to run after all tests
  globalTeardown: `./global-teardown`,

  //sets timeout for each test case
  timeout: 120000,

  //number of retries if test case fails
  retries: 0,

  //Reporters
  reporter: [[`./CustomReporterConfig.ts`], [`allure-playwright`], [`html`, { outputFolder: 'html-report', open: 'never' }]],
  use: {
    ...sharedUse
  },

  projects: [
    ...filteredProjects
  ],
});
//export default config;