# Composables

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
This section assumes basic knowledge of Composition API. If you have been learning Kdu with Options API only, you can set the API Preference to Composition API (using the toggle at the top of the left sidebar) and re-read the [Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals.html) and [Lifecycle Hooks](/guide/essentials/lifecycle.html) chapters.
:::

## What is a "Composable"?

In the context of Kdu applications, a "composable" is a function that leverages Kdu Composition API to encapsulate and reuse **stateful logic**.

When building frontend applications, we often have the need to reuse logic for common tasks. For example, we may need to format dates in many places, so we extract a reusable function for that. This formatter function encapsulates **stateless logic**: it takes some input and immediately returns expected output. There are many libraries out there for reusing stateless logic - for example [lodash](https://lodash.com/) and [date-fns](https://date-fns.org/), which you may have heard of.

In comparison, stateful logic involves managing state that changes over time. A simple example would be tracking the current position of the mouse on a page. In real world scenarios, it could also be more complex logic such as touch gestures or connection status to a database.

## Mouse Tracker Example

If we were to implement the mouse tracking functionality using Composition API directly inside a component, it would look like this:

```kdu
<script setup>
import { ref, onMounted, onUnmounted } from 'kdu'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

But what if we want to reuse the same logic in multiple components? We can extract the logic into an external file, as a composable function:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'kdu'

// by convention, composable function names start with "use"
export function useMouse() {
  // state encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose managed state as return value
  return { x, y }
}
```

And this is how it can be used in components:

```kdu
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Mouse position is at: {{ x }}, {{ y }}
</div>

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqNkk1vgzAMhv+KxaVMomHnqq20w27bcdIm5ULBbOmaDyWhUCH++2ygtJN22AXiN/YT+0365Mk58V01ySbZhtIrFyFgbNxeGqWd9RF6aAK+WvrAALW3GlYi1xyLY1hJI01pTeC8LoML5eyWgvRBmm0+YQlIQUTtTkVEigAmqLNBRWUNqABF3EBPIBiGjBeEGxixlCVZMrW11oWj862hxnuGyXkjyIQYrLBGk3Esk68YXdjkOQnHsA51KVo8iMI5VoRvTFQaBQa9PnjbBvQElwljqIGBjr1OTOctxnisM7CG5jARK16+GcrjYPGK8KNJ2I1FdWPKcdqbR1O3k4kduUfU9JGcu2qXO43VG8JV5EmKZzRxpgB04lycGqSaUReu+MT3aevyx9bHPCL/lklSamq3h1aZyraiqKpnzn9RIaJBn65GL7Q94yqbm3gY+72b/zfCj9n/ojDH0wv0ZnlRfAHDD2Gy6/U=)

As we can see, the core logic remains exactly the same - all we had to do was move it into an external function and return the state that should be exposed. Same as inside a component, you can use the full range of [Composition API functions](/api/#composition-api) in composables. The same `useMouse()` functionality can now be used in any component.

The cooler part about composables though, is that you can also nest them: one composable function can call one or more other composable functions. This enables us to compose complex logic using small, isolated units, similar to how we compose an entire application using components. In fact, this is why we decided to call the collection of APIs that make this pattern possible Composition API.

As an example, we can extract the logic of adding and cleaning up a DOM event listener into its own composable:

```js
// event.js
import { onMounted, onUnmounted } from 'kdu'

export function useEventListener(target, event, callback) {
  // if you want, you can also make this
  // support selector strings as target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

And now our `useMouse()` can be simplified to:

```js{3,9-12}
// mouse.js
import { ref } from 'kdu'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
Each component instance calling `useMouse()` will create its own copies of `x` and `y` state so they won't interfere with one another. If you want to manage shared state between components, read the [State Management](/guide/scaling-up/state-management.html) chapter.
:::

## Async State Example

The `useMouse()` composable doesn't take any arguments, so let's take a look at another example that makes use of one. When doing async data fetching, we often need to handle different states: loading, success, and error:

```kdu
<script setup>
import { ref } from 'kdu'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div k-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div k-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div k-else>Loading...</div>
</template>
```

Again, it would be tedious to have to repeat this pattern in every component that needs to fetch data. Let's extract it into a composable:

```js
// fetch.js
import { ref } from 'kdu'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Now in our component we can just do:

```kdu
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

`useFetch()` takes a static URL string as input - so it performs the fetch only once and is then done. What if we want it to re-fetch whenever the URL changes? We can achieve that by also accepting refs as an argument:

```js
// fetch.js
import { ref, isRef, unref, watchEffect } from 'kdu'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // reset state before fetching..
    data.value = null
    error.value = null
    // unref() unwraps potential refs
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    // and avoid the overhead of a watcher
    doFetch()
  }

  return { data, error }
}
```

This version of `useFetch()` now accepts both static URL strings and refs of URL strings. When it detects that the URL is a dynamic ref using [`isRef()`](/api/reactivity-utilities.html#isref), it sets up a reactive effect using [`watchEffect()`](/api/reactivity-core.html#watcheffect). The effect will run immediately, and tracking the URL ref as a dependency in the process. Whenever the URL ref changes, the data will be reset and fetched again.

Here's [the updated version of `useFetch()`](https://kdujs-sfc.web.app/#eNp9VcFu4zYQ/ZWpLlZQW0qx6CVwjBbo9rRFi6Dbky60NFrTkUmBpOIahv+9b0hJUbJBL5Y1nHkz8+YNdc1+7fviuRmyh2zra6f7QJ7D0O8qo0+9dYGu5LhdU21P/RC4oRu1zp5ohaDVwmnw/DuH+jCfF+VkKo4enpWprfGB9srzV9fRI60OIfT+oSyP3pq+UzUfbNewK8Kl17VtuEDSMtjG+hIAKVw3iERF+eqn1d1kHCLeVGKe39Hjbk70I2KKF9UNDP8p4kqNCmpN7Jx1awAGd0Hpj3MfOTDhvy0TK+ADL4FPqDMw3oi+WNVQb2NND2LY7ocQrKHnTWvdY5Vp0oZ+rjL6pe50/SwWKV5X2e56JU2327ZMIRG9CttGvyBat3CNhcFTgAHd7/60vf+BPouZGF0MJrDj5oGAFZ2LE3uvvnHElQHGwLGmuYTYKXCf5LnID9cS6dO/VAd3nlMxwhVifsODOrQtabe9Y+lDzlJKvH+IsROmtPlWFMV0vi1nKrN1lkS0OakeUrEGWrwKBPiKB77K0GXqp8qgO3mvskk9MBz9xrd1ceZ9ofpeLIUDP/rEBfvTZu/s2UNXRyCtFzgljC/sNo4NZMeg+/9x37l/hy3Qt8rc0NJC+2jn7Spp/ySPwcS3s4Lb57blOrzbrcrwvzGuHUwdNKb4RpyJkiTnOIS0F2boRLjTSZTG2yM5VP5i6lfgxibcEZSoLBGBm4B8wJBoz5A0UytOcZLJS9Km1UIGQU/mJMfv7Uto270whQPH3U2uUtLBWWMH313IW9Jh5Sk4VT/j3lGe1AzQcC9DMPWF9pclhXlsfWoe2P+MVUS2x6V+rUW2fuw44ioXdKtrrTqk6NSFUKsyDWaS9lFUGcDeWelAoi87jCnFDICU5o7OuuvkVhmciV3COnap29SXEpts/Zjaws2dtU+sJN+IspdoAYokbLQfGwipR3CJ9lJFcT7SZOxaRh3R34wpeSIq7trE141qIZFyniXwfo48eo4qlwd6yaOaI7FL8cSPCLIo6AuDdryJtcXuDW5p+vr0BYswsSBRyymOeozF3UgukQX2zNSajgMYSMjW1GOFs5gXlY6j+Ojaf5gC4u6K+wdCqMy8K/PYU0kjsuEz/YXlRVl5PupbEhzRTvwcjfWDmL9HgPSZmtkWMv9Q4VAkxeF0R/fFp8U8JFkEnqb2npzkIilzqSd+LPLVU1JwfFvdvYaO81zTp/v7xBV+b9ntP+sosr4=), with an artificial delay and randomized error for demo purposes.

## Conventions and Best Practices

### Naming

It is a convention to name composable functions with camelCase names that start with "use".

### Input Arguments

A composable can accept ref arguments even if it doesn't rely on it for reactivity. If you are writing a composable that may be used by other developers, it's a good idea to handle the case of input arguments being refs instead of raw values. The [`unref()`](/api/reactivity-utilities.html#unref) utility function will come in handy for this purpose:

```js
import { unref } from 'kdu'

