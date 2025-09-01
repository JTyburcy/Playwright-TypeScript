import { test as baseTest } from "@playwright/test";
import { IndexPage } from "../pom/index.page";

type pages = {
  indexPage: IndexPage;
};

export const test = baseTest.extend<pages>({
  indexPage: async ({ page }, use) => {
    await use(new IndexPage(page));
  },
});

export const expect = test.expect;
