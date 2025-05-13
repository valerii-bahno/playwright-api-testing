import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  });

  await page.goto('https://conduit.bondaracademy.com/');
});

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = "This is a MOCK test title";
    responseBody.articles[0].description = "This is a MOCK description";

    await route.fulfill({
      body: JSON.stringify(responseBody)
    });
  });
  await page.waitForTimeout(1000);

  await page.getByText('Global Feed').click();

  await page.waitForTimeout(1000);
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title');
  await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description');
});

test('Delete article via UI', async ({ page, request }) => {
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"New title","description":"New description","body":"New article was published","tagList":[]}
    }
  });

  expect(articleResponse.status()).toEqual(201);

  await page.getByText('Global Feed').click();
  await page.getByText('New title').click();
  await page.getByRole('button', {name: 'Delete Article'}).first().click();
  await page.getByText('Global Feed').click();

  await expect(page.locator('app-article-list h1').first()).not.toContainText('New title');
  await expect(page.locator('app-article-list p').first()).not.toContainText('New description');
});

test('Create and delete article via API', async({ request }) => {
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"Playwright is awesome","description":"About the Playwright","body":"We like to use playwright for automation","tagList":[]}
    }
  });

  const articleResponseBody = await articleResponse.json();

  expect(articleResponse.status()).toEqual(201);
  expect(articleResponseBody.article.title).toEqual("Playwright is awesome");
  expect(articleResponseBody.article.description).toEqual("About the Playwright");

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleResponseBody.article.slug}`);

  expect(deleteArticleResponse.status()).toEqual(204);
});
