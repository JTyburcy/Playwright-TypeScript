import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

// localEnv indicating default environment.
const localEnv = "local";
let environment: string;

// Overriding the environment configuration
process.env.testEnv
  ? (environment = `./src/setup/env/.env.${process.env.testEnv}`)
  : (environment = `./src/setup/env/.env.${localEnv}`);
dotenv.config({ path: environment, override: true });

export default defineConfig({
  testDir: "./src/tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 3,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 16,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 1000,
    headless: true,
    browserName: "chromium",
    testIdAttribute: process.env.DATA_TEST_ID,
    video: "retain-on-failure",
    baseURL: `${process.env.BASE_URL}`,
    viewport: {
      width: 1920,
      height: 1080,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
