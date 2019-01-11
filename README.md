# microservices-webpack-plugin

This `plugin` solves problem with repeating packages from `node_modules` in microservices' chunks.
It uses [unpkg](https://unpkg.com) to load npm packages.

## Installation

`npm install -D microservices-webpack-plugin`

Let's try with `react`.
Modify your microservice's `webpack.config`:
- `output.libraryTarget` must be `amd`
- add to `plugins`
```
new MicroservicesWebpackPlugin([
  { name: 'react', path: `umd/react.production.min.js` },
])
```


## Scenario

You're using microservices with solutions such as [Tailor](https://github.com/zalando/tailor/).

You have many microservices which relays on the same version of `some node_modules dependency`.

You wonder how to don't load `some node_modules dependency` in every chunk.

## Problem

Tailor sends client application to browser via `headers` (more specifically via `Link`). And later it uses `require.js` to execute in browser.
It expects that `some node_modules dependency` is inside client application or was loaded earlier.
To solve that you could:

> add required libraries to tailor's template.

> create microservice which should gather common libraries into its chunk.

It's not the best approach because it makes invisible relation between microservices

- write in `some node_modules dependency` into `Header.Link`

Your chunk has required dependency `some node_modules dependency` and first of all it will try load `some node_modules dependency` from tailor's host

Inspiration [Webpack CDN Plugin](https://github.com/van-nguyen/webpack-cdn-plugin)
