import { test as setup } from '@playwright/test';

setup('authentication', async ({ request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { 
          "user": {"email": process.env.LOGIN_USER, "password": process.env.LOGIN_PASSWORD}
        }
      });
    
    const responseBody = await response.json();
    process.env['ACCESS_TOKEN'] = responseBody.user.token;
});
