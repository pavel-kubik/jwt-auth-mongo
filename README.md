# How to use library

## FE

```
import AuthForm from 'jwt-auth-mongodb/dist/fe/component/AuthForm';

<AuthForm //
  loggedUser={loggedUser}
  setLoggedUser={setLoggedUser}
  preSignIn={initBECall}
  preSignUp={initBECall}
  postSignIn={syncAttempts}
  postSignUp={syncAttempts}
  t={t}
/>
```

## BE

### Auth endpoints

`/netlify/functions/sign_in`
`/netlify/functions/sign_in_salt`
`/netlify/functions/sign_up`

### Secured call.

```
import { Handler } from '@netlify/functions';
import { validateJWT } from 'jwt-auth-mongodb';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 404 };
  }

  const response = await validateJWT(event, async (userData) => {
    return {
      code: 200,
      body: {
        username: userData.username
      }
    };
  });
  return response;
};
```

## MongoDB

You have to specify configuration of MongoDB from environmental variables.

It can be put in `.env` in project using this library. Configuration is automatically use with `netlify dev` command.

```
MONGODB_DATABASE=<dbname>
MONGODB_URI=mongodb://localhost:27017
TOKEN_KEY=123456789
```

# Library Development

## Test locally with npm link

With npm link. Note: Current project structure don't allow to use it.

Run `npm link` at library.
Run `npm link jwt-auth-mongodb` at target project.
It creates filesystem link to directory in `node_modules`.

## Test locally with gzip dependency

### At library

```
rm -rf dist
npm run build
npm pack
```

Test pack content with `npm pack --dry-run`.

### At project using library

```
npm i ../jwt-auth-mongodb/jwt-auth-mongodb-1.0.6.tgz
rm -rf node_modules/.cache
npm start
```
