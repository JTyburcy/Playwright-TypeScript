import { Locator, Page } from "playwright";
import { start } from "repl";

export enum gameStatus {
  PLAYER_X = "Next player: X",
  PLAYER_O = "Next player: O",
  WINNER_X = "Winner: X",
  WINNER_O = "Winner: O",
  DRAW = "It's a draw!",
}

export class IndexPage {
  public readonly TEXT_GAME_STATUS: Locator;
  public readonly TEXT_GAME_HISTORY: Locator;
  public readonly LIST_HISTORY: Locator[];
  public readonly BUTTON_RESET: Locator;
  public readonly GAME_SQUARE_1: Locator;
  public readonly GAME_SQUARE_2: Locator;
  public readonly GAME_SQUARE_3: Locator;
  public readonly GAME_SQUARE_4: Locator;
  public readonly GAME_SQUARE_5: Locator;
  public readonly GAME_SQUARE_6: Locator;
  public readonly GAME_SQUARE_7: Locator;
  public readonly GAME_SQUARE_8: Locator;
  public readonly GAME_SQUARE_9: Locator;

  constructor(public page: Page) {
    this.TEXT_GAME_STATUS = page.getByTestId("game-status");
    this.TEXT_GAME_HISTORY = page.getByTestId("game-history");
    this.BUTTON_RESET = page.getByTestId("reset-button");
    this.GAME_SQUARE_1 = page.getByTestId("square-0");
    this.GAME_SQUARE_2 = page.getByTestId("square-1");
    this.GAME_SQUARE_3 = page.getByTestId("square-2");
    this.GAME_SQUARE_4 = page.getByTestId("square-3");
    this.GAME_SQUARE_5 = page.getByTestId("square-4");
    this.GAME_SQUARE_6 = page.getByTestId("square-5");
    this.GAME_SQUARE_7 = page.getByTestId("square-6");
    this.GAME_SQUARE_8 = page.getByTestId("square-7");
    this.GAME_SQUARE_9 = page.getByTestId("square-8");
  }

  public async getGameStatus(): Promise<string> {
    return await this.TEXT_GAME_STATUS.innerText();
  }

  public async gameReset(): Promise<void> {
    await this.BUTTON_RESET.click();
  }

  public async markCell(cellIndex: number): Promise<void> {
    const cell = this[`GAME_SQUARE_${cellIndex}`];
    await cell.click();
  }

  public async simulateGame(): Promise<void> {}

  public async getCellValue(cellIndex: number): Promise<string> {
    const cell = this[`GAME_SQUARE_${cellIndex}`];
    return await cell.innerText();
  }
}
