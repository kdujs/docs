# Built-in Directives

## k-text

Update the element's text content.

- **Expects:** `string`

- **Details**

  `k-text` works by setting the element's [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) property, so it will overwrite any existing content inside the element. If you need to update the part of `textContent`, you should use [mustache interpolations](/guide/essentials/template-syntax.html#text-interpolation) instead.

- **Example**

  ```kdu-html
  <span k-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **See also:** [Template Syntax - Text Interpolation](/guide/essentials/template-syntax.html#text-interpolation)

## k-html

Update the element's [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML).

- **Expects:** `string`

- **Details:**

  Contents of `k-html` are inserted as plain HTML - Kdu template syntax will not be processed. If you find yourself trying to compose templates using `k-html`, try to rethink the solution by using components instead.

  ::: warning Security Note
  Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use `k-html` on trusted content and **never** on user-provided content.
  :::

  In [Single-File Components](/guide/scaling-up/sfc), `scoped` styles will not apply to content inside `k-html`, because that HTML is not processed by Kdu's template compiler. If you want to target `k-html` content with scoped CSS, you can instead use [CSS modules](./sfc-css-features.html#css-modules) or an additional, global `<style>` element with a manual scoping strategy such as BEM.

- **Example:**

  ```kdu-html
  <div k-html="html"></div>
  ```

- **See also:** [Template Syntax - Raw HTML](/guide/essentials/template-syntax.html#raw-html)

## k-show

Toggle the element's visibility based on the truthy-ness of the expression value.

- **Expects:** `any`

- **Details**

  `k-show` works by setting the `display` CSS property via inline styles, and will try to respect the initial `display` value when the element is visible. It also triggers transitions when its condition changes.

- **See also:** [Conditional Rendering - k-show](/guide/essentials/conditional.html#k-show)

## k-if

Conditionally render an element or a template fragment based on the truthy-ness of the expression value.

- **Expects:** `any`

- **Details**

  When a `k-if` element is toggled, the element and its contained directives / components are destroyed and re-constructed. If the initial condition is falsy, then the inner content won't be rendered at all.

  Can be used on `<template>` to denote a conditional block containing only text or multiple elements.

  This directive triggers transitions when its condition changes.

  When used together, `k-if` has a higher priority than `k-for`. We don't recommend using these two directives together on one element — see the [list rendering guide](/guide/essentials/list.html#k-for-with-k-if) for details.

- **See also:** [Conditional Rendering - k-if](/guide/essentials/conditional.html#k-if)

## k-else

Denote the "else block" for `k-if` or a `k-if` / `k-else-if` chain.

- **Does not expect expression**

- **Details**

  - Restriction: previous sibling element must have `k-if` or `k-else-if`.

  - Can be used on `<template>` to denote a conditional block containing only text or multiple elements.

- **Example**

  ```kdu-html
  <div k-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div k-else>
    Now you don't
  </div>
  ```

- **See also:** [Conditional Rendering - k-else](/guide/essentials/conditional.html#k-else)

## k-else-if

Denote the "else if block" for `k-if`. Can be chained.

- **Expects:** `any`

- **Details**

  - Restriction: previous sibling element must have `k-if` or `k-else-if`.

  - Can be used on `<template>` to denote a conditional block containing only text or multiple elements.

- **Example**

  ```kdu-html
  <div k-if="type === 'A'">
    A
  </div>
  <div k-else-if="type === 'B'">
    B
  </div>
  <div k-else-if="type === 'C'">
    C
  </div>
  <div k-else>
    Not A/B/C
  </div>
  ```

- **See also:** [Conditional Rendering - k-else-if](/guide/essentials/conditional.html#k-else-if)

## k-for

Render the element or template block multiple times based on the source data.

- **Expects:** `Array | Object | number | string | Iterable`

- **Details**

  The directive's value must use the special syntax `alias in expression` to provide an alias for the current element being iterated on:

  ```kdu-html
  <div k-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternatively, you can also specify an alias for the index (or the key if used on an Object):

  ```kdu-html
  <div k-for="(item, index) in items"></div>
  <div k-for="(value, key) in object"></div>
  <div k-for="(value, name, index) in object"></div>
  ```

  The default behavior of `k-for` will try to patch the elements in-place without moving them. To force it to reorder elements, you should provide an ordering hint with the `key` special attribute:

  ```kdu-html
  <div k-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `k-for` can also work on values that implement the [Iterable Protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol), including native `Map` and `Set`.

- **See also:**
  - [List Rendering](/guide/essentials/list.html)

## k-on

Attach an event listener to the element.

- **Shorthand:** `@`

- **Expects:** `Function | Inline Statement | Object (without argument)`

- **Argument:** `event` (optional if using Object syntax)

- **Modifiers:**

  - `.stop` - call `event.stopPropagation()`.
  - `.prevent` - call `event.preventDefault()`.
  - `.capture` - add event listener in capture mode.
  - `.self` - only trigger handler if event was dispatched from this element.
  - `.{keyAlias}` - only trigger handler on certain keys.
  - `.once` - trigger handler at most once.
  - `.left` - only trigger handler for left button mouse events.
  - `.right` - only trigger handler for right button mouse events.
  - `.middle` - only trigger handler for middle button mouse events.
  - `.passive` - attaches a DOM event with `{ passive: true }`.

- **Details**

  The event type is denoted by the argument. The expression can be a method name, an inline statement, or omitted if there are modifiers present.

  When used on a normal element, it listens to [**native DOM events**](https://developer.mozilla.org/en-US/docs/Web/Events) only. When used on a custom element component, it listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `k-on:click="handle('ok', $event)"`.

  `k-on` also supports binding to an object of event / listener pairs without an argument. Note when using the object syntax, it does not support any modifiers.

- **Example:**

  ```kdu-html
  <!-- method handler -->
  <button k-on:click="doThis"></button>

  <!-- dynamic event -->
  <button k-on:[event]="doThis"></button>

  <!-- inline statement -->
  <button k-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- shorthand dynamic event -->
  <button @[event]="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- the click event will be triggered at most once -->
  <button k-on:click.once="doThis"></button>

  <!-- object syntax -->
  <button k-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Listening to custom events on a child component (the handler is called when "my-event" is emitted on the child):

  ```kdu-html
  <MyComponent @my-event="handleThis" />

  <!-- inline statement -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **See also:**
  - [Event Handling](/guide/essentials/event-handling.html)
  - [Components - Custom Events](/guide/essentials/component-basics.html#listening-to-events)

## k-bind

Dynamically bind one or more attributes, or a component prop to an expression.

- **Shorthand:** `:` or `.` (when using `.prop` modifier)

- **Expects:** `any (with argument) | Object (without argument)`

- **Argument:** `attrOrProp (optional)`

- **Modifiers:**

  - `.camel` - transform the kebab-case attribute name into camelCase.
  - `.prop` - force a binding to be set as a DOM property. <sup class="kt-badge">3.2+</sup>
  - `.attr` - force a binding to be set as a DOM attribute. <sup class="kt-badge">3.2+</sup>

- **Usage:**

  When used to bind the `class` or `style` attribute, `k-bind` supports additional value types such as Array or Objects. See linked guide section below for more details.

  When setting a binding on an element, Kdu by default checks whether the element has the key defined as a property using an `in` operator check. If the property is defined, Kdu will set the value as a DOM property instead of an attribute. This should work in most cases, but you can override this behavior by explicitly using `.prop` or `.attr` modifiers. This is sometimes necessary, especially when [working with custom elements](/guide/extras/web-components.html#passing-dom-properties).

  When used for component prop binding, the prop must be properly declared in the child component.

  When used without an argument, can be used to bind an object containing attribute name-value pairs. Note in this mode `class` and `style` does not support Array or Objects.

- **Example:**

  ```kdu-html
  <!-- bind an attribute -->
  <img k-bind:src="imageSrc" />

  <!-- dynamic attribute name -->
  <button k-bind:[key]="value"></button>

  <!-- shorthand -->
  <img :src="imageSrc" />

  <!-- shorthand dynamic attribute name -->
  <button :[key]="value"></button>

  <!-- with inline string concatenation -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div k-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop binding. "prop" must be declared in the child component. -->
  <MyComponent :prop="someThing" />

  <!-- pass down parent props in common with a child component -->
  <MyComponent k-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  The `.prop` modifier also has a dedicated shorthand, `.`:

  ```kdu-html
  <div :someProperty.prop="someObject"></div>

  <!-- equivalent to -->
  <div .someProperty="someObject"></div>
  ```

  The `.camel` modifier allows camelizing a `k-bind` attribute name when using in-DOM templates, e.g. the SVG `viewBox` attribute:

  ```kdu-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` is not needed if you are using string templates, or pre-compiling the template with a build step.

