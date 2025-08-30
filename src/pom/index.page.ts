import { Locator } from "playwright";
import { start } from "repl";

export class IndexPage {
  readonly TEXT_GAME_STATUS: Locator;
  readonly TEXT_GAME_HISTORY: Locator;
  readonly LIST_HISTORY: Locator[];
  readonly BUTTON_RESET: Locator;
  readonly GAME_SQUARE_1: Locator;
  readonly GAME_SQUARE_2: Locator;
  readonly GAME_SQUARE_3: Locator;
  readonly GAME_SQUARE_4: Locator;
  readonly GAME_SQUARE_5: Locator;
  readonly GAME_SQUARE_6: Locator;
  readonly GAME_SQUARE_7: Locator;
  readonly GAME_SQUARE_8: Locator;
  readonly GAME_SQUARE_9: Locator;

  constructor(public page) {
    this.TEXT_GAME_STATUS = page.locator("#game-status");
    this.TEXT_GAME_HISTORY = page.locator("#game-history");
    this.BUTTON_RESET = page.locator("#reset-button");
    this.GAME_SQUARE_1 = page.locator("#game-square-1");
    this.GAME_SQUARE_2 = page.locator("#game-square-2");
    this.GAME_SQUARE_3 = page.locator("#game-square-3");
    this.GAME_SQUARE_4 = page.locator("#game-square-4");
    this.GAME_SQUARE_5 = page.locator("#game-square-5");
    this.GAME_SQUARE_6 = page.locator("#game-square-6");
    this.GAME_SQUARE_7 = page.locator("#game-square-7");
    this.GAME_SQUARE_8 = page.locator("#game-square-8");
    this.GAME_SQUARE_9 = page.locator("#game-square-9");
  }
}
