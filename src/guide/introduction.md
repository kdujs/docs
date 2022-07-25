---
footer: false
---

# Introduction

:::info You are reading the documentation for Kdu 3!

- Kdu 2 and related documents are deprecated.
:::

## What is Kdu?

Kdu is a JavaScript framework for building user interfaces. It builds on top of standard HTML, CSS and JavaScript, and provides a declarative and component-based programming model that helps you efficiently develop user interfaces, be it simple or complex.

Here is a minimal example:

```js
import { createApp } from 'kdu'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

```kdu-html
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>
```

**Result**

<script setup>
import { ref } from 'kdu'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>

The above example demonstrates the two core features of Kdu:

- **Declarative Rendering**: Kdu extends standard HTML with a template syntax that allows us to declaratively describe HTML output based on JavaScript state.

- **Reactivity**: Kdu automatically tracks JavaScript state changes and efficiently updates the DOM when changes happen.

:::tip Prerequisites
The rest of the documentation assumes basic familiarity with HTML, CSS and JavaScript. If you are totally new to frontend development, it might not be the best idea to jump right into a framework as your first step - grasp the basics and then come back! Prior experience with other frameworks helps, but is not required.
:::

## The Progressive Framework

Kdu is a framework and ecosystem that covers most of the common features needed in frontend development. But the web is extremely diverse - the things we build on the web may vary drastically in form and scale. With that in mind, Kdu is designed to be flexible and incrementally adoptable. Depending on your use case, Kdu can be used in different ways:

- Enhancing static HTML without a build step
- Embedding as Web Components on any page
- Single-Page Application (SPA)
- Fullstack / Server-Side Rendering (SSR)
- Jamstack / Static Site Generation (SSG)
- Targeting desktop, mobile, WebGL, and even the terminal

If you find these concepts intimidating, don't worry! The tutorial and guide only require basic HTML and JavaScript knowledge, and you should be able to follow along without being an expert in any of these.

If you are an experienced developer interested in how to best integrate Kdu into your stack, or you are curious about what these terms mean, we discuss them in more details in [Ways of Using Kdu](/guide/extras/ways-of-using-kdu).

Despite the flexibility, the core knowledge about how Kdu works is shared across all these use cases. Even if you are just a beginner now, the knowledge gained along the way will stay useful as you grow to tackle more ambitious goals in the future. If you are a veteran, you can pick the optimal way to leverage Kdu based on the problems you are trying to solve, while retaining the same productivity. This is why we call Kdu "The Progressive Framework": it's a framework that can grow with you and adapt to your needs.

## Single-File Components

In most build-tool-enabled Kdu projects, we author Kdu components using an HTML-like file format called **Single-File Component** (also known as `*.kdu` files, abbreviated as **SFC**). A Kdu SFC, as the name suggests, encapsulates the component's logic (JavaScript), template (HTML), and styles (CSS) in a single file. Here's the previous example, written in SFC format:

```kdu
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

SFC is a defining feature of Kdu, and is the recommended way to author Kdu components **if** your use case warrants a build setup. You can learn more about the [how and why of SFC](/guide/scaling-up/sfc) in its dedicated section - but for now, just know that Kdu will handle all the build tools setup for you.

## API Styles

Kdu components can be authored in two different API styles: **Options API** and **Composition API**.

### Options API

With Options API, we define a component's logic using an object of options such as `data`, `methods`, and `mounted`. Properties defined by options are exposed on `this` inside functions, which points to the component instance:

```kdu
<script>
export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  data() {
    return {
      count: 0
    }
  },

  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event listeners in templates.
  methods: {
    increment() {
      this.count++
    }
  },

  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFkd1qwzAMhV9FmF20tHV2XbKysVfYpS/qOmrjNrGNrbQbIe8+JWlS2AaDQDiy9B39tOItBHkpGrEVeTLRBtoph5/BR4ICj7qpCFrlALIMImpD9oqQSBP2wUKTXizHBOB3aqKbFIDxjaMtPI+663/dWrk77dg4pnmXgEpNUDc9dESDdgVQtKcTRmgCu2Dqq2qk0hdpO1lYZyLW6OjRAzDNJjlYr1Z/O1f2iObLVAil95eR3Odj8eAYbsxXKCt/Wuw/SmQvS1ZX41BgEzy1D6dO7peDiXL85dm8SRaEdah4AlYA+aEh8g5eTWXN5UWJeQQldu8Tum3vNl2XZ2MFV+fZjBJrYev+RptaB3lO3vH9hs6ZODwkJeY1KcEH7rUSJVFI2yzjwDlt0tHIGx6kDqGPyMietkaJqd4cor8ljAxXglc3czIOXjFuIroCI8b/uD/Sf7GntYnuG1jn3xg=)

### Composition API

With Composition API, we define a component's logic using imported API functions. In SFCs, Composition API is typically used with [`<script setup>`](/api/sfc-script-setup). The `setup` attribute is a hint that makes Kdu perform compile-time transforms that allow us to use Composition API with less boilerplate. For example, imports and top-level variables / functions declared in `<script setup>` are directly usable in the template.

Here is the same component, with the exact same template, but using Composition API and `<script setup>` instead:

```kdu
<script setup>
import { ref, onMounted } from 'kdu'

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFkUFvwjAMhf+KFU0aE5DujAratPNuO+ZASV0ItE6UuKCp6n+fSwtC22GHHvzi9/nV7tR7CPpUtmql8mSjCwwJuQ0bQ64JPjJ0ELFagKdP3xJjCT1U0TfwLK5nQ4ayTDoKy+6MkLhgNGQ9JQY7GGA9+GevL1Nr1ZK0yjvwoWBo2sEx+qCgEji6/R4jtKEUKRm6GcCRjdgg8ewFOkMw8vW5qFuczw3104TaVWi/bY1w8P4khHv0mTjXm5uZkq9R134/234dUPCOXVFPqV2Cp+5hQK+38ge9fHk27kk2JAVjE2oJKhVAvmuZJembrZ09rY26RzZq8zFxV9B105C+z7PRIvY8u7PUQo3LXzZF0MfkSc5zTS3I60MySjiDMmhyiaE26sAc0irLRDimZaqsvuBOFyEMio4y0zWoMTXLXfSXhFHgRi0eOJmIZ4zLiFRixPgf91f7H/aAlsP0qv8BcUrbuw==)

### Which to Choose?

Both API styles are fully capable of covering common use cases. They are different interfaces powered by the exact same underlying system. In fact, the Options API is implemented on top of the Composition API! The fundamental concepts and knowledge about Kdu are shared across the two styles.

The Options API is centered around the concept of a "component instance" (`this` as seen in the example), which typically aligns better with a class-based mental model for users coming from OOP language backgrounds. It is also more beginner-friendly by abstracting away the reactivity details and enforcing code organization via option groups.

The Composition API is centered around declaring reactive state variables directly in a function scope, and composing state from multiple functions together to handle complexity. It is more free-form, and requires understanding of how reactivity works in Kdu to be used effectively. In return, its flexibility enables more powerful patterns for organizing and reusing logic.

You can learn more about the comparison between the two styles and the potential benefits of Composition API in the [Composition API FAQ](/guide/extras/composition-api-faq).

If you are new to Kdu, here's our general recommendation:

- For learning purposes, go with the style that looks easier to understand to you. Again, most of the core concepts are shared between the two styles. You can always pick up the other style later.

- For production use:

  - Go with Options API if you are not using build tools, or plan to use Kdu primarily in low-complexity scenarios, e.g. progressive enhancement.

  - Go with Composition API + Single-File Components if you plan to build full applications with Kdu.

You don't have to commit to only one style during the learning phase. The rest of the documentation will provide code samples in both styles where applicable, and you can toggle between them at any time using the **API Preference switches** at the top of the left sidebar.

## Still Got Questions?

Check out our [FAQ](/about/faq).

## Pick Your Learning Path

Different developers have different learning styles. Feel free to pick a learning path that suits your preference - although we do recommend going over all of the content, if possible!

<div class="kt-box-container next-steps">
  <a class="kt-box" href="/tutorial/">
    <p class="next-steps-link">Try the Tutorial</p>
    <p class="next-steps-caption">For those who prefer learning things hands-on.</p>
  </a>
  <a class="kt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Read the Guide</p>
    <p class="next-steps-caption">The guide walks you through every aspect of the framework in full detail.</p>
  </a>
  <a class="kt-box" href="/examples/">
    <p class="next-steps-link">Check out the Examples</p>
    <p class="next-steps-caption">Explore examples of core features and common UI tasks.</p>
  </a>
</div>