function useFeature(maybeRef) {
  // if maybeRef is indeed a ref, its .value will be returned
  // otherwise, maybeRef is returned as-is
  const value = unref(maybeRef)
}
```

If your composable creates reactive effects when the input is a ref, make sure to either explicitly watch the ref with `watch()`, or call `unref()` inside a `watchEffect()` so that it is properly tracked.

### Return Values

You have probably noticed that we have been exclusively using `ref()` instead of `reactive()` in composables. The recommended convention is to always return an object of refs from composables, so that it can be destructured in components while retaining reactivity:

```js
// x and y are refs
const { x, y } = useMouse()
```

Returning a reactive object from a composable will cause such destructures to lose the reactivity connection to the state inside the composable, while the refs will retain that connection.

If you prefer to use returned state from composables as object properties, you can wrap the returned object with `reactive()` so that the refs are unwrapped. For example:

```js
const mouse = reactive(useMouse())
// mouse.x is linked to original ref
console.log(mouse.x)
```

```kdu-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### Side Effects

It is OK to perform side effects (e.g. adding DOM event listeners or fetching data) in composables, but pay attention to the following rules:

- If you are working on an application that utilizes [Server-Side Rendering](/guide/scaling-up/ssr.html) (SSR), make sure to perform DOM-specific side effects in post-mount lifecycle hooks, e.g. `onMounted()`. These hooks are only called in the browser, so you can ensure code inside it has access to the DOM.

