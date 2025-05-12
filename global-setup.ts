import { request, expect } from '@playwright/test';
import user from '../playwright-api-testing/.auth/userSession.json';
import fs from 'fs';

const authFile = '.auth/userSession.json';

async function globalSetup() {
    const context = await request.newContext();

    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { 
          "user": {"email": "testrbvaleriibahno@gmail.com", "password": "Valerii_test123!"}
        }
      });
    
    const responseBody = await responseToken.json();
    const accessToken = responseBody.user.token;

    user.origins[0].localStorage[0].value = accessToken;
    fs.writeFileSync(authFile, JSON.stringify(user));

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
    const slugId = response.article.slug;
    process.env['SLUGID'] = slugId;
}

export default globalSetup;