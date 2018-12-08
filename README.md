# microservices-webpack-plugin

I created this `plugin` to solve problem with repeating packages from `node_modules` in microservices' chunks.
It uses [unpkg](https://unpkg.com) to load npm packages.

## Scenario

You're using microservices with solutions such as [Tailor](https://github.com/zalando/tailor/)
].

You have many microservices which relays on the same version of `react`.

You wonder how to don't load `react` in every chunk.

## Problem

Tailor sends client application to browser via `headers` (more specifically via `Link`). And later it uses `require.js` to execute in browser.
It expects that `react` is inside client application or was loaded earlier.
To solve that you could:

> add required libraries to tailor's template.

> create microservice which should gather common libraries into its chunk.

It's not the best approach because it makes invisible relation between microservices

- write in `react` into `Header.Link`

Your chunk has required dependency `react` and first of all it will try load `react` from tailor's host

## Load once, use multiple times

## TODO
- [ ] automatically add defined libraries to `externals`
- [ ] unit tests
- [ ] npm publish

Inspiration [Webpack CDN Plugin](https://github.com/van-nguyen/webpack-cdn-plugin)
