<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.kdu'
</script>

# KeepAlive

`<KeepAlive>` is a built-in component that allows us to conditionally cache component instances when dynamically switching between multiple components.

## Basic Usage

In the Component Basics chapter, we introduced the syntax for [Dynamic Components](/guide/essentials/component-basics.html#dynamic-components), using the `<component>` special element:

```kdu-html
<component :is="activeComponent" />
```

By default, an active component instance will be unmounted when switched away from. This will cause any changed state it holds to be lost.

In the example below, we have two stateful components - A contains a counter, while B contains a message synced with an input via `k-model`. Try update the state of one of them, switch away, and then switch back to it:

<SwitchComponent />

You'll notice that when switched back, the previous changed state would have been reset.

Creating fresh component instance on switch is normally useful behavior, but in this case, we'd really like the two component instances to be preserved even when they are inactive. To solve this problem, we can wrap our dynamic component with the `<KeepAlive>` built-in component:

```kdu-html
<!-- Inactive components will be cached! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Now, the state will be persisted across component switches:

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqtU8tu2zAQ/BWCF6dwLfYsMELtHIteeuaFluiEMV/gUjYKQ//eJaUqVhIkSJCbODuc5eyOLnQbQnXselpTDm3UIRFQqQ+NcNoGHxO5EHiQxvjzH3UgAzlEb8kKb6xmxp23YTsVKlZOWXJJ2C0Iu4kgXOsdJNL2MSqXyO1Vs5ui9E04zsaX4ZvwkJQNRiaFJ0J4p0+kNRLgVtBOWS9owbFi5F6ZhmsX+kTS36CQEWWnkUKOG+s7ZRCZGiNWn6TpM6m0RYA1ZMvZKPMVmrtRc/dM85dSYWv0aTRUoBbZ3uV51DobmwUbzuba//tsKcAZjgS/OLsaFP1Ox1VsrAzVI3iH+75kupgKIGhNCpIxXE4+C/qQUoCaMQQeYQOHtjqrfSVDyEgVe5e0VZUCu9lHfwYVUVzQLDMIN2DbOQ1vBSy+SNacC48tMBXIuPnxThRCczelaJ5RnTeYW2EZgnRN0UOjl0l5GFAxFwpl36fkHfnZGt0e89wzZ73Gua85G4uvTHbO88csjgYt3E/2VqvP+MM0Xfv7rQDkvSIaismsvrQ4Rvcpq8gov8zS1PAPFB5mGw==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqtU9tu2zAM/RVCL9mQxNqz4RlL+jjsD/Si2EqnRjdIcrrB8L+Pkhy3Lgp0RQsEsUkeHprk4UgOzlWXfiA1aULnpYstM1I76yPcWe0OcPZWw6ai2UrQzQpwXAGOMwCAGfEng3px5oOKMCZvhxhrhImhhrEU2M000y4Beh75l68FDOBFHLy5WZg+eI/JNWxyai4EMKUH/uGvoUsTaEShneJRoAXQ9PIKneIhfGekF9oykv0YUfwkVNtI44YI8a8TiPC8lwiBy17bXij0zMXRd+VqSJj8EWjTFg4NLSyfQHkslMcXlD+FcAclr6Wd7FrGCbVMbS18bUOX2C2frgkaigPBt4Y+GxPZkbLbveauegjWoDDy+NkcCIzg6golI7jtZDPyO0YXakrR8RD24dxVj+JUceeSp/KDiVKLSgS9P3n7GIRHckZui8Oyi7xWSnxNQ29IxGKtGr69SxquvSuTexJonVbqSjg4btqZeBxLCZgmZEyBDDkNMVoDPzolu0vaRMJst7iJbUNL8JVZLyfzwaZ1uMebeOMc/q9rVN3zrn+JEPi9AJkOdkyFXjReFP4kaUTkw1q3Ov0DR5V5gw==)

</div>

:::tip
When used in [DOM templates](/guide/essentials/component-basics.html#dom-template-parsing-caveats), it should be referenced as `<keep-alive>`.
:::

## Include / Exclude

By default, `<KeepAlive>` will cache any component instance inside. We can customize this behavior via the `include` and `exclude` props. Both props can be a comma-delimited string, a `RegExp`, or an array containing either types:

```kdu-html
<!-- comma-delimited string -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- regex (use `k-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- Array (use `k-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

The match is checked against the component's [`name`](/api/options-misc.html#name) option, so components that need to be conditionally cached by `KeepAlive` must explicitly declare a `name` option.

## Max Cached Instances

We can limit the maximum number of component instances that can be cached via the `max` prop. When `max` is specified, `<KeepAlive>` behaves like an [LRU cache](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>): if the number of cached instances is about to exceed the specified max count, the least recently accessed cached instance will be destroyed to make room for the new one.

```kdu-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Lifecycle of Cached Instance

When a component instance is removed from the DOM but is part of a component tree cached by `<KeepAlive>`, it goes into a **deactivated** state instead of being unmounted. When a component instance is inserted into the DOM as part of a cached tree, it is **activated**.

<div class="composition-api">

A kept-alive component can register lifecycle hooks for these two states using [`onActivated()`](/api/composition-api-lifecycle.html#onactivated) and [`onDeactivated()`](/api/composition-api-lifecycle.html#ondeactivated):

```kdu
<script setup>
import { onActivated, onDeactivated } from 'kdu'

onActivated(() => {
  // called on initial mount
  // and every time it is re-inserted from the cache
})

onDeactivated(() => {
  // called when removed from the DOM into the cache
  // and also when unmounted
})
</script>
```

</div>
<div class="options-api">

A kept-alive component can register lifecycle hooks for these two states using [`activated`](/api/options-lifecycle.html#activated) and [`deactivated`](/api/options-lifecycle.html#deactivated) hooks:

```js
export default {
  activated() {
    // called on initial mount
    // and every time it is re-inserted from the cache
  },
  deactivated() {
    // called when removed from the DOM into the cache
    // and also when unmounted
  }
}
```

</div>

Note that:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> is also called on mount, and <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> on unmount.

- Both hooks work for not only the root component cached by `<KeepAlive>`, but also descendent components in the cached tree.

---

**Related**

- [`<KeepAlive>` API reference](/api/built-in-components.html#keepalive)
