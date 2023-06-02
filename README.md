## Library Development

`npm run build`

`npm pack --dry-run`

`npm link`
`npm link jwt-auth-mongodb`

### Test locally

At library

```
rm -rf dist
npm run build
npm pack
```

At project using library

```
npm i ../jwt-auth-mongodb/jwt-auth-mongodb-1.0.6.tgz
rm -rf node_modules/.cache
npm start
```
