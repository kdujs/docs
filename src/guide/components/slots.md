# Slots

> This page assumes you've already read the [Components Basics](/guide/essentials/component-basics). Read that first if you are new to components.

## Slot Content and Outlet

We have learned that components can accept props, which can be JavaScript values of any type. But how about template content? In some cases, we may want to pass a template fragment to a child component, and let the child component render the fragment within its own template.

For example, we may have a `<FancyButton>` component that supports usage like this:

```kdu-html{2}
<FancyButton>
  Click me! <!-- slot content -->
</FancyButton>
```

The template of `<FancyButton>` looks like this:

```kdu-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- slot outlet -->
</button>
```

The `<slot>` element is a **slot outlet** that indicates where the parent-provided **slot content** should be rendered.

![slot diagram](./images/slots.png)

And the final rendered DOM:

```html
<button class="fancy-btn">
  Click me!
</button>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpdkttOxCAQhl9lxBg1kdbTeqjVRE18Cm4ohYrbAoFp1Gz23R3azabrHfMx88/8Axv2GkKxbkdWsTqpaANC0jiGF+HsEHxE+JBO/b6NiN6BiX6A06JcsFx8KlxdztVURwHqIfQSNUUA9SJ7AgDvvVVrGDTUR5xD6j2C8g61Q+A85wisl00I1eVelF2weTY+yFB8Je9o+k1WFruLJFgFE8mMJsyxYJ+IIVVlSeAr8WRU8a2bQoaQSRFHh3bQhU4Db6L/TjqSuGBZZivcltr+852Xdmi1mfekepnSs2Am5/MGnWDTPdnKZsuXhXE/Yq93vrPtWeLQ8bTUhL99PhZ71dmi8r2PFRwbY55y3Ei17qIfXVtBb52WkXdRtpa2e3ZztWp1dwHHlzfy0dzC9eqEgrvbe23M+VztY6tJznmnJxBk21rXVbAKP3B1GX4mOsjYWTfBRRnPfcZUwcMOqzGmPFzwlp43EqNN0l+ZrLDtHzU82Vw=)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpdkt1O5DAMhV/FG7RiVyItLMz+dAsSIPEUuUnbpIRJkyhxxaAR746TDqMOUi/qk/jYn509uw+h2g4za1ib+mgC3glnpuAjwpN0/dvDjOgd6OgnOK/qlZbTzoUDEE7tSsKgtJwtwj6rvScXpxymBvYnXu/C0dfWx3oUoJqClagoAmhXt4sA8GhNv4VJQfuNc0jWIxVwSPbAeb4jsF03R1JbH03ZBVuY+CRD9ZK8I97SpTgcJMGozaWWYESWY8GeEUNq6pqEl8ST7qtX1VUyhKxUcXZoJlWpNPEu+tekIpkLlm0yJJX9Mq885lPUbplJb2VKt4LpfJ936AQr54SVYeu7Fbif0aoDd8ZeLE6Jy1ATvtn8Wx1dP1djfWzgTGv9P8ed7Ldj9LMbGrDGKRn5GOVgaLo/rq82gxov4OzyWv7TN/Br852C3zd/lNY/l2wfB0V2jrZdhCCHwbixgU3YwdVl2BV1knE0roirNJ7rzPRE/h7kfo4pNxe8ofVG0pa3UlDY+wetO+u3)

</div>

With slots, the `<FancyButton>` is responsible for rendering the outer `<button>` (and its fancy styling), while the inner content is provided by the parent component.

Another way to understand slots is by comparing them to JavaScript functions:

```js
// parent component passing slot content
FancyButton('Click me!')