- **See also:**
  - [Class and Style Bindings](/guide/essentials/class-and-style.html)
  - [Components - Prop Passing Details](/guide/components/props.html#prop-passing-details)

## k-model

Create a two-way binding on a form input element or a component.

- **Expects:** varies based on value of form inputs element or output of components

- **Limited to:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **Modifiers:**

  - [`.lazy`](/guide/essentials/forms.html#lazy) - listen to `change` events instead of `input`
  - [`.number`](/guide/essentials/forms.html#number) - cast valid input string to numbers
  - [`.trim`](/guide/essentials/forms.html#trim) - trim input

- **See also:**

  - [Form Input Bindings](/guide/essentials/forms.html)
  - [Component Events - Usage with `k-model`](/guide/components/events.html#usage-with-k-model)

## k-slot

Denote named slots or slots that expect to receive props.

- **Shorthand:** `#`

- **Expects:** JavaScript expression that is valid in a function argument position, including support for destructuring. Optional - only needed if expecting props to be passed to the slot.

- **Argument:** slot name (optional, defaults to `default`)

- **Limited to:**

  - `<template>`
  - [components](/guide/components/slots.html#scoped-slots) (for a lone default slot with props)

- **Example:**

  ```kdu-html
  <!-- Named slots -->
  <BaseLayout>
    <template k-slot:header>
      Header content
    </template>

    <template k-slot:default>
      Default slot content
    </template>

    <template k-slot:footer>
      Footer content
    </template>
  </BaseLayout>

  <!-- Named slot that receives props -->
  <InfiniteScroll>
    <template k-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- Default slot that receive props, with destructuring -->
  <Mouse k-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **See also:**
  - [Components - Slots](/guide/components/slots.html)

## k-pre

Skip compilation for this element and all its children.

- **Does not expect expression**

- **Details**

  Inside the element with `k-pre`, all Kdu template syntax will be preserved and rendered as-is. The most common use case of this is displaying raw mustache tags.

- **Example:**

  ```kdu-html
  <span k-pre>{{ this will not be compiled }}</span>
  ```

## k-once

Render the element and component once only, and skip future updates.

- **Does not expect expression**

- **Details**

  On subsequent re-renders, the element/component and all its children will be treated as static content and skipped. This can be used to optimize update performance.

  ```kdu-html
  <!-- single element -->
  <span k-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div k-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <MyComponent k-once :comment="msg"></MyComponent>
  <!-- `k-for` directive -->
  <ul>
    <li k-for="i in list" k-once>{{i}}</li>
  </ul>
  ```

  Since 3.2, you can also memoize part of the template with invalidation conditions using [`k-memo`](#k-memo).

- **See also:**
  - [Data Binding Syntax - interpolations](/guide/essentials/template-syntax.html#text-interpolation)
  - [k-memo](#k-memo)

## k-memo <sup class="kt-badge" data-text="3.2+" />

- **Expects:** `any[]`

- **Details**

  Memoize a sub-tree of the template. Can be used on both elements and components. The directive expects a fixed-length array of dependency values to compare for the memoization. If every value in the array was the same as last render, then updates for the entire sub-tree will be skipped. For example:

  ```kdu-html
  <div k-memo="[valueA, valueB]">
    ...
  </div>
  ```

  When the component re-renders, if both `valueA` and `valueB` remain the same, all updates for this `<div>` and its children will be skipped. In fact, even the Virtual DOM KNode creation will also be skipped since the memoized copy of the sub-tree can be reused.

  It is important to specify the memoization array correctly, otherwise we may skip updates that should indeed be applied. `k-memo` with an empty dependency array (`k-memo="[]"`) would be functionally equivalent to `k-once`.

  **Usage with `k-for`**

  `k-memo` is provided solely for micro optimizations in performance-critical scenarios and should be rarely needed. The most common case where this may prove helpful is when rendering large `k-for` lists (where `length > 1000`):

  ```kdu-html
  <div k-for="item in list" :key="item.id" k-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  When the component's `selected` state changes, a large amount of KNodes will be created even though most of the items remained exactly the same. The `k-memo` usage here is essentially saying "only update this item if it went from non-selected to selected, or the other way around". This allows every unaffected item to reuse its previous KNode and skip diffing entirely. Note we don't need to include `item.id` in the memo dependency array here since Kdu automatically infers it from the item's `:key`.

  :::warning
  When using `k-memo` with `k-for`, make sure they are used on the same element. **`k-memo` does not work inside `k-for`.**
  :::

  `k-memo` can also be used on components to manually prevent unwanted updates in certain edge cases where the child component update check has been de-optimized. But again, it is the developer's responsibility to specify correct dependency arrays to avoid skipping necessary updates.

- **See also:**
  - [k-once](#k-once)

## k-cloak

Used to hide un-compiled template until it is ready.

- **Does not expect expression**

- **Details**

  **This directive is only needed in no-build-step setups.**

  When using in-DOM templates, there can be a "flash of un-compiled templates": the user may see raw mustache tags until the mounted component replaces them with rendered content.

  `k-cloak` will remain on the element until the associated component instance is mounted. Combined with CSS rules such as `[k-cloak] { display: none }`, it can be used to hide the raw templates until the component is ready.

- **Example:**

  ```css
  [k-cloak] {
    display: none;
  }
  ```

  ```kdu-html
  <div k-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.
