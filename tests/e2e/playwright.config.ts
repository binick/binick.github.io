import { PlaywrightTestConfig, devices, ViewportSize } from '@playwright/test';

const desktopViewPorts: ViewportSize[] = [
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 }
]

const config: PlaywrightTestConfig = {
  timeout: 30000,
  use: {
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'Desktop Chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'Desktop Safari',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
      }
    },
    {
      name: 'Desktop Firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
      }
    },
    {
      name: 'Desktop Firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
      }
    },
    {
      name: 'Mobile Chrome',
      use: devices['Pixel 5'],
    },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 12'],
    },
  ],
};



export default config;