// FancyButton renders slot content in its own template
function FancyButton(slotContent) {
  return (
    `<button class="fancy-btn">
      ${slotContent}
    </button>`
  )
}
```

Slot content is not just limited to text. It can be any valid template content. For example, we can pass in multiple elements, or even other components:

```kdu-html
<FancyButton>
  <span style="color:red">Click me!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp1Ultu2zAQvMpGQZEWCKWkiftQ1QBpgQK9g34oilRpiw9wSThG4DP0BP3rIXqeXqBX6FJyDMVA/rSj3ZmdWT4W996Xmz4VddGgCNpHQBmTv2utNt6FCN+4FbsvKUZnQQVn4KKsFlgevjg2328lOiO/i0XzAjs0N9UsRSJURGn8yKOkCqBZUE8AwNdRiw0YSVUbm6X2SxMNem4B426Un9tCuNGFWuy4bYu7J7IzoCWo62liuXg1854oNdVx0eKymP0yw325Rmcpvsc81B5+YFvUMCEZI9e5bosfMXqsq4qANTJUotzKruTeZ6QMyUZtZCnRsC64LcpA5G2Rafat3ZPsSfD5as/j6+ZDiZEjkneV+1kXs/Vpv9jg6GJ2mLOcu5+bm24yZUef5ZFgdjNnCedKqU+57rjYDMEl29cwait5YEPgvZY2vr65XvVyuITzqxv+Ud3C29UrKt7dvpdKvZmnXegl0Vln5QR43vfaDjWs/ANcX/mHCTU8DNpO4GKMZZ2ENXw4wCIFzMt5p22UgTAKja48WaHsTt5hzu6MMUhIikDvRRq31rBOGEG5AD3V4FPwDiUCYzmlY0h/f/3+9+fn8kns/wPu8iM0)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNptUltu2zAQvMqGQZEWsKSkiftQ1QBpgQK9A39oilRliw/wAdswcoaeoH89RM/TC/QKXVK2IBsB9KEd7s7uzs6BPFlbbtpIatJ47nobHqnulTUuwDem+f5LDMFokM4ouCmrGZbKbqbkp63wRonvfJY8w47JAFSLXS5ohWRxCHBIKDfIooUOvobDvPHijPiZavyaapoUgyCUHVgQGAE0s9IMAHwder4BJTCioZkvkOtfrGm8ZRp82A/iMyXcDMbVfM80JY8nuivAMTDrVDEfsxpnuejVVNOoZEFG2QrFbLn2RqP+WQh6fPCUoBIjNyUoXoop+RGC9XVVIbD2hZe83IpVyaxNSOmiDr0SpfCqWDmz9cIhOSWJJkmHbS/ul85+LuBqvDcfmPe4u0z5xSqk1fN8ofGDCWnDpOaYfb5cvkrWDn/LieB06KQlXEspP6V4xfimcybqtoah14K5onOs7dEKr+/vlq3oFnB9e88+ygd4u3yFwbuH90LKN2O1ca1AOo3eyYBlbdvrroal3cHdrd1lVDHX9TqDs7Ii9YlouA9HmEfn03DW9DoIh9hotrwKandh56TdVVFA9NgR0C9CmXUP6+gDSOPQ4MqAjc4aLzwURVJpEunvr9///vycW+L5Pw61Ov8=)

</div>

By using slots, our `<FancyButton>` is more flexible and reusable. We can now use it in different places with different inner content, but all with the same fancy styling.

Kdu components' slot mechanism is inspired by the [native Web Component `<slot>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), but with additional capabilities that we will see later.

## Render Scope

Slot content has access to the data scope of the parent component, because it is defined in the parent. For example:

```kdu-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

Here both <span k-pre>`{{ message }}`</span> interpolations will render the same content.

Slot content does **not** have access to the child component's data. As a rule, remember that:

> Everything in the parent template is compiled in parent scope; everything in the child template is compiled in the child scope.

## Fallback Content

There are cases when it's useful to specify fallback (i.e. default) content for a slot, to be rendered only when no content is provided. For example, in a `<SubmitButton>` component:

```kdu-html
<button type="submit">
  <slot></slot>
