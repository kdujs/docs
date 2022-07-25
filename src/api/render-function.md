# Render Function APIs

## h()

Creates virtual DOM nodes.

- **Type**

  ```ts
  // full signature
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): KNode

  // omitting props
  function h(type: string | Component, children?: Children | Slot): KNode

  type Children = string | number | boolean | KNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Types are simplified for readability.

- **Details**

  The first argument can either be a string (for native elements) or a Kdu component definition. The second argument is the props to be passed, and the third argument is the children.

  When creating a component knode, the children must be passed as slot functions. A single slot function can be passed if the component expects only the default slot. Otherwise, the slots must be passed as an object of slot functions.

  For convenience, the props argument can be omitted when the children is not a slots object.

- **Example**

  Creating native elements:

  ```js
  import { h } from 'kdu'

  // all arguments except the type are optional
  h('div')
  h('div', { id: 'foo' })

  // both attributes and properties can be used in props
  // Kdu automatically picks the right way to assign it
  h('div', { class: 'bar', innerHTML: 'hello' })

  // class and style have the same object / array
  // value support like in templates
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // event listeners should be passed as onXxx
  h('div', { onClick: () => {} })

  // children can be a string
  h('div', { id: 'foo' }, 'hello')

  // props can be omitted when there are no props
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // children array can contain mixed knodes and strings
  h('div', ['hello', h('span', 'hello')])
  ```

  Creating components:

  ```js
  import Foo from './Foo.kdu'

  // passing props
  h(Foo, {
    // equivalent of some-prop="hello"
    someProp: 'hello',
    // equivalent of @update="() => {}"
    onUpdate: () => {}
  })

  // passing single default slot
  h(Foo, () => 'default slot')

  // passing named slots
  // notice the `null` is required to avoid
  // slots object being treated as props
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **See also:** [Guide - Render Functions - Creating KNodes](/guide/extras/render-function.html#creating-knodes)

## mergeProps()

Merge multiple props objects with special handling for certain props.

- **Type**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Details**

  `mergeProps()` supports merging multiple props objects with special handling for the following props:

  - `class`
  - `style`
  - `onXxx` event listeners - multiple listeners with the same name will be merged into an array.

  If you do not need the merge behavior and want simple overwrites, native object spread can be used instead.

- **Example**

  ```js
  import { mergeProps } from 'kdu'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneKNode()

Clones a knode.

- **Type**

  ```ts
  function cloneKNode(knode: KNode, extraProps?: object): KNode
  ```

- **Details**

  Returns a cloned knode, optionally with extra props to merge with the original.

  Knodes should be considered immutable once created, and you should not mutate the props of an existing knode. Instead, clone it with different / extra props.

  Knodes have special internal properties, so cloning them is not as simple as an object spread. `cloneKNode()` handles most of the internal logic.

- **Example**

  ```js
  import { h, cloneKNode } from 'kdu'

  const original = h('div')
  const cloned = cloneKNode(original, { id: 'foo' })
  ```

## isKNode()

Checks if a value is a knode.

- **Type**

  ```ts
  function isKNode(value: unknown): boolean
  ```

## resolveComponent()

For manually resolving a registered component by name.

- **Type**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Details**

  **Note: you do not need this if you can import the component directly.**

  `resolveComponent()` must be called inside<span class="composition-api"> either `setup()` or</span> the render function in order to resolve from the correct component context.

  If the component is not found, a runtime warning will be emitted, and the name string is returned.

- **Example**

  <div class="composition-api">

  ```js
  const { h, resolveComponent } = Kdu

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  const { h, resolveComponent } = Kdu

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **See also:** [Guide - Render Functions - Components](/guide/extras/render-function.html#components)

## resolveDirective()

For manually resolving a registered directive by name.

- **Type**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Details**

  **Note: you do not need this if you can import the component directly.**

  `resolveDirective()` must be called inside<span class="composition-api"> either `setup()` or</span> the render function in order to resolve from the correct component context.

  If the directive is not found, a runtime warning will be emitted, and the function returns `undefined`.

- **See also:** [Guide - Render Functions - Custom Directives](/guide/extras/render-function.html#custom-directives)

## withDirectives()

For adding custom directives to knodes.

- **Type**

  ```ts
  function withDirectives(
    knode: KNode,
    directives: DirectiveArguments
  ): KNode

  // [Directive, value, argument, modifiers]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Details**

  Wraps an existing knode with custom directives. The second argument is an array of custom directives. Each custom directive is also represented as an array in the form of `[Directive, value, argument, modifiers]`. Tailing elements of the array can be omitted if not needed.

- **Example**

  ```js
  import { h, withDirectives } from 'kdu'

  // a custom directive
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div k-pin:top.animate="200"></div>
  const knode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **See also:** [Guide - Render Functions - Custom Directives](/guide/extras/render-function.html#custom-directives)

## withModifiers()

For adding built-in [`k-on` modifiers](/guide/essentials/event-handling.html#event-modifiers) to an event handler function.

- **Type**

  ```ts
  function withModifiers(fn: Function, modifiers: string[]): Function
  ```

- **Example**

  ```js
  import { h, withModifiers } from 'kdu'

  const knode = h('button', {
    // equivalent of k-on.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **See also:** [Guide - Render Functions - Event Modifiers](/guide/extras/render-function.html#event-modifiers)
