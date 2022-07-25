# State Management

## What is State Management?

Technically, every Kdu component instance already "manages" its own reactive state. Take a simple counter component as an example:

<div class="composition-api">

```kdu
<script setup>
import { ref } from 'kdu'

// state
const count = ref(0)

// actions
function increment() {
  count.value++
}
</script>

<!-- view -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```kdu
<script>
export default {
  // state
  data() {
    return {
      count: 0
    }
  },
  // actions
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- view -->
<template>{{ count }}</template>
```

</div>

It is a self-contained unit with the following parts:

- The **state**, the source of truth that drives our app;
- The **view**, a declarative mapping of the **state**;
- The **actions**, the possible ways the state could change in reaction to user inputs from the **view**.

This is a simple representation of the concept of "one-way data flow":

<p style="text-align: center">
  <img alt="state flow diagram" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

However, the simplicity starts to break down when we have **multiple components that share a common state**:

1. Multiple views may depend on the same piece of state.
2. Actions from different views may need to mutate the same piece of state.

For case one, a possible workaround is by "lifting" the shared state up to a common ancestor component, and then pass it down as props. However, this quickly gets tedious in component trees with deep hierarchies, leading to another problem known as [Prop Drilling](/guide/components/provide-inject.html#prop-drilling).

For case two, we often find ourselves resorting to solutions such as reaching for direct parent / child instances via template refs, or trying to mutate and synchronize multiple copies of the state via emitted events. Both of these patterns are brittle and quickly lead to unmaintainable code.

A simpler and more straightforward solution is to extract the shared state out of the components, and manage it in a global singleton. With this, our component tree becomes a big "view", and any component can access the state or trigger actions, no matter where they are in the tree!

## Simple State Management with Reactivity API

<div class="options-api">

In Options API, reactive data is declared using the `data()` option. Internally, the object returned by `data()` is made reactive via the [`reactive()`](/api/reactivity-core.html#reactive) function, which is also available as a public API.

</div>

If you have a piece of state that should be shared by multiple instances, you can use [`reactive()`](/api/reactivity-core.html#reactive) to create a reactive object, and then import it from multiple components:

```js
// store.js
import { reactive } from 'kdu'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```kdu
<!-- ComponentA.kdu -->
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```

```kdu
<!-- ComponentB.kdu -->
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```kdu
<!-- ComponentA.kdu -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```kdu
<!-- ComponentB.kdu -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

</div>

Now whenever the `store` object is mutated, both `<ComponentA>` and `<ComponentB>` will update their views automatically - we have a single source of truth now.

However, this also means any component importing `store` can mutate it however they want:

```kdu-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

While this works in simple cases, global state that can be arbitrarily mutated by any component is not going to be very maintainable in the long run. To ensure the state-mutating logic is centralized like the state itself, it is recommended to define methods on the store with names that express the intention of the actions:

```js{6-8}
// store.js
import { reactive } from 'kdu'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```kdu-html{2}
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNrNUs1uAiEQfhXCRY0KPW/Wpm6TPgWXFTGiLhCY1SZm370DrKtb0/TQS0/LfDt8P8Nc6do5dty2tKBlkF47IEFB616F0Y2zHsi7xa9RBtZk521DJozfoXh18txaPbdWfWvJswwKYAGqcacaFFaElA9S/BtSJaTkwwW6oFl12dSOHYI1GOEaL4n+RxC0IAmJGKrHWtA9gAsF5wgcwjLsJLuoDaudiwjzrQHdKKZCs9x4ewnKI7mgkaYTpkPZcfqfB3clAaxXpBuGkWqk+2UMW31OBzxuWgBryJs8aXlcCZoZtJFeNehgOhO0byXkI6qsMXIvzKTFMKRD24mLZ7KswbPIeKDjx/pnyaq/JLv5w0xDBq9qCfp8j5EXVBj1mTqkNQGjp6SroXuaNioZKMjLIhYPpm/7Bnsdssv5/LY6M9p9AYJ1LXY=)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNrdk89uwjAMxl/FygUQ0OxclWl00p4il5IGEaBJlLgwCfXd5zZt+XuYtNukSo2/OvbnX5oLWzuXHMqapSwL0muH78LoylmP8GnpbZTBNWy9rWCS8KvUbpo8p+bPqXmfCiCM+u7SS7Ut6iPCpVXlkBjSKMBN58WDkLdxIww9GR8NU4CqcscCFUUA2Y11/qDknZLxcQNbsDjFsipcsg/WEIzOiOg/BMFGa4LRNG0s2A7RhZRzEvZhGbYyOatNUjjXKomvDepKJSpUy42356A8FRdsGIDa3tN8dQQXCGi9gmbE2sVUiIC+xlkWWExng12vsPZmiCCWiwGZ+A3KUp+6BS03NaI18CGPWh5WgkUv2kivKppiOhOsTwX4av2uCVs/QiItAYGm60q1eCwWe/DY5P5Q7n+gf0gn/wudYVLiMtLwqpCoT1cg8eKNJKQ1AXtmqzF72t9CMpDCW3fhbkwPcHCnQ3Q5nw9oZqz5Ae9+cqM=)

</div>

:::tip
Note the click handler uses `store.increment()` with the parenthesis - this is necessary to call the method with the proper `this` context since it's not a component method.
:::

Although here we are using a single reactive object as a store, you can also share reactive state created using other [Reactivity APIs](/api/reactivity-core.html) such as `ref()` or `computed()`, or even return global state from a [Composable](/guide/reusability/composables.html):

```js
import { ref } from 'kdu'

// global state, created in module scope
const globalCount = ref(1)

export function useCount() {
  // local state, created per-component
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

The fact that Kdu's reactivity system is decoupled from the component model makes it extremely flexible.

## SSR Considerations

If you are building an application that leverages [Server-Side Rendering (SSR)](./ssr), the above pattern can lead to issues due to the store being a singleton shared across multiple requests. This is discussed in [more details](./ssr#cross-request-state-pollution) in the SSR guide.