</button>
```

We might want the text "Submit" to be rendered inside the `<button>` if the parent didn't provide any slot content. To make "Submit" the fallback content, we can place it in between the `<slot>` tags:

```kdu-html{3}
<button type="submit">
  <slot>
    Submit <!-- fallback content -->
  </slot>
</button>
```

Now when we use `<SubmitButton>` in a parent component, providing no content for the slot:

```kdu-html
<SubmitButton />
```

This will render the fallback content, "Submit":

```html
<button type="submit">Submit</button>
```

But if we provide content:

```kdu-html
<SubmitButton>Save</SubmitButton>
```

Then the provided content will be rendered instead:

```html
<button type="submit">Save</button>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFUbtuwzAM/BVVS5ZI2gM3QPsLWbXYDoM6sR4QqaRFkH8vZRVG7KLoJh15R/LuLt9i1JdjljvZYJ+GSAKBctxbP7gYEolD7txA75koeHFKwYmNNs9goW+sb0zlM5M/BC6OLQH/hGhelBIZQZzaceza/iIIPkkoVauLCWbCZlZM4TocQfQZiUf/ydsf2is0i724qTHzHnIr60HKtVGfMXg++T7N+imglTsxIQXjo8rfyg+iiDtjGDijwlOvb9DpNsaC6JQ9DQ40oFNdCjeExOJWbp90DINXSCqBP0KC9J/uqv2XdpF+WP/gk9Y5lBiX1nfVVvqK8GolTv1WlpCIqziGEti0KlWx6vucVB88gZ9Nt8Q5V1J5VvWV049vHUTOkg==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFUrtuwzAM/BVVS5dI2gM3QPsLWbXINo06sR6QqCRFkH8vZTVGnKIo4ME88s7kna/8PQR57DPf8iZ1cQy40260wUdk+9zaET8yondsiN6yV6kewUJ81Y4x7eAyU3oYTJ6QXQvaedJx4DBtK8BWkgW5aUdPo5ZPU4Fgw2QQqGKseRGC5QRsMNPUmu7IEC7IhKjd1YpqxhZWiP409sC6nJB2/5O325sTNKvDaKhRyx58w6sjwpogD8k7cms+SP80kubLiZqTK6XW/BMxpK1SBBySSEMnz9BKE0JBZMwORwsSkhVt9OcEkcQ13zzoKAJPEEUE10OE+J/u0/gv7bvndNJzkOUPWFvfVlvxK8Cb5mme17yEhNRNky+BzatiFau+L0l13iGlfzddI+VcSeW1qj85ffsGmaTjhA==)

</div>

## Named Slots

There are times when it's useful to have multiple slot outlets in a single component. For example, in a `<BaseLayout>` component with the following template:

```kdu-html
<div class="container">
  <header>
    <!-- We want header content here -->
  </header>
  <main>
    <!-- We want main content here -->
  </main>
  <footer>
    <!-- We want footer content here -->
  </footer>
</div>
```

For these cases, the `<slot>` element has a special attribute, `name`, which can be used to assign a unique ID to different slots so you can determine where content should be rendered:

```kdu-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

A `<slot>` outlet without `name` implicitly has the name "default".

In a parent component using `<BaseLayout>`, we need a way to pass multiple slot content fragments, each targeting a different slot outlet. This is where **named slots** come in.

To pass a named slot, we need to use a `<template>` element with the `k-slot` directive, and then pass the name of the slot as an argument to `k-slot`:

```kdu-html
<BaseLayout>
  <template k-slot:header>
    <!-- content for the header slot -->
  </template>
</BaseLayout>
```

`k-slot` has a dedicated shorthand `#`, so `<template k-slot:header>` can be shortened to just `<template #header>`. Think of it as "render this template fragment in the child component's 'header' slot".

![named slots diagram](./images/named-slots.png)

Here's the code passing content for all three slots to `<BaseLayout>` using the shorthand syntax:

```kdu-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

When a component accepts both a default slot and named slots, all top-level non-`<template>` nodes are implicitly treated as content for the default slot. So the above can also be written as:

```kdu-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- implicit default slot -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

