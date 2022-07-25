# Reactivity API: Advanced

## shallowRef()

Shallow version of [`ref()`](./reactivity-core.html#ref).

- **Type**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Details**

  Unlike `ref()`, the inner value of a shallow ref is stored and exposed as-is, and will not be made deeply reactive. Only the `.value` access is reactive.

  `shallowRef()` is typically used for performance optimizations of large data structures, or integration with external state management systems.

- **Example**

  ```js
  const state = shallowRef({ count: 1 })

  // does NOT trigger change
  state.value.count = 2

  // does trigger change
  state.value = { count: 2 }
  ```

- **See also:**
  - [Guide - Reduce Reactivity Overhead for Large Immutable Structures](/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)
  - [Guide - Integration with External State Systems](/guide/extras/reactivity-in-depth.html#integration-with-external-state-systems)

## triggerRef()

Force trigger effects that depends on a [shallow ref](#shallowref). This is typically used after making deep mutations to the inner value of a shallow ref.

- **Type**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Example**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // Logs "Hello, world" once for the first run-through
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // This won't trigger the effect because the ref is shallow
  shallow.value.greet = 'Hello, universe'

  // Logs "Hello, universe"
  triggerRef(shallow)
  ```

## customRef()

Creates a customized ref with explicit control over its dependency tracking and updates triggering.

- **Type**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **Details**

  `customRef()` expects a factory function, which receives `track` and `trigger` functions as arguments and should return an object with `get` and `set` methods.

  In general, `track()` should be called inside `get()`, and `trigger()` should be called inside `set()`. However, you have full control over when they should be called, or whether they should be called at all.

- **Example**

  Creating a debounced ref that only updates the value after a certain timeout after the latest set call:

  ```js
  import { customRef } from 'kdu'
  
  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  Usage in component:

  ```kdu
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input k-model="text" />
  </template>
  ```

  [Try it in the Playground](https://kdujs-sfc.web.app/#eNplUsFuozAQ/ZWRL1CJQLrHKKm00n7BqtqTLwSGhAZsyx43jZD/fQcwlLa+wLwZv3kzz4P4bUx+q704iKOrbGsIHJI3L1K1vdGWYADv8A+etVcV1n+xgQCN1T0keVFv4PzNJVJVWjkCwg+C0/eLaXLFrtNJBs/7/f5JqmMxt+RmHBD2pisJOQI4jgqAz+u1dTOfVt0DvKm5xMEzy+ReNZQNoYWH9sk7giNtDNZAD9Oqy2EiKmYmJhyGmSiEFWyV8QS3Xa9r7E5SjHkpoODssVgFiUzMy9j1peE5teJ1DSOBjAknxQEmZMR4n2MsxZXIuENRMPDmdq6p8jue89KYEcmtV9T2mKPrd2er7w4tk0sx0gSpArf9tmBuu7pSeZ623/rBnOyAVPgxlTR8kVqtftjwXnYeM+CJywe79Iu9mLV3yNaxIu1pDC0/BKs+G6Up2bK6ZUC2vVzQPsHpZRk61sYI4IKURtb5TFdTNn0B4o1JzIKGbPnjR5gqvP8bs194qg5L+zqLTKPYDWtEeCxmWMpYyafS+UxtuWrpsc3F8bZiQ1zXCrE/6ycwGkT4D771E3A=)

## shallowReactive()

Shallow version of [`reactive()`](./reactivity-core.html#reactive).

- **Type**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Details**

  Unlike `reactive()`, there is no deep conversion: only root-level properties are reactive for a shallow reactive object. Property values are stored and exposed as-is - this also means properties with ref values will **not** be automatically unwrapped.

  :::warning Use with Caution
  Shallow data structures should only be used for root level state in a component. Avoid nesting it inside a deep reactive object as it creates a tree with inconsistent reactivity behavior which can be difficult to understand and debug.
  :::

- **Example**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // mutating state's own properties is reactive
  state.foo++

  // ...but does not convert nested objects
  isReactive(state.nested) // false

  // NOT reactive
  state.nested.bar++
  ```

## shallowReadonly()

Shallow version of [`readonly()`](./reactivity-core.html#readonly).

- **Type**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Details**

  Unlike `readonly()`, there is no deep conversion: only root-level properties are made readonly. Property values are stored and exposed as-is - this also means properties with ref values will **not** be automatically unwrapped.

  :::warning Use with Caution
  Shallow data structures should only be used for root level state in a component. Avoid nesting it inside a deep reactive object as it creates a tree with inconsistent reactivity behavior which can be difficult to understand and debug.
  :::

- **Example**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // mutating state's own properties will fail
  state.foo++

  // ...but works on nested objects
  isReadonly(state.nested) // false

  // works
  state.nested.bar++
  ```

## toRaw()

Returns the raw, original object of a Kdu-created proxy.

- **Type**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **Details**

  `toRaw()` can return the original object from proxies created by [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core.html#readonly), [`shallowReactive()`](#shallowreactive) or [`shallowReadonly()`](#shallowreadonly).

  This is an escape hatch that can be used to temporarily read without incurring proxy access / tracking overhead or write without triggering changes. It is **not** recommended to hold a persistent reference to the original object. Use with caution.

- **Example**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw()

Marks an object so that it will never be converted to a proxy. Returns the object itself.

- **Type**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Example**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // also works when nested inside other reactive objects
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning Use with Caution
  `markRaw()` and shallow APIs such as `shallowReactive()` allow you to selectively opt-out of the default deep reactive/readonly conversion and embed raw, non-proxied objects in your state graph. They can be used for various reasons:

  - Some values simply should not be made reactive, for example a complex 3rd party class instance, or a Kdu component object.

  - Skipping proxy conversion can provide performance improvements when rendering large lists with immutable data sources.

  They are considered advanced because the raw opt-out is only at the root level, so if you set a nested, non-marked raw object into a reactive object and then access it again, you get the proxied version back. This can lead to **identity hazards** - i.e. performing an operation that relies on object identity but using both the raw and the proxied version of the same object:

  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // although `foo` is marked as raw, foo.nested is not.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Identity hazards are in general rare. However, to properly utilize these APIs while safely avoiding identity hazards requires a solid understanding of how the reactivity system works.

  :::

## effectScope()

Creates an effect scope object which can capture the reactive effects (i.e. computed and watchers) created within it so that these effects can be disposed together.

- **Type**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // undefined if scope is inactive
    stop(): void
  }
  ```

- **Example**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
  })

  // to dispose all effects in the scope
  scope.stop()
  ```

## getCurrentScope()

Returns the current active [effect scope](#effectscope) if there is one.

- **Type**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose()

Registers a dispose callback on the current active [effect scope](#effectscope). The callback will be invoked when the associated effect scope is stopped.

This method can be used as a non-component-coupled replacement of `onUnmounted` in reusable composition functions, since each Kdu component's `setup()` function is also invoked in an effect scope.

- **Type**

  ```ts
  function onScopeDispose(fn: () => void): void
  ```
