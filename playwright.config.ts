import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for contract and smoke tests
 */
export default defineConfig({
  testDir: './tests',
  
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: 'html',
  
  use: {
    baseURL: process.env.API_URL || 'https://api-staging.go2asia.space',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