Now everything inside the `<template>` elements will be passed to the corresponding slots. The final rendered HTML will be:

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp9Usty2zAM/BUMffClkpqLp6OqnklPPfQTeKEpyGIqPoaEmtf43wNKdiw5kxyxu8ASWL6K+xDKf+0oatEkHU0gSEhj2EtnbPCR4LdK+Fc9+5Ggi97CtqyuUG7dStdUcy93cUFow6AIuQJoruKpZuTCw6ZH1WI848z0d/s/GBGsOfYEBwQFQR0RyNCATcX0eUS18PgwtcVOjcPFjqmwv+c5UR2jCj10PgL1bKKMA+0doaOyqfLKV71rQTnPsgje4YL+2rrznpYLhWmfbYLkLU5mShMY1/lPJuZydbEFK76JOZPCqlA+JO84tdfcI89EkqKGCckYZ5NrKXqikOqqYuAhFanT5SMeShVCRso4OjIWS0y2OET/mDDycCnymJN0J7ZdB57/yvrJrfkPelAp/ZJiWtI4jFJcFryNOQ2ewCmLLJ851vIfYvj9JqueJme17r/VLxTNbQpLv5n76LfoaSreZ3366V8neh7mhWfx5dIHH/mpBflQw1144qwH08JGa/1zFmg/+FjDZrfbnZGOj1Qk84I1fC9/oJ1gPjY/ajIRpzdbFCxs)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp9U8tu2zAQ/JUFffClkpqLUaiqgfTUQz+BF5paWUzFB8h180L+PStKtiUHCaDLzg53ODvUq7gPofzXnkQtmqSjCbSXztjgI8FvlfCvevYngi56C9uyukLjoa10ANLhU6a32KnTQPA6otrzDIeOUj0BsBg31m/S8ddUF1EuCG0YFCFXAM2Vn2tGzn3Y9KhajDPOnf5u/wcjgjXHnuCAoCCoIwIZGrCpuD2PqBYaH6bODq5jw/6e50R1jCr00PkI1LOIMo4NOmJ7ZVOFFd+1oJxnWgT2v2h/Ld15T0tDIfvZJkjeYhZTmsC4zn8ycSxXG1t0xTcxRVpYFcqH5B3HnVORcyNJcclJCo52rKXoiUKqq4qBh1SkTpePeChVCCNSxpMjY7HEZItD9I8JIw+X4hwvy67fy/jI1lduzX/Qg0rplxTZpHEYpTgbvI05DZ7AKYtMn3rM5TfE8GUnqzPNmNX6/C1/wWhuU1jqTb2PeoszTcV+1qvP7zrR8zAZnsjnTR985KsW5EMNd+GJsx5MCxut9c+JoP3gYw2b3W43Ix0vqUjmBWv4Xv5Am+HpR8oi4u0dpaFAZw==)

</div>

Again, it may help you understand named slots better using the JavaScript function analogy:

```js
// passing multiple slot fragments with different names
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// <BaseLayout> renders them in different places
function BaseLayout(slots) {
  return (
    `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
  )
}
```

## Dynamic Slot Names

[Dynamic directive arguments](/guide/essentials/template-syntax.md#dynamic-arguments) also work on `k-slot`, allowing the definition of dynamic slot names:

```kdu-html
<base-layout>
  <template k-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- with shorthand -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

