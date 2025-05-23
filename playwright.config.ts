import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  timeout: 1 * 60 * 1000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: 'retain-on-failure',
    screenshot: 'on-first-failure',
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Authorization': `Token ${process.env.ACCESS_TOKEN}`
    }
  },
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),

  projects: [
    {
      name: 'setup', testMatch: 'auth.setup.ts'
    },
    {
      name: 'articleSetup',
      testMatch: 'newArticle.setup.ts',
      dependencies: ['setup'],
      teardown: 'articleCleanUp'
    },
    {
      name: 'articleCleanUp',
      testMatch: 'articleCleanUp.setup.ts'
    },
    {
      name: 'regression',
      testIgnore: 'likesCounter.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/userSession.json'  },
      dependencies: ['setup']
    },
    {
      name: 'likesCounter',
      testMatch: 'likesCounter.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/userSession.json' },
      dependencies: ['articleSetup']
    },
    {
      name: 'likesCounterGlobal',
      testMatch: 'likesCounterGlobal.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/userSession.json' },
    }
  ]
});
