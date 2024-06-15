import { test, expect } from "@playwright/test";

const setBitcoin = (payload: any) =>
  fetch("http://localhost:9000/bitcoin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

test("the app", async ({ page }) => {
  // WHEN a new player visits the site
  await page.goto("/");

  // THEN they can see the website
  await expect(page).toHaveTitle(/Bitcoin Guesser/);

  // AND their score will be 0
  await expect(
    page.getByRole("status", { name: "Score" }).getByText("0")
  ).toBeVisible();

  // AND they can see the current BTC price
  await setBitcoin({ data: { rateUsd: "100000" }, timestamp: null });
  await expect(
    page.getByRole("status", { name: "Price" }).getByText("100000")
  ).toBeVisible();

  // AND the player can make a guess if the price will go up or down
  await expect(page.getByRole("button", { name: "up" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "down" })).toBeEnabled();

  // GIVEN the price updates
  await setBitcoin({ data: { rateUsd: "99" } });

  // THEN they can see the current BTC price
  await expect(
    page.getByRole("status", { name: "Price" }).getByText("99")
  ).toBeVisible();

  // GIVEN the player makes a guess
  await page.getByRole("button", { name: "up" }).click();

  // THEN the player cannot make a new guess
  await expect(page.getByRole("button", { name: "up" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "down" })).not.toBeVisible();

  // AND they will be told the guess that they made
  await expect(page.getByRole("status", { name: "Guess" }).getByText("up")).toBeVisible();

  // TODO separate the timestamp from the rate
  // WHEN 60 seconds have passed since the guess was made
  // AND the price went up
  await setBitcoin({
    data: { rateUsd: "1000" },
    timestamp: Date.now() + 61_000,
  });

  // THEN the player can make a new guess
  await expect(page.getByRole("button", { name: "up" })).toBeVisible();

  // AND their score will be 1
  await expect(
    page.getByRole("status", { name: "Score" }).getByText("1")
  ).toBeVisible();

  // If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
});