Do note the expression is subject to the [syntax constraints](/guide/essentials/template-syntax.html#directives) of dynamic directive arguments.

## Scoped Slots

As discussed in [Render Scope](#render-scope), slot content does not have access to state in the child component.

However, there are cases where it could be useful if a slot's content can make use of data from both the parent scope and the child scope. To achieve that, we need a way for the child to pass data to a slot when rendering it.

In fact, we can do exactly that - we can pass attributes to a slot outlet just like passing props to a component:

```kdu-html
<!-- <MyComponent> template -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

Receiving the slot props is a bit different when using a single default slot vs. using named slots. We are going to show how to receive props using a single default slot first, by using `k-slot` directly on the child component tag:

```kdu-html
<MyComponent k-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![scoped slots diagram](./images/scoped-slots.svg)

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp9kc9qwzAMxl9F+NLL4rBrSAdj58IewJc0VdO08R8sZd0IfvfJSSlZGT3Z+ix9kn6e1HsI+nIYVaVqamMfGAh5DG/G9Tb4yLD7+fByc+gYjtFb2OhypeXijXF1uVRLnQSMNgwNY464XjtcCho8b43Kx2f0gYySLADD0wR3UTN+M6QEf8TWj2KRUs6v10OIQ13em6oXtcxe2CboM3kn201zk9uDNK1gVrImG+TYqBNzoKosRThTQcdWX3GvmxCyoqM07y1qJFvso78SRjE3KtvISEnaPnD5B2rrHTF0EZF71+2QqOkQtrA54TD4ZyBl5UP/dWNVZyhQZUrC8sHOKKhmVPL0KnjFUrKXvygXjzWt9AsDm7gs)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFkdFqhDAQRX9lyMu2UCN9FVsofV7oB+Qlq6PrriYhGbtbxH/vRFdxl0JBMHOT3Js5M4gP5+S57EUm8lD4xtG7Mk3nrCfY/3xaXhk0BJW3HexkutHitZ0yAMrgdbpQYqX7lmCIarGcC9kswNYwCqMy/OXpmssFYedaTRgryrcvOCehtfSmRPx9eeuCEnyK42kYYBUl4ZVgHOFOLGzPFiPHAeTbJtghT9dQ8SLm3pNOO3kK1jCX6fHqtsGhaztKMIFYK3EkciFLUxZOIQlVIS94kNq5qEjP4U2HEkOXHLy9BPRsrsQCgWMfuN6N4y+6pSb99Ly8xCP13iwVQO0RqTH1HkPQNWawO2Lb2mlaU+S/8BlT2Xzf+OYRJGSRLPN/MFcCsgkvb73ySNiST8/zS2ePLeHxF7OR3GI=)

</div>

The props passed to the slot by the child are available as the value of the corresponding `k-slot` directive, which can be accessed by expressions inside the slot.

You can think of a scoped slot as a function being passed into the child component. The child component then calls it, passing props as arguments:

```js
MyComponent({
  // passing the default slot, but as a function
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return (
    `<div>${
      // call the slot function with props!
      slots.default({ text: greetingMessage, count: 1 })
    }</div>`
  )
}
```

In fact, this is very close to how scoped slots are compiled, and how you would use scoped slots in manual [render functions](/guide/extras/render-function.html).

Notice how `k-slot="slotProps"` matches the slot function signature. Just like with function arguments, we can use destructuring in `k-slot`:

```kdu-html
<MyComponent k-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### Named Scoped Slots

Named scoped slots work similarly - slot props are accessible as the value of the `k-slot` directive: `k-slot:name="slotProps"`. When using the shorthand, it looks like this:

```kdu-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

Passing props to a named slot:

```kdu-html
<slot name="header" message="hello"></slot>
```

Note the `name` of a slot won't be included in the props because it is reserved - so the resulting `headerProps` would be `{ message: 'hello' }`.


### Fancy List Example

You may be wondering what would be a good use case for scoped slots. Here's an example: imagine a `<FancyList>` component that renders a list of items - it may encapsulate the logic for loading remote data, using the data to display a list, or even advanced features like pagination or infinite scrolling. However, we want it to be flexible with how each item looks and leave the styling of each item to the parent component consuming it. So the desired usage may look like this:

```kdu-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

Inside `<FancyList>`, we can render the same `<slot>` multiple times with different item data (notice we are using `k-bind` to pass an object as slot props):

```kdu-html
<ul>
  <li k-for="item in items">
    <slot name="item" k-bind="item"></slot>
  </li>
