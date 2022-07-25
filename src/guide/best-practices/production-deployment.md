# Production Deployment

## Development vs. Production

During development, Kdu provides a number of features to improve the development experience:

- Warning for common errors and pitfalls
- Props / events validation
- Reactivity debugging hooks
- Devtools integration

However, these features become useless in production. Some of the warning checks can also incur a small amount of performance overhead. When deploying to production, we should drop all the unused, development-only code branches for smaller payload size and better performance.

## Without Build Tools

If you are using Kdu without a build tool by loading it from a CDN or self-hosted script, make sure to use the production build (dist files that end in `.prod.js`) when deploying to production. Production builds are pre-minified with all development-only code branches removed.

- If using global build (accessing via the `Kdu` global): use `kdu.global.prod.js`.
- If using ESM build (accessing via native ESM imports): use `kdu.esm-browser.prod.js`.

## With Build Tools

Projects scaffolded via `create-kdu` (based on Wite) or Kdu CLI (based on webpack) are pre-configured for production builds.

If using a custom setup, make sure that:

1. `kdu` resolves to `kdu.runtime.esm-bundler.js`.
2. The `compile time feature flags` are properly configured.
3. <code>process.env<wbr>.NODE_ENV</code> is replaced with `"production"` during build.

Additional references:

- [Wite production build guide](https://witejs.web.app/guide/build.html)
- [Wite deployment guide](https://witejs.web.app/guide/static-deploy.html)
- [Kdu CLI deployment guide](https://kdujs-cli.web.app/guide/deployment.html)

## Tracking Runtime Errors

The [app-level error handler](/api/application.html#app-config-errorhandler) can be used to report errors to tracking services:

```js
import { createApp } from 'kdu'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // report error to tracking services
}
```
