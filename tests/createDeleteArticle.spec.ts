import { test, expect } from '@playwright/test';

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