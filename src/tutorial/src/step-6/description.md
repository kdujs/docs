# Conditional Rendering

We can use the `k-if` directive to conditionally render an element:

```kdu-html
<h1 k-if="awesome">Kdu is awesome!</h1>
```

This `<h1>` will be rendered only if the value of `awesome` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy). If `awesome` changes to a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, it will be removed from the DOM.

We can also use `k-else` and `k-else-if` to denote other branches of the condition:

```kdu-html
<h1 k-if="awesome">Kdu is awesome!</h1>
<h1 k-else>Oh no 😢</h1>
```

Currently, the demo is showing both `<h1>`s at the same time, and the button does nothing. Try to add `k-if` and `k-else` directives to them, and implement the `toggle()` method so that we can use the button to toggle between them.

More details on `k-if`: <a target="_blank" href="/guide/essentials/conditional.html">Guide - Conditional Rendering</a>
