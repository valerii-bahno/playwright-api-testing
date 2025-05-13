import { test as setup } from '@playwright/test';
import user from '../.auth/userSession.json';
import fs from 'fs';

const authFile = './.auth/userSession.json';

setup('authentication', async ({ context, request }) => {
    // const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    //     data: { 
    //       "user": {"email": process.env.LOGIN_USER, "password": process.env.LOGIN_PASSWORD}
    //     }
    //   });
    
    // const responseBody = await response.json();

    // // user.origins[0].localStorage[0].value = responseBody.user.token;
    // fs.writeFileSync(authFile, JSON.stringify(user));
    // // fs.writeFileSync(authFile, JSON.stringify({
    // //   // token: responseBody.user.token
    // //   token: user
    // // }));

    // const cookieSession = './.auth/userSession.json';

    // await context.storageState({ path: cookieSession });

    // process.env['ACCESS_TOKEN'] = responseBody.user.token;


    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { 
          "user": {"email": "testV123456@test.com", "password": "test123!"}
        }
      });
    
    const responseBody = await response.json();
    const accessToken = responseBody.user.token;

    user.origins[0].localStorage[0].value = accessToken;
    fs.writeFileSync(authFile, JSON.stringify(user));

    process.env['ACCESS_TOKEN'] = accessToken;
});
