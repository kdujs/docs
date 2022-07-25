# Components Basics

Components allow us to split the UI into independent and reusable pieces, and think about each piece in isolation. It's common for an app to be organized into a tree of nested components:

![Component Tree](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

This is very similar to how we nest native HTML elements, but Kdu implements its own component model that allow us to encapsulate custom content and logic in each component. Kdu also plays nicely with native Web Components. If you are curious about the relationship between Kdu Components and native Web Components, [read more here](/guide/extras/web-components.html).

## Defining a Component

When using a build step, we typically define each Kdu component in a dedicated file using the `.kdu` extension - known as a [Single-File Component](/guide/scaling-up/sfc.html) (SFC for short):

<div class="options-api">

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
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>
<div class="composition-api">

```kdu
<script setup>
import { ref } from 'kdu'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>

When not using a build step, a Kdu component can be defined as a plain JavaScript object containing Kdu-specific options:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'kdu'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // or `template: '#my-template-element'`
}
```

</div>

The template is inlined as a JavaScript string here, which Kdu will compile on the fly. You can also use an ID selector pointing to an element (usually native `<template>` elements) - Kdu will use its content as the template source.

The example above defines a single component and exports it as the default export of a `.js` file, but you can use named exports to export multiple components from the same file.

## Using a Component

:::tip
We will be using SFC syntax for the rest of this guide - the concepts around components are the same regardless of whether you are using a build step or not. The [Examples](/examples/) section shows component usage in both scenarios.
:::

To use a child component, we need to import it in the parent component. Assuming we placed our counter component inside a file called `ButtonCounter.kdu`, the component will be exposed as the file's default export:

<div class="options-api">

```kdu
<script>
import ButtonCounter from './ButtonCounter.kdu'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

To expose the imported component to our template, we need to [register](/guide/components/registration.html) it with the `components` option. The component will then be available as a tag using the key it is registered under.

</div>

<div class="composition-api">

```kdu
<script setup>
import ButtonCounter from './ButtonCounter.kdu'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

With `<script setup>`, imported components are automatically made available to the template.

</div>

It's also possible to globally register a component, making it available to all components in a given app without having to import it. The pros and cons of global vs. local registration is discussed in the dedicated [Component Registration](/guide/components/registration.html) section.

Components can be reused as many times as you want:

```kdu-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqVUctOwzAQ/JXFF0ClNlyrUPG48AtIvrjJVk0bP2RvVFCUf2ft0IoAEkKyDzNrz+zODuIxBHloerESVapjG2itXWuDjwRPPZF3z753hBG20Vu4lGrG5q+X2gFoh2/lU4Nb03cEQ2Zrz0oOHaXVRMBcNFOjdnwqdXZnQGhDZwgzomp3t37BiGD4WuPeod61XfNF/KJS/Ka8nfes/kVW6uwrbsQUwtKaIPfJOw6oTKA/C0mL80xacAwZa7EjCmmlFBP7tEzbWh5xI00ImZGRzVqLEpNdbqI/Jk5wz0qnHNj2R7yzzfwWcmPIXF2feolIfXQnlFfASiu4nTCb/Jk4QLUpTcBD3bX14V6LIrJYaFHKAK++h1LDBizCMEw2MI6Q50uyqKhJ5luy4wemK9ty)

</div>
<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqVkM1qwzAQhF9lq0ta0kjtNTihP5e+QkEXR9lgO9YP0ppQjN+9K9kU0tJCDzrs7OobZkbxHII8HwexFVUysQ0ECWkIe+1aG3wkeBmIvHv1gyOMcIrewkqqKzUDVtpVaibwXx4IbehrwjxR1Tzu3zAi1Pxs7T7ANG1/BOPZxKGjdFMpvim3147qX2KlvnzFvZgjbGwdZJe845CjdgB6WSQttlCUrHGIPGvREIW0VYqFLm3SycgLHmQdQlZkZLPWosRkN4foL4nzd0zKmEm7iW1/lPN7uyNEPMG09Dr3qJ3xLhGXwwDY5Yvbh7s/+gWoDsUSnkzfmvNOi/J3vdairAHe/QBlh0ewCOO40KcJcpokC0XNmG89Tp8bUsIx)

</div>

Notice that when clicking on the buttons, each one maintains its own, separate `count`. That's because each time you use a component, a new **instance** of it is created.

In SFCs, it's recommended to use `PascalCase` tag names for child components to differentiate from native HTML elements. Although native HTML tag names are case-insensitive, Kdu SFC is a compiled format so we are able to use case-sensitive tag names in it. We are also able to use `/>` to close a tag.

If you are authoring your templates directly in a DOM (e.g. as the content of a native `<template>` element), the template will be subject to the browser's native HTML parsing behavior. In such cases, you will need to use `kebab-case` and explicit closing tags for components:

```kdu-html
<!-- if this template is written in the DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

See [DOM template parsing caveats](#dom-template-parsing-caveats) for more details.

## Passing Props

If we are building a blog, we will likely need a component representing a blog post. We want all the blog posts to share the same visual layout, but with different content. Such a component won't be useful unless you can pass data to it, such as the title and content of the specific post we want to display. That's where props come in.

Props are custom attributes you can register on a component. To pass a title to our blog post component, we must declare it in the list of props this component accepts, using the <span class="options-api">[`props`](/api/options-state.html#props) option</span><span class="composition-api">[`defineProps`](/api/sfc-script-setup.html#defineprops-defineemits) macro</span>:

<div class="options-api">

```kdu
<!-- BlogPost.kdu -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

When a value is passed to a prop attribute, it becomes a property on that component instance. The value of that property is accessible within the template and on the component's `this` context, just like any other component property.

</div>
<div class="composition-api">

```kdu
<!-- BlogPost.kdu -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` is a compile-time macro that is only available inside `<script setup>` and does not need to be explicitly imported. Declared props are automatically exposed to the template. `defineProps` also returns an object that contains all the props passed to the component, so that we can access them in JavaScript if needed:

```js
const props = defineProps(['title'])
console.log(props.title)
```

See also: [Typing Component Props](/guide/typescript/composition-api.html#typing-component-props) <sup class="kt-badge ts" />

If you are not using `<script setup>`, props should be declared using the `props` option, and the props object will be passed to `setup()` as the first argument:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

A component can have as many props as you like and, by default, any value can be passed to any prop.

Once a prop is registered, you can pass data to it as a custom attribute, like this:

```kdu-html
<BlogPost title="My journey with Kdu" />
<BlogPost title="Blogging with Kdu" />
<BlogPost title="Why Kdu is so fun" />
```

In a typical app, however, you'll likely have an array of posts in your parent component:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Kdu' },
        { id: 2, title: 'Blogging with Kdu' },
        { id: 3, title: 'Why Kdu is so fun' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'My journey with Kdu' },
  { id: 2, title: 'Blogging with Kdu' },
  { id: 3, title: 'Why Kdu is so fun' }
])
```

</div>

Then want to render a component for each one, using `k-for`:

```kdu-html
<BlogPost
  k-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFUstOwzAQ/JWVLwGpScTjFIVKcEVI3DhgDmmzad02tmVvKFXUf2edNGkLqEiRlRnPrL07bsWjtcm6bEQmcj93ytJUalVb4wieNmbxajxB5UwNUZIORDBEUgNIjV+dtMSqaDYEbWDnhv0aNfmsJ2AsFdB+EtayoOLqeth3SI3TAwKwrGX3+4ABWlBlBjcTIEUbzCB62cHKsAl3sFW0hGe+06H2qeP26AiXWCi9uKi/O+rflrugAuXBG6gazfpB/tH/dJgX/vJ0nB8DwtpuCsKAKD9tX9I6rox7kCI0CUr3zUoRlADZGneHvUSVgQ2WrLvTwHegN0zzMRU+Kk/Hc8VE9DHGdWGTlTeaI+7mKw8bfOSYjxQcacBSLImsz9KUiZWPfTVPtjhLCmsDk7hGk6oxQV/HM2e2Hh0Xl+Iwx65OyuQnutihLtGh+6/uD/mv2sOMuaXTF3j2ZP96h9YZPhHeo25eEUd2KSaAfHk/bds+ftjv85Tx+Uz334VCEQ8=)

</div>
<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp9UstqwzAQ/JVFF7cQy/RxEkqgvZZCbj1EPSSxHCuJJSGtCcb437uy82ih7XFnRjueWffsxXt+KFsmmIzbYDxC1Nj6hbKm8S4g9BB0BQNUwTWQkTS7Uq9Ht1u6iGeOFxcgbSQZgLJbZ0ngCYwwT6vuVonowZQCHmaABo9aQPbewd61weoOTgZreKMNMMxu2sebNtnsjN39oXy6KT/qLvFgIkQHVWtJqeznvbKymOJSUBpQN/64Rp0mlJcYYwI85JULc8VSBjB2yqJYUgKIg+7OHDdlQtMTMfpf8HGYHizktSOyksXVl83YVGrerD3fR2fpIv247UyQpYARSRgVnGbFakQfRVEQsI95rLb8pDd87X1CeGgtmkZzHZt8E9wp6kDLp8+kIgay/X6zX/6CUlfG6mVwPt6tsjFK9m9/ALJ+XvT9dAMYBlnQ/DPs8AV2stiI)

</div>

Notice how `k-bind` is used to pass dynamic prop values. This is especially useful when you don't know the exact content you're going to render ahead of time.

That's all you need to know about props for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Props](/guide/components/props.html).

## Listening to Events

As we develop our `<BlogPost>` component, some features may require communicating back up to the parent. For example, we may decide to include an accessibility feature to enlarge the text of blog posts, while leaving the rest of the page at its default size.

In the parent, we can support this feature by adding a `postFontSize` <span class="options-api">data property</span><span class="composition-api">ref</span>:

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

Which can be used in the template to control the font size of all blog posts:

```kdu-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    k-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Now let's add a button to the `<BlogPost>` component's template:

```kdu{5}
<!-- BlogPost.kdu, omitting <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Enlarge text</button>
  </div>
</template>
```

The button doesn't do anything yet - we want clicking the button to communicate to the parent that it should enlarge the text of all posts. To solve this problem, components provide a custom events system. The parent can choose to listen to any event on the child component instance with `k-on` or `@`, just as we would with a native DOM event:

```kdu-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Then the child component can emit an event on itself by calling the built-in [**`$emit`** method](/api/component-instance.html#emit), passing the name of the event:

```kdu{5}
<!-- BlogPost.kdu, omitting <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

Thanks to the `@enlarge-text="postFontSize += 0.1"` listener, the parent will receive the event and update the value of `postFontSize`.

<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqNUsFunDAQ/ZWRVYlEXaDb9oTIKq3UXqpKlXroIeTAgtn1LtiWPXRD0P57xhhYIiVREELMm/fG45nXs29aR8eyZQlLbWGExk0mRaOVQfheq90fZREqoxoIongCnCDIJEAm+cNALXmVtzVC79BCkV5yiTbxAMylXHReuW+ZY351PeUNx9bIKQLQxCX13RQD9CDKBNYrQIE1TyD43cFBkYh3cBK4h1/U01h7qfh8UbgmdkLu3uR/ufD/7TvHAmHBKqhaSfyJfj8LXas/lcS/4pFEaw8PPPrQm8bzXClA3ug6R04RQFqK/5BY7Gp+k7EeqrnMsih8hIA37mw2qEi3HKd7jmGlDJVwMhDSjy9jUzo58m7MRqJc4MNNp8wQXJK3XNa52fEQ+QOOnEtLN/ApWk/kTTpbw98rpovRXxrP12Ur5l0VNrmODlZJctyw7mxMUL+zXTJGDnNxxvaI2iZxTMDBhrYqohPfRrnWDolMK1E0POK2CbdGnSw3VNz35cZPxy5N+8zlL1lXG0WnwV0wDCPwW+aNGMwYLCcS3L9ru0WdW0vT21IXoRvhsMQMKb3/uul7bzY4n9OY4jGzbRGVhNuiFsWRxB9cB1fPj7+mQj88AA5IY696dQHnJ6A2R/c=)

</div>
<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp1UsuOm0AQ/JUWioRXMRAnOSFsbSJtLlGklXLIYckBQ2OPDTOjmSYOQfx7engYr7TmRFdVP6arO++L1uG5aLzYS2xuhCawSI3epVLUWhmCDgyW0ENpVA0+S/0r9bVSh2dlaeLCaAZcRZYBpDJXkgWaQQtbV2r14ogORBHDZg0kqMIY/B8tnFRjJLZwEXSE71wB+vWi/bhoXZuDkIc7yk+L8texdTwIC1ZB2UhWpvL3QypvJ/umJP0U/3AacMN0Eo3b4D1wQFjrKiN0ESWF+AOxpbbCbep1UE7Z8eta78HH2rXzOAv4S+btjCHAOSiV4RIuDYQcl5R6Mx2fsZ3YUBQ3+PC4mRmChXxEWWXmgAHhX5o0y0hb+BBuZvEuufo1TJhE/DD+S6Lrc721N1od1JkOT1ZJvpNuMHYieN4YBsRhbLuLU+9IpG0cRQycbGDLPLzgPsy0dkhoGkmixhBtHeyNulg0XHyci+3pue3tJb1xmwWWQuKzUdquXvxhB75zdcSfakEOv93FQN91lV/vXM2rzFre2p67B251i3nHz7uuG+8K+j6JOJ6YfUOkJDzmlcjPnPwOuf3qdfMHLvQ0AuCAJBqz7i6+/w9oLzUa)

</div>

We can optionally declare emitted events using the <span class="options-api">[`emits`](/api/options-state.html#emits) option</span><span class="composition-api">[`defineEmits`](/api/sfc-script-setup.html#defineprops-defineemits) macro</span>:

<div class="options-api">

```kdu{5}
<!-- BlogPost.kdu -->
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```kdu{4}
<!-- BlogPost.kdu -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

This documents all the events that a component emits and optionally [validates them](/guide/components/events.html#events-validation). It also allows Kdu to avoid implicitly applying them as native listeners to the child component's root element.

<div class="composition-api">

Similar to `defineProps`, `defineEmits` is only usable in `<script setup>` and doesn't need to be imported. It returns an `emit` function that is equivalent to the `$emit` method. It can be used to emit events in the `<script setup>` section of a component, where `$emit` isn't directly accessible:

```kdu
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

See also: [Typing Component Emits](/guide/typescript/composition-api.html#typing-component-emits) <sup class="kt-badge ts" />

If you are not using `<script setup>`, you can declare emitted events using the `emits` option. You can access the `emit` function as a property of the setup context (passed to `setup()` as the second argument):

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

That's all you need to know about custom component events for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Custom Events](/guide/components/events).

## Content Distribution with Slots

Just like with HTML elements, it's often useful to be able to pass content to a component, like this:

```kdu-html
<AlertBox>
  Something bad happened.
</AlertBox>
```

Which might render something like:

:::danger This is an Error for Demo Purposes
Something bad happened.
:::

This can be achieved using Kdu's custom `<slot>` element:

```kdu{4}
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

As you'll see above, we use the `<slot>` as a placeholder where we want the content to go – and that's it. We're done!

<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpVUstO6zAQ/ZW5vgs2N84FoQqFUAkkvoCtN07stoHEtsYTCKr4d2bSNBTZm3Pm+MzLR/WYkn5zo6pUnVvsEm1N6IYUkeCx90hPcYIdxgGudHkm5MGVCQAm+GmWOr+zY09wFLaN/D74QLmC44/Llwl863JNw4D8kHpLXhDVZykj9qaXOHg6dGEPjXVwsCn54J2epWstrK3L1Ub9U6fii8Em/Zpj4MbmoswSyEZxVcIIx40INupAlHJVlky85iLvWv3hG80phdE4BuoGr30eigbjR/bI5kaJjbTFaS9nI8O86Aygdt07tL3N+cEoK8qiiZNRc5DDmTCG/fYZMeIfntAJLsEGy1XXR4ITqkv2/N38PNFMn72H3MbkHTN6zXbeTR+xgr+bzeZecBPReSau0wQ59p0D9O4iUqB13ciLvE3TTCfrHK+kgpv/C9PY9m2PcQyuOLvv7uRwlIcjv+TUkFRgaNFImnkHy6eQsrfq6xsvweHb)

</div>
<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpVUcFOwzAM/RUTDlxoCghNqJRJQ+ILuOaSNtnWrU0ix2VF0/4dp+2qoZze8/Ozn3MWmxDk0fSiEGWssQkE0VIf1so1XfBIsGkt0qcfYIu+gweZX4nU9qBcmU993MGAbBdaTTYhKq9SRgCKvn1nad+4HVTawF6HYJ01cpQutqwt88VGPIppj6zTQR6id7zpebSbC1GJAkYmcbxTwkrsiUIs8pyJQ8zitpYnW0kemRiJvaOms9LGLqvQn6JFNlci2VyUu/DY25jpOjfJAErT/EDd6hg/lNBJmVV+UGIscjkSerdbfyF6vOMLTXAuVpgvutYTTKjM2fN/+PGikX5bC7H2wRpm5DJtCl371mMB96vV6j3hyqOxTDyHAaJvGwNozU0lQ22aPhbwGoaRDtoY/pICXp5mptL1cYe+dya7um/f0uMqH4fP7KZAaQNFsyaNGf8gaVJkXnstLn8fjdDM)

</div>

That's all you need to know about slots for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Slots](/guide/components/slots).

## Dynamic Components

Sometimes, it's useful to dynamically switch between components, like in a tabbed interface:

<div class="options-api">

[Open example in the Playground](https://kdujs-sfc.web.app/#eNqNVE1v4yAQ/Ssj9+Bdqbbb7WoPbFJtb3vcw97qHjDGCY0NCHCbKsp/3wFs4qobNXIUMW+GNx/AO2QPWpe7dsxItrLMCO3uaykGrYyD32rg0Bk1QF5W3vCBeXL/UdbZ5A/W+4AHw7bi5UQx2VMQQC35PgS2vKNj7+DgUaZwt+TSWRIBCIVcx2VIM60nPm8cA9RSR798nXcZ7kYjZwuJR2OQ9i9tCOSeMp94ABxtMNvjhEIesvjFlCJ/ipHHkKuW+FtVaVxoOD7onjqOFsCqFS/Aemrtus5aPqg6Czh6mtE5hRtiWtgVnTIYhPlByFBGnSUv2fG36FyCM/Fjjo4iEmKpB6DMYalk0Ses12tPCsenBcMv1gu2Q4ZloA9LMVO1AIdD3B76xvKrmM737NBMRwVE+JJOhHWWBhCI71dVCo4zqnBIuFpVi9Ghad1b75eln1s8u05JV3R0EP0bAUulLSw3ovvpfY0yLTcEbvUerOpFC1ec84WrMLQVIx7uN70PsKZtK+QGgRvcc4d/AR6o2QhZOKWRjA9LrFHY80Dg+xw7Yn6soefMEZDYU0DVCzddr16LPQE6OoUgjg07OR1T7CdV8AMLuJ1Jp3KxgKLnnUt13330G7HZngt4NwrGWHDhuViFLq2EdNzEcMp2G6NG2RK46m7897+mC6Rb4iF3grHBRXtk62cQm3xHz2/89yG+jDf2gg1TyPkO00ynecYHGu5Sdp1FPSoGqstnqyRqXeCrJwe+uSQ1dYbq5O062zqnLakqBJ7xznWsfOVNSbX2SGlG6QRKIrdD0Rj1incCyeMT8gqBaWfJ9Np6XiDi+zgJ3UkAz7wTZE5iezl1VOsLuBcqfTn7LPWf8h//AY1NJhI=)

</div>
<div class="composition-api">

[Open example in the Playground](https://kdujs-sfc.web.app/#eNqNVF1v2yAU/SvIe0grxXa7TntgSbW+7XEPe6unCWOc0NiAAPdDUf77DuC4jrpoiaWI+8G551zg7rMHY4pdM2Q0WzlupfHECT+Y+0rJ3mjryQ/dC9Ja3ZNFUQYjpC+m8E/tvJvi0TpNeLB8K5/fIUb7NGlPrGjJYUxKIVIprpXzhA/WCuV/sZqsQ97VItBYXFfqmOFZ7RDbY1PkuwyLyCWuxpKVOlRqVSaZEAjDi950zAtYhKwa+Ux4x5xbV1kjel1l0Y9IPXivsSEY+O3yVlskXf1ZhtrXRKrIocqmFLoTb8iAd+48oj8uEMgT6mIJ+Yx7MKQnWtfrAEoOv2cI33kn+Q4IJ02ZVxkpE7Lfp+0QHTWUqVwQ7mFyjdYrQBAqA6XA//EdFUWnXkT4+1U5bUntKtEvrFblrIswnX/rwrIILUxn0mrl85b1snujxDHlciesbL+FWK1tIywlt+aVON3JhnwSQsxCuWWNHBwln81rdBvWNFJt4LjBnjv8RXfP7Eaq3GsDMNHPfbWG8p6SL8fcAfXBoRPcU6KgKXr1s7Btp1/yV0rY4DWcaB6UvB9W0jMx+AoCt0fQkS4I5J1o/cT77mPcys32XMJJKzjnMYSDcRoho6XywqZ0xncbqwfVUPKpvQnfv0TngJv7Y+3JDYEzeXQbepBEnsCLm/B9yC/Svb1gw5hyXuHU07Gf6a3Gu5QtszQn8p6Z4slphXEV8aoxgJdHU4Xgw/wIdpVtvTeOliUcT7hzLS9eRF0wY4KnsIPyEvNMuD6vrX7BnQB4ekiofkDZ47wL4/H8rEjvI1WP43J6KGfeCZCnSXk5dBq1F2DPRuzl6Mc5/V/8w1+kvxd3)

</div>

The above is made possible by Kdu's `<component>` element with the special `is` attribute:

<div class="options-api">

```kdu-html
<!-- Component changes when currentTab changes -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```kdu-html
<!-- Component changes when currentTab changes -->
<component :is="tabs[currentTab]"></component>
```

</div>

In the example above, the value passed to `:is` can contain either:

- the name string of a registered component, OR
- the actual imported component object

You can also use the `is` attribute to create regular HTML elements.

When switching between multiple components with `<component :is="...">`, a component will be unmounted when it is switched away from. We can force the inactive components to stay "alive" with the built-in [`<KeepAlive>` component](/guide/built-ins/keep-alive.html).

## DOM Template Parsing Caveats

If you are writing your Kdu templates directly in the DOM, Kdu will have to retrieve the template string from the DOM. This leads to some caveats due to browsers' native HTML parsing behavior.

:::tip
It should be noted that the limitations discussed below only apply if you are writing your templates directly in the DOM. They do NOT apply if you are using string templates from the following sources:

- Single-File Components
- Inlined template strings (e.g. `template: '...'`)
- `<script type="text/x-template">`
  :::

### Case Insensitivity

HTML tags and attribute names are case-insensitive, so browsers will interpret any uppercase characters as lowercase. That means when you’re using in-DOM templates, PascalCase component names and camelCased prop names or `k-on` event names all need to use their kebab-cased (hyphen-delimited) equivalents:

```js
// camelCase in JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```kdu-html
<!-- kebab-case in HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Self Closing Tags

We have been using self-closing tags for components in previous code samples:

```kdu-html
<MyComponent />
```

This is because Kdu's template parser respects `/>` as an indication to end any tag, regardless of its type.

In DOM templates, however, we must always include explicit closing tags:

```kdu-html
<my-component></my-component>
```

This is because the HTML spec only allows [a few specific elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) to omit closing tags, the most common being `<input>` and `<img>`. For all other elements, if you omit the closing tag, the native HTML parser will think you never terminated the opening tag. For example, the following snippet:

```kdu-html
<my-component /> <!-- we intend to close the tag here... -->
<span>hello</span>
```

will be parsed as:

```kdu-html
<my-component>
  <span>hello</span>
</my-component> <!-- but the browser will close it here. -->
```

### Element Placement Restrictions

Some HTML elements, such as `<ul>`, `<ol>`, `<table>` and `<select>` have restrictions on what elements can appear inside them, and some elements such as `<li>`, `<tr>`, and `<option>` can only appear inside certain other elements.

This will lead to issues when using components with elements that have such restrictions. For example:

```kdu-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

The custom component `<blog-post-row>` will be hoisted out as invalid content, causing errors in the eventual rendered output. We can use the special [`is` attribute](/api/built-in-special-attributes.html#is) as a workaround:

```kdu-html
<table>
  <tr is="kdu:blog-post-row"></tr>
</table>
```

:::tip
When used on native HTML elements, the value of `is` must be prefixed with `kdu:` in order to be interpreted as a Kdu component. This is required to avoid confusion with native [customized built-in elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example).
:::

That's all you need to know about DOM template parsing caveats for now - and actually, the end of Kdu's _Essentials_. Congratulations! There's still more to learn, but first, we recommend taking a break to play with Kdu yourself - build something fun, or check out some of the [Examples](/examples/) if you haven't already.

Once you feel comfortable with the knowledge you've just digested, move on with the guide to learn more about components in depth.
