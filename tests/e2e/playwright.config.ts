import { PlaywrightTestConfig, devices } from '@playwright/test';
import { baseURL } from './global.setup';

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global.setup'),
  use: {
    baseURL: baseURL.href,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'Desktop Chromium (1080p)',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Desktop Safari (1080p)',
      use: {
        browserName: 'webkit',
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'Desktop Firefox (1080p)',
      use: {
        browserName: 'firefox',
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'Desktop Chromium (720p)',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'Desktop Safari (720p)',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Desktop Firefox (720p)',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Mobile Chrome',
      use: devices['Pixel 5'],
    },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 12'],
    }
  ]
};
export default config;