- Make sure to clean up side effects in `onUnmounted()`. For example, if a composable sets up a DOM event listener, it should remove that listener in `onUnmounted()` (as we have seen in the `useMouse()` example). It can also be a good idea to use a composable that automatically does this for you, like the `useEventListener()` example.

### Usage Restrictions

Composables should only be called **synchronously** in `<script setup>` or the `setup()` hook. In some cases, you can also call them in lifecycle hooks like `onMounted()`.

These are the contexts where Kdu is able to determine the current active component instance. Access to an active component instance is necessary so that:

1. Lifecycle hooks can be registered to it.

2. Computed properties and watchers can be linked to it for disposal on component unmount.

:::tip
`<script setup>` is the only place where you can call composables **after** usage of `await`. The compiler automatically restores the active instance context after the async operation for you.
:::

## Extracting Composables for Code Organization

Composables can be extracted not only for reuse, but also for code organization. As the complexity of your components grow, you may end up with components that are too large to navigate and reason about. Composition API gives you the full flexibility to organize your component code into smaller functions based on logical concerns:

```kdu
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

To some extent, you can think of these extracted composables as component-scoped services that can talk to one another.

## Using Composables in Options API

If you are using Options API, composables must be called inside `setup()`, and the returned bindings must be returned from `setup()` so that they are exposed to `this` and the template:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() exposed properties can be accessed on `this`
    console.log(this.x)
  }
  // ...other options
}
```

## Comparisons with Other Techniques

### vs. Mixins

Users coming from Kdu 2 may be familiar with the [mixins](/api/options-composition.html#mixins) option, which also allows us to extract component logic into reusable units. There are three primary drawbacks to mixins:

1. **Unclear source of properties**: when using many mixins, it becomes unclear which instance property is injected by which mixin, making it difficult to trace the implementation and understand the component's behavior. This is also why we recommend using the refs + destructure pattern for composables: it makes the property source clear in consuming components.

2. **Namespace collisions**: multiple mixins from different authors can potentially register the same property keys, causing namespace collisions. With composables, you can rename the destructured variables if there are conflicting keys from different composables.

3. **Implicit cross-mixin communication**: multiple mixins that need to interact with one another have to rely on shared property keys, making them implicitly coupled. With composables, values returned from one composable can be passed into another as arguments, just like normal functions.

For the above reasons, we no longer recommend using mixins in Kdu 3. The feature is kept only for migration and familiarity reasons.

### vs. Renderless Components

In the component slots chapter, we discussed the [Renderless Component](/guide/components/slots.html#renderless-components) pattern based on scoped slots. We even implemented the same mouse tracking demo using renderless components.

The main advantage of composables over renderless components is that composables do not incur the extra component instance overhead. When used across an entire application, the amount of extra component instances created by the renderless component pattern can become a noticeable performance overhead.

The recommendation is to use composables when reusing pure logic, and use components when reusing both logic and visual layout.

### vs. React Hooks

If you have experience with React, you may notice that this looks very similar to custom React hooks. Composition API was in part inspired by React hooks, and Kdu composables are indeed similar to React hooks in terms of logic composition capabilities. However, Kdu composables are based on Kdu's fine-grained reactivity system, which is fundamentally different from React hooks' execution model. This is discussed in more details in the [Composition API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Further Reading

- [Reactivity In Depth](/guide/extras/reactivity-in-depth.html): for a low-level understanding of how Kdu's reactivity system works.
- [State Management](/guide/scaling-up/state-management.html): for patterns of managing state shared by multiple components.
<!-- - [KdUse](https://kdusejs.web.app/): an ever-growing collection of Kdu composables. The source code is also a great learning resource. -->
