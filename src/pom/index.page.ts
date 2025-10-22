import { Locator, Page } from "playwright";

export enum gameStatus {
  PLAYER_X = "Next player: X",
  PLAYER_O = "Next player: O",
  WINNER_X = "Winner: X",
  WINNER_O = "Winner: O",
  DRAW = "It's a draw!",
}

export enum possibleMoves {
  RANDOM = "random",
  DRAW = "DRAW",
  VERTICAL_LEFT = "vertical left",
  VERTICAL_CENTER = "vertical center",
  VERTICAL_RIGHT = "vertical right",
  HORIZONTAL_TOP = "horizontal top",
  HORIZONTAL_CENTER = "horizontal center",
  HORIZONTAL_BOTTOM = "horizontal bottom",
  CROSS_LEFT = "cross left",
  CROSS_RIGHT = "cross right",
}

export class IndexPage {
  public readonly TEXT_GAME_STATUS: Locator;
  public readonly TEXT_GAME_HISTORY: Locator;
  public readonly BUTTON_RESET: Locator;
  public readonly GAME_SQUARES: Locator[];

  constructor(public page: Page) {
    this.TEXT_GAME_STATUS = page.getByTestId("game-status");
    this.TEXT_GAME_HISTORY = page.getByTestId("game-history");
    this.BUTTON_RESET = page.getByTestId("reset-button");
    this.GAME_SQUARES = Array.from({ length: 9 }, (_, i) => page.getByTestId(`square-${i}`));
  }

  public async getGameStatus(): Promise<string> {
    return await this.TEXT_GAME_STATUS.innerText();
  }

  public async gameReset(): Promise<void> {
    await this.BUTTON_RESET.click();
  }

  private validateCellIndex(cellIndex: number): void {
    if (!Number.isInteger(cellIndex) || cellIndex < 1 || cellIndex > this.GAME_SQUARES.length) {
      throw new Error(`Invalid cellIndex: ${cellIndex}. Must be an integer between 1 and ${this.GAME_SQUARES.length}.`);
    }
  }

  public async markCell(cellIndex: number): Promise<void> {
    this.validateCellIndex(cellIndex);
    const cell = this.GAME_SQUARES[cellIndex - 1];
    await cell.click();
  }

  public async simulateGame(
    gameMoves: possibleMoves,
    maxGameMoves: number,
    expectedEndStatus?: gameStatus,
    reverse?: boolean,
  ): Promise<void> {
    const movesMap: Record<possibleMoves, number[]> = {
      [possibleMoves.DRAW]: [1, 2, 3, 6, 9, 5, 8, 7, 4],
      [possibleMoves.VERTICAL_LEFT]: [1, 3, 4, 5, 7],
      [possibleMoves.VERTICAL_CENTER]: [2, 3, 5, 6, 8],
      [possibleMoves.VERTICAL_RIGHT]: [3, 2, 6, 5, 9],
      [possibleMoves.HORIZONTAL_TOP]: [1, 7, 2, 5, 3],
      [possibleMoves.HORIZONTAL_CENTER]: [4, 7, 5, 3, 6],
      [possibleMoves.HORIZONTAL_BOTTOM]: [7, 4, 8, 5, 9],
      [possibleMoves.CROSS_LEFT]: [1, 3, 5, 6, 9],
      [possibleMoves.CROSS_RIGHT]: [3, 2, 5, 6, 7],
      [possibleMoves.RANDOM]: [Math.floor(Math.random() * 9)],
    };

    let movesSequence = movesMap[gameMoves];
    if (maxGameMoves == 0 || maxGameMoves > movesSequence.length) maxGameMoves = movesSequence.length;

    if (reverse) movesSequence.reverse();

    movesSequence = movesSequence.slice(0, maxGameMoves);
    if (expectedEndStatus === gameStatus.WINNER_O) {
      // For WINNER_O, prepend a move to ensure 'Player O' wins; certain patterns require starting with cell 2, others with cell 4.
      const prependMove = [
        possibleMoves.VERTICAL_LEFT,
        possibleMoves.HORIZONTAL_CENTER,
        possibleMoves.HORIZONTAL_BOTTOM,
        possibleMoves.CROSS_LEFT,
      ].includes(gameMoves)
        ? 2
        : 4;
      movesSequence = [prependMove, ...movesSequence];
    }

    for (const move of movesSequence) {
      await this.markCell(move);
    }
  }

  public async getNumberOfCells(value: string): Promise<number> {
    let count: number = 0;

    for (let i = 0; i < this.GAME_SQUARES.length; i++) {
      const cellText = await this.GAME_SQUARES[i].innerText();
      if (cellText.trim() === value) {
        count++;
      }
    }
    return count;
  }

  public async getAllEmptyCells(): Promise<number> {
    let emptyCells: number = 0;

    for (let i = 0; i < this.GAME_SQUARES.length; i++) {
      const cellText = await this.GAME_SQUARES[i].innerText();
      if (cellText.trim() === "") {
        emptyCells++;
      }
    }
    return emptyCells;
  }
  public async getCellValue(cellIndex: number): Promise<string> {
    this.validateCellIndex(cellIndex);
    const cell = this.GAME_SQUARES[cellIndex - 1];
    return await cell.innerText();
  }

  public async getHistoryMove(moveIndex: number): Promise<void> {
    const moveLocator = this.page.locator(`ul[data-testid="history-moves"] li`).nth(moveIndex);
    await moveLocator.click();
  }

  public async getMoveHistoryCounter(): Promise<number> {
    const moveCount: number = await this.page.locator('ul[data-testid="history-moves"] li').count();
    if (!moveCount || moveCount === 0) return 0;
    else return moveCount;
  }
}
