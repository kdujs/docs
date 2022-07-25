# Attribute Bindings

In Kdu, mustaches are only used for text interpolation. To bind an attribute to a dynamic value, we use the `k-bind` directive:

```kdu-html
<div k-bind:id="dynamicId"></div>
```

A **directive** is a special attribute that starts with the `k-` prefix. They are part of Kdu's template syntax. Similar to text interpolations, directive values are JavaScript expressions that have access to the component's state. The full details of `k-bind` and directive syntax are discussed in <a target="_blank" href="/guide/essentials/template-syntax.html">Guide - Template Syntax</a>.

The part after the colon (`:id`) is the "argument" of the directive. Here, the element's `id` attribute will be synced with the `dynamicId` property from the component's state.

Because `k-bind` is used so frequently, it has a dedicated shorthand syntax:

```kdu-html
<div :id="dynamicId"></div>
```

Now, try to add a dynamic `class` binding to the `<h1>`, using the `titleClass` <span class="options-api">data property</span><span class="composition-api">ref</span> as its value. If it's bound correctly, the text should turn red.
