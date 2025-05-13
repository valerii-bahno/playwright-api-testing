// import { request, expect } from '@playwright/test';

// async function globalSetup() {
//     const context = await request.newContext();

//     const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
//         data: { 
//           "user": {"email": process.env.LOGIN_USER, "password": process.env.LOGIN_PASSWORD}
//         }
//       });
    
//     const responseBody = await responseToken.json();
//     process.env['ACCESS_TOKEN'] = await responseBody.user.token;

//     const cookieSession = './.auth/userSession.json';

//     await context.storageState({ path: cookieSession });

//     const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
//             data: {
//               "article":{"title":"Global Likes test article","description":"This is a global test description","body":"This is a global body of new article","tagList":[]}
//             },
//             headers: {
//                 Authorization: `Token ${process.env.ACCESS_TOKEN}`
//             }
//           });
        
//     expect(articleResponse.status()).toEqual(201);
    
//     const response = await articleResponse.json();
//     process.env['SLUGID'] = await response.article.slug;
// }

// export default globalSetup;

import { request, expect, FullConfig, chromium } from '@playwright/test';

const authFile = '.auth/userSession.json';

async function globalSetup(config: FullConfig) {
    const contextApi = await request.newContext();

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const responseToken = await contextApi.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { 
          "user": {"email": "testrbvaleriibahno@gmail.com", "password": "Valerii_test123!"}
        }
      });
    
    const responseBody = await responseToken.json();
    process.env['ACCESS_TOKEN'] = responseBody.user.token;

    await page.goto('https://conduit.bondaracademy.com/');
    await page.evaluate((token) => {
      localStorage.setItem('jwtToken', token);
    }, process.env.ACCESS_TOKEN as string);

    await context.storageState({ path: authFile });

    const articleResponse = await contextApi.post('https://conduit-api.bondaracademy.com/api/articles/', {
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