</ul>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFU9tu2zAM/RXOxZAUiO30touXBhgwbAVaDAPat7oPik07amxJkOR2WeZ/H+VbnN36EoSkzxF5eLjzPioVbNLKi7yFSTRXFgzaSi1jwUsltYXPTCTbG24sZFqWMAnCIeOAk1gswhZJGAoslqpgFikCWOzREVPcr3RxGXv0G3sQKdS+YjlS5mQeew2AID0BHHH6S8UdrGS6nUFlUAtW4gwKvkED9YAhVMqfICmYMQRwuFGNqmq5a1mgrhehm25fGmAlWkaw1Rbo4/4xAsBPl+jerNs/Y5JFSI/33YeH8+/FovigSKGx2wLBJFJhSpnANQA7h8uksL7hPzCCefAOyw8umchC6giO5mfsfXZOqbrR3pEsvZnX7ssvmQoejRS00YaK5GgKJvailtzlaHMujr21tcpEYUiJR+ObLAmecRUwpVwm0JWwvMQATemvtHwmUYg89mYjnpCST7RKjSJFjfol3t8+/4PbUdNkNY104LR/W3QHGjOoO4O2poxFIgXZTmmpDFxCihkX+M1F0/tJ58XJDCa9CycPx3uUc5BDEe/0vi2EIZQy2VCqlGTOlNGuMrTJmos8FtTRHQklKzudHsPlslW6oQmeWFEhkd23orVGjGBy2ywebgtpDXypeIrUT+87qn+9/lRtKdUYLoLTOdSke2xHFNdpBXeVlZozN8wIfMXWDK74mu8JTojAtfBA4s4oms9psP8db1X0ri44bHye0ZG8amcqUOR2PTqyG8lSUiIIgv4QCn6AzqTuThO4aJUZ368hFcD1PtwvYVZcpEMcDifWMS/CpsEXrgqgKnrfF2Qlv6n7dqtIJiEFNrcFoFjqBojgQn3vUiuWbHItK5FGBBXItJ9rGhOFnZ6dXKSYz/prhNOL1xS8OX+LWXbc4ButafTu7TE/7XJ4pGQ658Jt56/vHmVZ1tMNx17/AtNl4Ew=)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqNVNtu2zAM/RXOxZAWiO30touXBhgwbAVa7KV9q/ug2HSixpYESW6bZfn3UXLkJF2BFjAMk9Q5FMlDr6LvSiWLso2yaGwKzZWd5II3SmoLP5koltfcWKi0bGCQpL3HQQa5AMgFPvvDJVasrS2snLeQxCBQWJN1DtiSOXOdC3rGaZ+RDIuNqplFsgDG29xM8bjV9UUe0TuPIFOoY8VmSJ7jUR7584QIeDjg9EnBFUxluRxCa1AL1uAQar5AQ8kDhlAlf4SiZsYQwOF2YhRVk1XHAuv1OFV7oR7WoGUEmy6BDodkBIC/zrHJue4+dknGKSUPt0/3y992muy9IJnGLmsEU0iFJXkSd4GuzZUUNjb8D2YwSr5g860bRi11BgejU/a1OiNX13pHMomGUTfsuGEqeTBSkBA8FbXDB0we9TPMIxq7s/Nobq0yWZqS48HEpiqSJ5wmTCnnSXQrLG8wQdPEUy2fqClEnkfDHZ6UnI80So2iRI36Ld4Xx//jDrqikvZkuqfs18SqtKSUcDfYKG0whEHQ2ODeX7lklh0ehTZotK0WwQJwunEE952DLkEvj2skNQLLLTRNyVcsiKKRJFXHCxXaYs7FrDth0N5S62RrDwl2MdmmsXNuEp8LLuBuK8VOoRkMbrwi4KaW1sCvlpdIpQRBUvz31Y92SS6vxAxORptbvqC5Klu4ba3UnLle7BBcsjmDSz7nW5JjIgkcof4heUejo/cteluHFag5LGJe0UZ98FUmNYqZne9s5LVkJTUqSZKwNTXfQ1dSb/YYuOjmsrvshjoDrpZ+2Qkz5aLs7bTfxw3zOPUXfGMFAdo6DKom3cU+HtulorYJ+hP6RSSpsdIVkMG5et64pqxYzDTppMwIKpDpeKapTPp5Hp4en5c4G4bVhZPzj2R8OvuMVXXk8b73VPom9y4/zbdP0jA948JN69W8B1VVBbr+z7D+B7rT+FI=)

