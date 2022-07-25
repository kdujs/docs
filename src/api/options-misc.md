# Options: Misc

## name

Explicitly declare a display name for the component.

- **Type**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Details**

  The name of a component is used for the following:

  - Recursive self-reference in the component's own template
  - Display in Kdu DevTools' component inspection tree
  - Display in warning component traces

  When you use Single-File Components, the component already infers its own name from the filename. For example, a file named `MyComponent.kdu` will have the inferred display name "MyComponent".

  Another case is that when a component is registered globally with [`app.component`](/api/application.html#app-component), the global ID is automatically set as its name.

  The `name` option allows you to override the inferred name, or to explicitly provide a name when no name can be inferred (e.g. when not using build tools, or an inlined non-SFC component).

  There is one case where `name` is explicitly necessary: when matching against cacheable components in [`<KeepAlive>`](/guide/built-ins/keep-alive.html) via its `include / exclude` props.

## inheritAttrs

- **Type**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // default: true
  }
  ```

- **Details**

  By default, parent scope attribute bindings that are not recognized as props will "fallthrough". This means that when we have a single-root component, these bindings will be applied to the root element of the child component as normal HTML attributes. When authoring a component that wraps a target element or another component, this may not always be the desired behavior. By setting `inheritAttrs` to `false`, this default behavior can be disabled. The attributes are available via the `$attrs` instance property and can be explicitly bound to a non-root element using `k-bind`.

- **Example**

  <div class="options-api">

  ```kdu
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        k-bind="$attrs"
        k-bind:value="value"
        k-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  When declaring this option in a component that uses `<script setup>`, a separate `<script>` block is necessary:

  ```kdu
  <script>
  export default {
    inheritAttrs: false
  }
  </script>

  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  </script>

  <template>
    <label>
      {{ label }}
      <input
        k-bind="$attrs"
        k-bind:value="value"
        k-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **See also:** [Fallthrough Attributes](/guide/components/attrs.html)

## components

An object that registers components to be made available to the component instance.

- **Type**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Example**

  ```js
  import Foo from './Foo.kdu'
  import Bar from './Bar.kdu'

  export default {
    components: {
      // shorthand
      Foo,
      // register under a different name
      RenamedBar: Bar
    }
  }
  ```

- **See also:** [Component Registration](/guide/components/registration.html)

## directives

An object that registers directives to be made available to the component instance.

- **Type**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Example**

  ```js
  export default {
    directives: {
      // enables k-focus in template
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```kdu-html
  <input k-focus>
  ```

  A hash of directives to be made available to the component instance.

- **See also:** [Custom Directives](/guide/reusability/custom-directives.html)