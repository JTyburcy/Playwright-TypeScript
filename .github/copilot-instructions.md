<!--
  Purpose: Project-specific instructions for AI coding agents (compact, actionable).
  Keep this file to ~20-50 lines. Reference concrete files and patterns only.
-->

# Playwright-TypeScript — AI assistance hints

This project is a Playwright test suite (TypeScript) for a small web game. Use these instructions to be immediately productive and to make small, safe edits.

Key files and where to look

- Tests: `src/tests/*` (test files use `@playwright/test`). Example: `src/tests/Smoke.spec.ts` shows test structure and conventions.
- Page objects: `src/pom/index.page.ts` — encapsulates UI locators, helpers (e.g., `simulateGame`, `markCell`). Prefer edits here for UI behavior.
- Fixtures: `src/utils/fixtures.ts` — custom test.extend usage that injects page objects (see `indexPage`).
- Utilities: `src/utils/commonActions.ts` — navigation and helper utilities (e.g., `goToPage`, `waitForPageToBeLoad`).
- Config: `playwright.config.ts` — environment loading (dotenv) and per-browser projects. Tests run from `./src/tests`.
- Env files: `src/setup/env/.env.*` — different environments are selected via `process.env.testEnv`.

Development & run notes

- Use `npx playwright test` (Project uses `@playwright/test` v1.55). Tests default to headless and use `process.env.BASE_URL` from env files.
- Local environment: `process.env.testEnv` falls back to `local` (see `playwright.config.ts`); update env files to change baseURL or testId attributes.
- Playwright HTML report: configured as the reporter and output appears under `playwright-report/`.

Project conventions and patterns

- Page Object Model: All UI interactions live in `src/pom/*`. Tests should call page object methods (e.g., `indexPage.simulateGame(...)`) rather than direct locator interactions.
- Test composition: `src/utils/fixtures.ts` extends Playwright's test with typed page objects. When adding new pages, extend this fixture file to expose them to tests.
- Test ids: Locators use `data-testid` via `page.getByTestId(...)` in `IndexPage` — prefer adding or referencing `data-testid` attributes when modifying selectors.
- Randomization: Movement patterns and randomness live in `IndexPage` and tests call them; avoid nondeterministic tests unless wrapped for reproducibility.

What to change here (safe, high-value edits)

- Small UI fixes: update `src/pom/index.page.ts` for selector robustness and add validation for inputs (there's already `validateCellIndex`).
- New tests: put under `src/tests`, use the `test` exported from `src/utils/fixtures.ts` to get typed page objects.
- Environment changes: update `src/setup/env/.env.*` and ensure `playwright.config.ts` picks it up via `testEnv`.

Quick examples

- Navigate in tests:
  - Use `await goToPage(page)` (from `src/utils/commonActions.ts`) instead of `page.goto(...)` to ensure consistent load waits.
- Add a new page object:
  - Create `src/pom/your.page.ts`, expose it via `src/utils/fixtures.ts`, then use it in tests: `async ({ page, yourPage }) => { ... }`.

Edge cases and gotchas

- `process.env.DATA_TEST_ID` may be undefined — `playwright.config.ts` reads it; prefer referencing `data-testid` values already in `IndexPage`.
- Tests sometimes rely on random sequences (`possibleMoves.RANDOM`) — if adding CI tests, avoid RANDOM or seed it.

If you need more context

- Open `src/tests/Smoke.spec.ts` and `src/pom/index.page.ts` first — they contain the canonical examples used across this suite.
- If unsure about a change's impact on reporting or CI, check `playwright.config.ts` and the `.env` files in `src/setup/env/`.

If anything above is unclear or you'd like the file extended with CI steps, test commands, or examples for adding pages/tests, tell me what to add.
