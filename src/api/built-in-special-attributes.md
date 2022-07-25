# Built-in Special Attributes

## key

The `key` special attribute is primarily used as a hint for Kdu's virtual DOM algorithm to identify knodes when diffing the new list of nodes against the old list.

- **Expects:** `number | string | symbol`

- **Details**

  Without keys, Kdu uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible. With keys, it will reorder elements based on the order change of keys, and elements with keys that are no longer present will always be removed / destroyed.

  Children of the same common parent must have **unique keys**. Duplicate keys will cause render errors.

  The most common use case is combined with `k-for`:

  ```kdu-html
  <ul>
    <li k-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  It can also be used to force replacement of an element/component instead of reusing it. This can be useful when you want to:

  - Properly trigger lifecycle hooks of a component
  - Trigger transitions

  For example:

  ```kdu-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  When `text` changes, the `<span>` will always be replaced instead of patched, so a transition will be triggered.

- **See also:** [Guide - List Rendering - Maintaining State with `key`](/guide/essentials/list.html#maintaining-state-with-key)

## ref

Denotes a [template ref](/guide/essentials/template-refs.html).

- **Expects:** `string | Function`

- **Details**

  `ref` is used to register a reference to an element or a child component.

  In Options API, the reference will be registered under the component's `this.$refs` object:

  ```kdu-html
  <!-- stored as this.$refs.p -->
  <p ref="p">hello</p>
  ```

  In Composition API, the reference will be stored in a ref with matching name:

  ```kdu
  <script setup>
  import { ref } from 'kdu'

  const p = ref()
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be the child component instance.

  Alternatively `ref` can accept a function value which provides full control over where to store the reference:

  ```kdu-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you must wait until the component is mounted before accessing them.

  `this.$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **See also:** [Template Refs](/guide/essentials/template-refs.html)

## is

Used for binding [dynamic components](/guide/essentials/component-basics.html#dynamic-components).

- **Expects:** `string | Component`

- **Usage on native elements** <sup class="kt-badge">3.1+</sup>

  When the `is` attribute is used on a native HTML element, it will be interpreted as a [Customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), which is a native web platform feature.

  There is, however, a use case where you may need Kdu to replace a native element with a Kdu component, as explained in [DOM Template Parsing Caveats](/guide/essentials/component-basics.html#dom-template-parsing-caveats). You can prefix the value of the `is` attribute with `kdu:` so that Kdu will render the element as a Kdu component instead:

  ```kdu-html
  <table>
    <tr is="kdu:my-row-component"></tr>
  </table>
  ```

- **See also:**

  - [Built-in Special Element - `<component>`](/api/built-in-special-elements.html#component)
  - [Dynamic Components](/guide/essentials/component-basics.html#dynamic-components)
