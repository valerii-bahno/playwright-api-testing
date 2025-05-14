import { test, expect } from '@playwright/test';

test('Create, read, update and delete article via API', async({ request }) => {
  // Create new article
  const articleResponseCreate = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"Playwright is awesome","description":"About the Playwright","body":"We like to use playwright for automation","tagList":[]}
    }
  });

  const articleResponseCreateBody = await articleResponseCreate.json();

  expect(articleResponseCreate.status()).toEqual(201);
  expect(articleResponseCreateBody.article.title).toEqual("Playwright is awesome");
  expect(articleResponseCreateBody.article.description).toEqual("About the Playwright");

  // Get created article
  const articleResponseRead = await request.get(`https://conduit-api.bondaracademy.com/api/articles/${articleResponseCreateBody.article.slug}`);

  const articleResponseGetBody = await articleResponseRead.json();

  expect(articleResponseRead.status()).toEqual(200);
  expect(articleResponseGetBody.article.title).toEqual("Playwright is awesome");
  expect(articleResponseGetBody.article.description).toEqual("About the Playwright");

  // Update created article
  const articleResponseUpdate = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleResponseCreateBody.article.slug}`, {
    data: {
      "article":{"title":"Playwright is awesome","description":"About the Playwright","body":"Article is about using playwright for automation","tagList":["API"]}
    }
  });

  const articleResponseUpdateBody = await articleResponseUpdate.json();
  expect(articleResponseUpdate.status()).toEqual(200);
  expect(articleResponseUpdateBody.article.body).toEqual("Article is about using playwright for automation");
  expect(articleResponseUpdateBody.article.tagList).toContain("API");

  // Delete created article
  const articleResponseDelete = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleResponseCreateBody.article.slug}`);

  expect(articleResponseDelete.status()).toEqual(204);
});