</div>

### Renderless Components

The `<FancyList>` use case we discussed above encapsulates both reusable logic (data fetching, pagination etc.) and visual output, while delegating part of the visual output to the consumer component via scoped slots.

If we push this concept a bit further, we can come up with components that only encapsulate logic and do not render anything by themselves - visual output is fully delegated to the consumer component with scoped slots. We call this type of component a **Renderless Component**.

An example renderless component could be one that encapsulates the logic of tracking the current mouse position:

```kdu-html
<MouseTracker k-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqNUk1rwzAM/SvCl6SQODuHrLDDbtttgw18SRN3S1t/YCtNQsh/n5y0pS0UdjBYT9LT00Mje7GW7+uW5azwlWssgpfY2rXQjbLGIbyb1ssPV1Z76WDrjIKIZ9dgaI+ELrKlnzopQKnsoUQZIixuOPapPxh8FmyEPoEBJsGoCkDgXAaNhxJzGCkN05SEDxVNM9HNYOoqsssglrBFcapKy3feaNppnIlPCS8Y0QYkYKQ6xIL9IlqfZxkBO5/6bcU7ueGltQHhrtXYKMmlV+nGmc7TwjtiCjSkaaKx92Y89nIEJ7cJGE0tGmUdvp9aLQFMJ3sXP0mjroz2SDY8h774aXVGhivkjLW2JhsoQW+9rNnzY3loZ4zb8kd+BXC4A79picByERXHq8DQNbo2HS/r+vUoNb41HqWWLo5IrpfKHGWUnIauSMbVIrcEbq79F8fDEwIows1A3tPZ9IJBPtBnECy7u4HpD/g2+yc=)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqVUk1vgzAM/StWLm0lGnZGdNIOu223HTYpl7S4K21JosS0oIr/PgODju5DmoSQ/Wy/Zzu+iAfn5CErRSLSsPG5o3tl8sJZT/Bsy4AvXm8O6GHrbQEzGX8F28KZMgDKYNWVZLjV5ZHg0qIbyzwGDYWkB2BC2SKNMvyl8SjNDmHhjpqw9SidNHFYhqOllRIXqCKouVxwFutTlwZ5AE0sxmFomqg1OIkVmGjSOVel8SgkItGPvCy0k/tgDa+j61h9BoIS4wxK8Nitr8SOyIUkjhnYh2XYbuQZ11I71yLSl4byAiWGYrn29hx4Y3tmGgZn2dttTp7hp51mmvR8MbTikUpvBg+gSuAuGpyand5mMf51gQJpZ7Prg5SOGXGOIyUA7fIgK1gBSqff8XWC1yP+9p3b8sCYXds75yazZ6mz7PHEZ/CUB0KDfj7jzICFPeEs6mn7NhZXrtL8xua7wv8Q/n1jAGl7VJBUfFeVEpDUbNRKxDdH0nwAcIsSuw==)

</div>

While an interesting pattern, most of what can be achieved with Renderless Components can be achieved in a more efficient fashion with Composition API, without incurring the overhead of extra component nesting. Later, we will see how we can implement the same mouse tracking functionality as a [Composable](/guide/reusability/composables.html).

That said, scoped slots are still useful in cases where we need to both encapsulate logic **and** compose visual output, like in the `<FancyList>` example.
