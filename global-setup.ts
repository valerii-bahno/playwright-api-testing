import { request, expect } from '@playwright/test';

async function globalSetup() {
    const context = await request.newContext();

    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { 
          "user": {"email": process.env.LOGIN_USER, "password": process.env.LOGIN_PASSWORD}
        }
      });
    
    const responseBody = await responseToken.json();
    const accessToken = responseBody.user.token;
    process.env['ACCESS_TOKEN'] = accessToken;

    const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
            data: {
              "article":{"title":"Global Likes test article","description":"This is a global test description","body":"This is a global body of new article","tagList":[]}
            },
            headers: {
                Authorization: `Token ${process.env.ACCESS_TOKEN}`
            }
          });
        
    expect(articleResponse.status()).toEqual(201);
    
    const response = await articleResponse.json();
    process.env['SLUGID'] = response.article.slug;
}

export default globalSetup;