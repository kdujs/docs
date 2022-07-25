---
outline: deep
---

# Using Kdu with TypeScript

A type system like TypeScript can detect many common errors via static analysis at build time. This reduces the chance of runtime errors in production, and also allows us to more confidently refactor code in large-scale applications. TypeScript also improves developer ergonomics via type-based auto-completion in IDEs.

Kdu is written in TypeScript itself and provides first-class TypeScript support. All official Kdu packages come with bundled type declarations that should work out-of-the-box.

## Project Setup

`create-kdu`, the official project scaffolding tool, offers the options to scaffold a [Wite](https://witejs.web.app/)-powered, TypeScript-ready Kdu project.

### Overview

With a Wite-based setup, the dev server and the bundler are transpilation-only and do not perform any type-checking. This ensures the Wite dev server stays blazing fast even when using TypeScript.

- During development, we recommend relying on a good [IDE setup](#ide-support) for instant feedback on type errors.

- If using SFCs, use the `kdu-tsc` utility for command line type checking and type declaration generation. `kdu-tsc` is a wrapper around `tsc`, TypeScript's own command line interface. It works largely the same as `tsc` except that it supports Kdu SFCs in addition to TypeScript files. You can run `kdu-tsc` in watch mode in parallel to the Wite dev server.

- Kdu CLI also provides TypeScript support, but is no longer recommended. See [notes below](#note-on-kdu-cli-and-ts-loader).

### IDE Support

- [Visual Studio Code](https://code.visualstudio.com/) (VSCode) is strongly recommended for its great out-of-the-box support for TypeScript.

  - [Kocan](https://marketplace.visualstudio.com/items?itemName=Kdu-Code.kocan) is the official VSCode extension that provides TypeScript support inside Kdu SFCs, along with many other great features.

  - [TypeScript Kdu Plugin](https://marketplace.visualstudio.com/items?itemName=Kdu-Code.vscode-typescript-kdu-plugin) is also needed to get type support for `*.kdu` imports in TS files.

### Configuring `tsconfig.json`

Projects scaffolded via `create-kdu` include pre-configured `tsconfig.json`. The base config is abstracted in the [`@kdujs/tsconfig`](https://github.com/kdujs/tsconfig) package. Inside the project, we use [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) to ensure correct types for code running in different environments (e.g. app vs. test).

When configuring `tsconfig.json` manually, some notable options include:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) is set to `true` because Wite uses [esbuild](https://esbuild.github.io/) for transpiling TypeScript and is subject to single-file transpile limitations.

- If you're using Options API, you need to set [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) to `true` (or at least enable [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), which is a part of the `strict` flag) to leverage type checking of `this` in component options. Otherwise `this` will be treated as `any`.

- If you have configured resolver aliases in your build tool, for example the `@/*` alias configured by default in a `create-kdu` project, you need to also configure it for TypeScript via [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

See also:

- [Official TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript compilation caveats](https://esbuild.github.io/content-types/#typescript-caveats)

### Takeover Mode

> This section only applies for VSCode + Kocan.

To get Kdu SFCs and TypeScript working together, Kocan creates a separate TS language service instance patched with Kdu-specific support, and uses it in Kdu SFCs. At the same time, plain TS files are still handled by VSCode's built-in TS language service, which is why we need [TypeScript Kdu Plugin](https://marketplace.visualstudio.com/items?itemName=Kdu-Code.vscode-typescript-kdu-plugin) to support Kdu SFC imports in TS files. This default setup works, but for each project we are running two TS language service instances: one from Kocan, one from VSCode's built-in service. This is a bit inefficient and can lead to performance issues in large projects.

Kocan provides a feature called "Takeover Mode" to improve performance. In takeover mode, Kocan provides support for both Kdu and TS files using a single TS language service instance.

To enable Takeover Mode, you need to disable VSCode's built-in TS language service in **your project's workspace only** by following these steps:

1. In your project workspace, bring up the command palette with `Ctrl + Shift + P` (macOS: `Cmd + Shift + P`).
2. Type `built` and select "Extensions: Show Built-in Extensions".
3. Type `typescript` in the extension search box (do not remove `@builtin` prefix).
4. Click the little gear icon of "TypeScript and JavaScript Language Features", and select "Disable (Workspace)".
5. Reload the workspace. Takeover mode will be enabled when you open a Kdu or TS file.

<img src="./images/takeover-mode.png" width="590" height="426" style="margin:0px auto;border-radius:8px">

### Note on Kdu CLI and `ts-loader`

In webpack-based setups such as Kdu CLI, it is common to perform type checking as part of the module transform pipeline, for example with `ts-loader`. This, however, isn't a clean solution because the type system needs knowledge of the entire module graph to perform type checks. Individual module's transform step simply is not the right place for the task. It leads to the following problems:

- `ts-loader` can only type check post-transform code. This doesn't align with the errors we see in IDEs or from `kdu-tsc`, which map directly back to the source code.

- Type checking can be slow. When it is performed in the same thread / process with code transformations, it significantly affects the build speed of the entire application.

- We already have type checking running right in our IDE in a separate process, so the cost of dev experience slow down simply isn't a good trade-off.

If you are currently using Kdu 3 + TypeScript via Kdu CLI, we strongly recommend migrating over to Wite. We are also working on CLI options to enable transpile-only TS support, so that you can switch to `kdu-tsc` for type checking.

## General Usage Notes

### `defineComponent()`

To let TypeScript properly infer types inside component options, we need to define components with [`defineComponent()`](/api/general.html#definecomponent):

```ts
import { defineComponent } from 'kdu'

export default defineComponent({
  // type inference enabled
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // type: string | undefined
    this.msg // type: string
    this.count // type: number
  }
})
```

`defineComponent()` also supports inferring the props passed to `setup()` when using Composition API without `<script setup>`:

```ts
import { defineComponent } from 'kdu'

export default defineComponent({
  // type inference enabled
  props: {
    message: String
  },
  setup(props) {
    props.message // type: string | undefined
  }
})
```

See also:

- [Note on webpack Treeshaking](/api/general.html#note-on-webpack-treeshaking)

:::tip
`defineComponent()` also enables type inference for components defined in plain JavaScript.
:::

### Usage in Single-File Components

To use TypeScript in SFCs, add the `lang="ts"` attribute to `<script>` tags. When `lang="ts"` is present, all template expressions also enjoy stricter type checking.

```kdu
<script lang="ts">
import { defineComponent } from 'kdu'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- type checking and auto-completion enabled -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` can also be used with `<script setup>`:

```kdu
<script setup lang="ts">
// TypeScript enabled
import { ref } from 'kdu'

const count = ref(1)
</script>

<template>
  <!-- type checking and auto-completion enabled -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript in Templates

The `<template>` also supports TypeScript in binding expressions when `<script lang="ts">` or `<script setup lang="ts">` is used. This is useful in cases where you need to perform type casting in template expressions.

Here's a contrived example:

```kdu
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- error because x could be a string -->
  {{ x.toFixed(2) }}
</template>
```

This can be worked around with an inline type cast:

```kdu{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
If using Kdu CLI or a webpack-based setup, TypeScript in template expressions requires `kdu-loader@^16.8.0 or later`.
:::

## API-Specific Recipes

- [TS with Composition API](./composition-api)
- [TS with Options API](./options-api)
