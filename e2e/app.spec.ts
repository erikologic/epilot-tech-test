import { test, expect } from "@playwright/test";

test("the app", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Bitcoin Guesser/);

  // The player can at all times see their current score
  // New players start with a score of 0
  await expect(
    page.getByRole("status", { name: "Score" }).getByText("0")
  ).toBeVisible();

  // The player can at all times see the latest available BTC price in USD
  // The player can choose to enter a guess of either “up” or “down“
  // Players can only make one guess at a time
  // After a guess is entered the player cannot make new guesses until the existing guess is resolved
  // The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
  // If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
});
