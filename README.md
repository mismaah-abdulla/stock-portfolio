# stock-app

## Installation
- Install dependencies. Required after every clone.

```
npm install
```

- Compile and hot-reloads for development

```
npm run serve
```

## Build for Production

- Lint and fix files

```
npm run lint
```

- Compile and minify for production. Build files go to /dist by default but can be changed by adding outputDir to module.exports in vue.config.js. Refer to [Vue deployment instructions](https://cli.vuejs.org/guide/deployment.html). Before deployment, change the hardcoded fetch/ajax urls to whatever host/port of the production server that the backend is running on.

```
npm run build
```


## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
