import { Page } from "playwright/test";

export async function goToPage(page: Page): Promise<void> {
  await page.goto(`${process.env.BASE_URL}`);
  await waitForPageToBeLoad(page);
}

export async function waitForPageToBeLoad(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load");
  await page.waitForLoadState("networkidle");
}

export function randomNumberGenerator(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
