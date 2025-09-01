import { expect, Page } from "playwright/test";
import { test } from "../utils/fixtures";
import { goToPage } from "../utils/commonActions";
import { gameStatus } from "../pom/index.page";

test.describe(`[SMOKE] Game functionality @Smoke @Game`, () => {
  test(`[TICKET_ID] Game should accurately display current player's turn, indicating either X or O @Game`, async ({
    page,
    indexPage,
  }) => {
    // Open the game page
    await goToPage(page);
    await test.step(`Verify that the game status displays the correct message for the first player (X).`, async () => {
      expect
        .soft(
          await indexPage.getGameStatus(),
          `The status message should display "${gameStatus.PLAYER_X}"`,
        )
        .toContain(gameStatus.PLAYER_X);
    });

    await test.step(`Simulate a move by player X and verify the game status updates to indicate it's player O's turn.`, async () => {
      await indexPage.markCell(1);
      expect
        .soft(
          await indexPage.getGameStatus(),
          `The status message should display "${gameStatus.PLAYER_O}"`,
        )
        .toContain(gameStatus.PLAYER_O);
    });
  });

  test(`[TICKET_ID] Game should correctly identify and announce the winner when a player achieves three marks in a row (horizontally, vertically, or diagonally) @Game`, () => {});

  /* test(`[TICKET_ID] Game should allow players to restart the game after it ends @Game`, () => {});
    test(`[TICKET_ID] Game should display a draw message when the game ends in a draw @Game`, () => {});


    test(`[TICKET_ID] Game should reset the board after a player wins or the game ends in a draw @Game`, () => {});
    test(`[TICKET_ID] Game should display an error message when a player tries to make a move in an already occupied cell @Game`, () => {});
    test(`[TICKET_ID] Game should allow players to make a move only if it's their turn @Game`, () => {});
    test(`[TICKET_ID] Game should not allow players to make a move after the game has ended @Game`, () => {});
*/
});

/*
test.describe(`[SMOKE] Game functionality @Smoke @Application`, () => {});
*/
