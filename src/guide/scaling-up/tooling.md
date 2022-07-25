# Tooling

## Try It Online

You don't need to install anything on your machine to try out Kdu SFCs - there are online playgrounds that allow you to do so right in the browser:

- [Kdu SFC Playground](https://kdujs-sfc.web.app)
  - Always deployed from latest commit
  - Designed for inspecting component compilation results

It is also recommended to use these online playgrounds to provide reproductions when reporting bugs.

## Project Scaffolding

### Wite

[Wite](https://witejs.web.app/) is a lightweight and fast build tool with first-class Kdu SFC support. It is created by NKDuy, who is also the author of Kdu!

To get started with Wite + Kdu, simply run:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--kt-c-blue);">$</span> <span style="color:#A6ACCD;">npm init kdu@latest</span></span></code></pre></div>

This command will install and execute `create-kdu`, the official Kdu project scaffolding tool.

- To learn more about Wite, check out the [Wite docs](https://witejs.web.app).
- To configure Kdu-specific behavior in a Wite project, for example passing options to the Kdu compiler, check out the docs for `@witejs/plugin-kdu`.

Both online playgrounds mentioned above also support downloading files as a Wite project.

### Kdu CLI

[Kdu CLI](https://kdujs-cli.web.app/) is the official webpack-based toolchain for Kdu. It is now in maintenance mode and we recommend starting new projects with Wite unless you rely on specific webpack-only features. Wite will provide superior developer experience in most cases.

### Note on In-Browser Template Compilation

When using Kdu without a build step, component templates are written either directly in the page's HTML or as inlined JavaScript strings. In such cases, Kdu needs to ship the template compiler to the browser in order to perform on-the-fly template compilation. On the other hand, the compiler would be unnecessary if we pre-compile the templates with a build step. To reduce client bundle size, Kdu provides [different "builds"](https://unpkg.com/browse/kdu@3/dist/) optimized for different use cases.

- Build files that start with `kdu.runtime.*` are **runtime-only builds**: they do not include the compiler. When using these builds, all templates must be pre-compiled via a build step.

- Build files that do not include `.runtime` are **full builds**: they include the compiler and support compiling templates directly in the browser. However, they will increase the payload by ~14kb.

Our default tooling setups use the runtime-only build since all templates in SFCs are pre-compiled. If, for some reason, you need in-browser template compilation even with a build step, you can do so by configuring the build tool to alias `kdu` to `kdu/dist/kdu.esm-bundler.js` instead.

If you are looking for a lighter-weight alternative for no-build-step usage, check out [petite-kdu](https://github.com/kdujs/petite-kdu).

## IDE Support

- The recommended IDE setup is [VSCode](https://code.visualstudio.com/) + the [Kocan](https://marketplace.visualstudio.com/items?itemName=Kdu-Code.kocan) extension. Kocan provides syntax highlighting, TypeScript support, and intellisense for template expressions and component props.

## TypeScript

Main article: [Using Kdu with TypeScript](/guide/typescript/overview).

- `Kocan` provides type checking for SFCs using `<script lang="ts">` blocks, including template expressions and cross-component props validation.

- Use `kdu-tsc` for performing the same type checking from the command line, or for generating `d.ts` files for SFCs.

## Linting

The Kdu team maintains `eslint-plugin-kdu`, an [ESLint](https://eslint.org/) plugin that supports SFC-specific linting rules.

Users previously using Kdu CLI may be used to having linters configured via webpack loaders. However when using a Wite-based build setup, our general recommendation is:

1. `npm install -D eslint eslint-plugin-kdu`, then follow `eslint-plugin-kdu`'s [configuration guide](https://kdujs-eslint.web.app/user-guide/#usage).

2. Setup ESLint IDE extensions, for example [ESLint for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), so you get linter feedback right in your editor during development. This also avoids unnecessary linting cost when starting the dev server.

3. Run ESLint as part of the production build command, so you get full linter feedback before shipping to production.

4. (Optional) Setup tools like [lint-staged](https://github.com/okonet/lint-staged) to automatically lint modified files on git commit.

## Formatting

- The [Kocan](https://marketplace.visualstudio.com/items?itemName=Kdu-Code.kocan) VSCode extension provides formatting for Kdu SFCs out of the box.

- Alternatively, [Prettier](https://prettier.io/) provides built-in Kdu SFC formatting support.

## SFC Custom Block Integrations

Custom blocks are compiled into imports to the same Kdu file with different request queries. It is up to the underlying build tool to handle these import requests.

- If using Wite, a custom Wite plugin should be used to transform matched custom blocks into executable JavaScript.

- If using Kdu CLI or plain webpack, a webpack loader should be configured to transform the matched blocks.

## Lower-Level Packages

### `@kdujs/compiler-sfc`

This package is part of the Kdu core monorepo and is always published with the same version as the main `kdu` package. It is included as a dependency of the main `kdu` package and proxied under `kdu/compiler-sfc` so you don't need to install it individually.

The package itself provides lower-level utilities for processing Kdu SFCs and is only meant for tooling authors that need to support Kdu SFCs in custom tools.

:::tip
Always prefer using this package via the `kdu/compiler-sfc` deep import since this ensures its version is in sync with the Kdu runtime.
:::

### `@witejs/plugin-kdu`

Official plugin that provides Kdu SFC support in Wite.

### `kdu-loader`

- [Docs](https://kdujs--loader.web.app/)

The official loader that provides Kdu SFC support in webpack. If you are using Kdu CLI, also see [docs on modifying `kdu-loader` options in Kdu CLI](https://kdujs-cli.web.app/guide/webpack.html#modifying-options-of-a-loader).

<!-- TODO ## Other Online Playgrounds -->

<!-- TODO ## Backend Framework Integrations -->
