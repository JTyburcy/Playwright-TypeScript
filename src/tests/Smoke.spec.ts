import { expect, Page } from "playwright/test";
import { test } from "../utils/fixtures";
import { goToPage } from "../utils/commonActions";
import { gameStatus, IndexPage, possibleMoves } from "../pom/index.page";

async function movmentSimulation(
  index: IndexPage,
  possibleMoves: possibleMoves,
  expectedEndStatus: gameStatus,
  revers?: boolean,
): Promise<void> {
  const expectMessage = `The status message should display ${expectedEndStatus} ${expectedEndStatus === gameStatus.DRAW ? "message." : "victory message."}`;
  let testStepMessage: string = `Simulate ${possibleMoves} ${revers ? "reverse " : ""}sequence resulting in ${expectedEndStatus.replace("Winner: ", "player ")} ${expectedEndStatus === gameStatus.DRAW ? "." : "victory."}`;

  await test.step(testStepMessage, async () => {
    await index.gameReset();
    await index.simulateGame(possibleMoves, expectedEndStatus, revers);
    expect.soft(await index.getGameStatus(), expectMessage).toContain(expectedEndStatus);
  });
}

test.describe(`[SMOKE] Game functionality @Smoke @Game`, () => {
  test(`[TICKET_ID] Game should accurately display current player's turn, indicating either X or O @Game`, async ({
    page,
    indexPage,
  }) => {
    // Open the game page
    await goToPage(page);
    await test.step(`Verify that the game status displays the correct message for the first player (X).`, async () => {
      expect
        .soft(await indexPage.getGameStatus(), `The status message should display "${gameStatus.PLAYER_X}"`)
        .toContain(gameStatus.PLAYER_X);
    });

    await test.step(`Simulate a move by player X and verify the game status updates to indicate it's player O's turn.`, async () => {
      await indexPage.markCell(1);
      expect
        .soft(await indexPage.getGameStatus(), `The status message should display "${gameStatus.PLAYER_O}"`)
        .toContain(gameStatus.PLAYER_O);
    });
  });

  test(`[TICKET_ID] Game should correctly identify and announce the winner when a player X achieves three marks in a row (horizontally, vertically, or diagonally) @Game`, async ({
    page,
    indexPage,
  }) => {
    await goToPage(page);
    const winner: gameStatus = gameStatus.WINNER_X;

    await movmentSimulation(indexPage, possibleMoves.CROSS_LEFT, winner);
    await movmentSimulation(indexPage, possibleMoves.CROSS_RIGHT, winner);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_LEFT, winner);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_CENTER, winner);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_RIGHT, winner);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_TOP, winner);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_CENTER, winner);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_BOTTOM, winner);
  });

  test(`[TICKET_ID] Game should correctly identify and announce the winner when a player O achieves three marks in a row (horizontally, vertically, or diagonally) @Game`, async ({
    page,
    indexPage,
  }) => {
    await goToPage(page);
    const winner: gameStatus = gameStatus.WINNER_O;

    await movmentSimulation(indexPage, possibleMoves.CROSS_LEFT, winner);
    await movmentSimulation(indexPage, possibleMoves.CROSS_RIGHT, winner);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_LEFT, winner);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_CENTER, winner);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_RIGHT, winner);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_TOP, winner);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_CENTER, winner);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_BOTTOM, winner);
  });

  test(`[TICKET_ID] Game should correctly identify and announce the winner when a player X achieves three marks in a row revers (horizontally, vertically, or diagonally) @Game`, async ({
    page,
    indexPage,
  }) => {
    await goToPage(page);
    const winner: gameStatus = gameStatus.WINNER_X;

    await movmentSimulation(indexPage, possibleMoves.CROSS_LEFT, winner, true);
    await movmentSimulation(indexPage, possibleMoves.CROSS_RIGHT, winner, true);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_LEFT, winner, true);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_CENTER, winner, true);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_RIGHT, winner, true);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_TOP, winner, true);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_CENTER, winner, true);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_BOTTOM, winner, true);
  });

  test(`[TICKET_ID] Game should correctly identify and announce the winner when a player O achieves three marks in a row revers (horizontally, vertically, or diagonally) @Game`, async ({
    page,
    indexPage,
  }) => {
    await goToPage(page);
    const winner: gameStatus = gameStatus.WINNER_O;

    await movmentSimulation(indexPage, possibleMoves.CROSS_LEFT, winner, true);
    await movmentSimulation(indexPage, possibleMoves.CROSS_RIGHT, winner, true);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_LEFT, winner, true);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_CENTER, winner, true);
    await movmentSimulation(indexPage, possibleMoves.VERTICAL_RIGHT, winner, true);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_TOP, winner, true);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_CENTER, winner, true);
    await movmentSimulation(indexPage, possibleMoves.HORIZONTAL_BOTTOM, winner, true);
  });

  test(`[TICKET_ID] Game should allow players to restart the game after it ends @Game`, async ({ page, indexPage }) => {
    await goToPage(page);
    const winner = Math.random() < 0.5 ? gameStatus.WINNER_X : gameStatus.WINNER_O;
    const revers: boolean = Math.random() < 0.5;
    const playerMovment = Object.keys(possibleMoves)
      .filter((key) => key !== "RANDOM")
      .map((key) => possibleMoves[key as keyof typeof possibleMoves]);
    const movment: possibleMoves = playerMovment[Math.floor(Math.random() * playerMovment.length)];

    await movmentSimulation(indexPage, movment, winner, revers);
    const moveBeforeReset: number = await indexPage.getMoveHistoryCounter();

    await indexPage.gameReset();
    const moveAfterReset: number = await indexPage.getMoveHistoryCounter();
    await test.step(`Verify that the game status displays the correct message for the first player (X) after reset.`, async () => {
      expect
        .soft(
          await indexPage.getGameStatus(),
          `The status message should display "${gameStatus.PLAYER_X}" after reset.`,
        )
        .toContain(gameStatus.PLAYER_X);
    });

    await test.step(`Verify that History was cleared after clicking reset button`, async () => {
      expect.soft(moveAfterReset, `The game history should be cleared after clicking the reset button.`).toBe(1);
      expect
        .soft(moveBeforeReset, `The move history after reset should be less than before reset.`)
        .toBeGreaterThan(moveAfterReset);
    });
  });

  test(`[TICKET_ID] Game should display a draw message when the game ends in a draw @Game`, async ({
    page,
    indexPage,
  }) => {
    await goToPage(page);
    await movmentSimulation(indexPage, possibleMoves.DRAW, gameStatus.DRAW);
  });

  /* 
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
