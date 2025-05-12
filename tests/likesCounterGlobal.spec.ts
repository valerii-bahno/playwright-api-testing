import { test, expect } from "playwright/test";

test('Like counter global increase', async({ page }) => {

    await page.goto('https://conduit.bondaracademy.com/');
    await page.waitForSelector('.nav-pills');
    await page.getByText('Global Feed').click();
    const firstLikeButton = page.locator('app-article-preview').first().locator('button');

    await firstLikeButton.click();

    await page.waitForTimeout(2000);

    expect(firstLikeButton).toContainText('1');
    await page.waitForTimeout(2000);
});