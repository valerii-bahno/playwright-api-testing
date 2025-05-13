import { test as setup } from '@playwright/test';
// import user from '../.auth/userSession.json';
import fs from 'fs';

// const authFile = '.auth/userSession.json';
// const token = process.env.JWT_TOKEN;

setup('authentication', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { 
          // "user": {"email": "testV123456@test.com", "password": "test123!"}
          "user": {"email": process.env.LOGIN_USER, "password": process.env.LOGIN_PASSWORD}
        }
      });
    
    const responseBody = await response.json();
    const accessToken = responseBody.user.token;

    // user.origins[0].localStorage[0].value = accessToken;
    // fs.writeFileSync(authFile, JSON.stringify(user));
    // fs.writeFileSync('.auth/userSession.json', JSON.stringify(user));
    // fs.writeFileSync('.auth/userSession.json', JSON.stringify({
    //   token: responseBody.user.token
    // }));

    process.env['ACCESS_TOKEN'] = accessToken;
});
