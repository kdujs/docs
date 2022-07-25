# SFC Syntax Specification

## Overview

A Kdu Single-File Component (SFC), conventionally using the `*.kdu` file extension, is a custom file format that uses an HTML-like syntax to describe a Kdu component. A Kdu SFC is syntactically compatible with HTML.

Each `*.kdu` file consists of three types of top-level language blocks: `<template>`, `<script>`, and `<style>`, and optionally additional custom blocks:

```kdu
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  This could be e.g. documentation for the component.
</custom1>
```

## Language Blocks

### `<template>`

- Each `*.kdu` file can contain at most one top-level `<template>` block at a time.

- Contents will be extracted and passed on to `@kdujs/compiler-dom`, pre-compiled into JavaScript render functions, and attached to the exported component as its `render` option.

### `<script>`

- Each `*.kdu` file can contain at most one `<script>` block at a time (excluding [`<script setup>`](/api/sfc-script-setup.html)).

- The script is executed as an ES Module.

- The **default export** should be a Kdu component options object, either as a plain object or as the return value of [defineComponent](/api/general.html#definecomponent).

### `<script setup>`

- Each `*.kdu` file can contain at most one `<script setup>` block at a time (excluding normal `<script>`).

- The script is pre-processed and used as the component's `setup()` function, which means it will be executed **for each instance of the component**. Top-level bindings in `<script setup>` are automatically exposed to the template. For more details, see [dedicated documentation on `<script setup>`](/api/sfc-script-setup).

### `<style>`

- A single `*.kdu` file can contain multiple `<style>` tags.

- A `<style>` tag can have `scoped` or `module` attributes (see [SFC Style Features](/api/sfc-css-features) for more details) to help encapsulate the styles to the current component. Multiple `<style>` tags with different encapsulation modes can be mixed in the same component.

### Custom Blocks

Additional custom blocks can be included in a `*.kdu` file for any project-specific needs, for example a `<docs>` block.

Handling of Custom Blocks will depend on tooling - if you want to build your own custom block integrations, see [relevant tooling section](/guide/scaling-up/tooling.html#sfc-custom-block-integrations) for more details.

## Automatic Name Inference

An SFC automatically infers the component's name from its **filename** in the following cases:

- Dev warning formatting
- DevTools inspection
- Recursive self-reference. E.g. a file named `FooBar.kdu` can refer to itself as `<FooBar/>` in its template. This has lower priority than explicitly registered/imported components.

## Pre-Processors

Blocks can declare pre-processor languages using the `lang` attribute. The most common case is using TypeScript for the `<script>` block:

```kdu-html
<script lang="ts">
  // use TypeScript
</script>
```

`lang` can be applied to any block - for example we can use `<style>` with [SASS](https://sass-lang.com/) and `<template>` with [Pug](https://pugjs.org/api/getting-started.html):

```kdu-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

Note that integration with various pre-processors may differ by toolchain. Check out the respective documentation for examples:

- [Wite](https://witejs.web.app/guide/features.html#css-pre-processors)
- [Kdu CLI](https://kdujs-cli.web.app/guide/css.html#pre-processors)
- [webpack + kdu-loader](https://kdujs-loader.web.app/guide/pre-processors.html#using-pre-processors)

## Src Imports

If you prefer splitting up your `*.kdu` components into multiple files, you can use the `src` attribute to import an external file for a language block:

```kdu
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Beware that `src` imports follow the same path resolution rules as webpack module requests, which means:

- Relative paths need to start with `./`
- You can import resources from npm dependencies:

```kdu
<!-- import a file from the installed "todomvc-app-css" npm package -->
<style src="todomvc-app-css/index.css" />
```

`src` imports also work with custom blocks, e.g.:

```kdu
<unit-test src="./unit-test.js">
</unit-test>
```

## Comments

Inside each block you shall use the comment syntax of the language being used (HTML, CSS, JavaScript, Pug, etc.). For top-level comments, use HTML comment syntax: `<!-- comment contents here -->`
