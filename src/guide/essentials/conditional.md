# Conditional Rendering

<script setup>
import { ref } from 'kdu'
const awesome = ref(true)
</script>

## `k-if`

The directive `k-if` is used to conditionally render a block. The block will only be rendered if the directive's expression returns a truthy value.

```kdu-html
<h1 k-if="awesome">Kdu is awesome!</h1>
```

## `k-else`

You can use the `k-else` directive to indicate an "else block" for `k-if`:

```kdu-html
<button @click="awesome = !awesome">Toggle</button>

<h1 k-if="awesome">Kdu is awesome!</h1>
<h1 k-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 k-if="awesome">Kdu is awesome!</h1>
  <h1 k-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpFkE1ugzAQha8y8SatVEDZIge16y56AW+ADIGAf+QZiwXiHt1V6gl7hNqBNju/N8+f3swi3pzLx0sQpZDU+sExEHJwlTKDdtYzLOCxgxU6bzUcY/SojDKtNcRQz0hWI5xT5ol9wGdlZLGBIiIKRu2mmjEqANkEZmvgtZ2Gdjwr8QAc9qcSFdvrdUJZbOE7RrHsTzBmQ/f4FJPvlwAD/dU4yKI/pfgexomw+ujBWPj5+vzep7L4ryRexLZkpmuX38iaeIYlFVX7gJQo4e4kLy6ftBI9s6OyKKJxo4y6Np+xyWvnkpP7YHjQmCPprPF2JvQRrkTCrMqsYv0FBxKDJw==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpFUEtOwzAQvcrUK5BIrG4jN4I1Cy7gjZNMGjfxR/ZYQap6D3ZInJAjYJNQLMuaN+/5aeZd2Yv39Twk1jAR+6A9tdLiu3eBYMBRpYXgKi3AoEg9PG61pICUgi1IEuSjVozOYAMUEm6SW+Hyk6/gd+sMCI1fFGFGAKJLRM7Cc7/ofj5JtjvBCQ57KVlL7nxeUPBN/GsjSUxHmCs9/n/KytchgY5/8xwEn45Fvotxidi+TWAdfH9+fO2s4PeR2BPTpixfGeXrS3Q2B7PtvBNRsmZLofRycgVLNhH52HCeG5dYxbGvV+xq5X3p1CFZ0gZrjKbqglsjhmwuWbEpEbHbDzcViUo=)

</div>

A `k-else` element must immediately follow a `k-if` or a `k-else-if` element - otherwise it will not be recognized.

## `k-else-if`

The `k-else-if`, as the name suggests, serves as an "else if block" for `k-if`. It can also be chained multiple times:

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

Similar to `k-else`, a `k-else-if` element must immediately follow a `k-if` or a `k-else-if` element.

## `k-if` on `<template>`

Because `k-if` is a directive, it has to be attached to a single element. But what if we want to toggle more than one element? In this case we can use `k-if` on a `<template>` element, which serves as an invisible wrapper. The final rendered result will not include the `<template>` element.

```kdu-html
<template k-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

`k-else` and `k-else-if` can also be used on `<template>`.

## `k-show`

Another option for conditionally displaying an element is the `k-show` directive. The usage is largely the same:

```kdu-html
<h1 k-show="ok">Hello!</h1>
```

The difference is that an element with `k-show` will always be rendered and remain in the DOM; `k-show` only toggles the `display` CSS property of the element.

`k-show` doesn't support the `<template>` element, nor does it work with `k-else`.

## `k-if` vs `k-show`

`k-if` is "real" conditional rendering because it ensures that event listeners and child components inside the conditional block are properly destroyed and re-created during toggles.

`k-if` is also **lazy**: if the condition is false on initial render, it will not do anything - the conditional block won't be rendered until the condition becomes true for the first time.

In comparison, `k-show` is much simpler - the element is always rendered regardless of initial condition, with CSS-based toggling.

Generally speaking, `k-if` has higher toggle costs while `k-show` has higher initial render costs. So prefer `k-show` if you need to toggle something very often, and prefer `k-if` if the condition is unlikely to change at runtime.

## `k-if` with `k-for`

::: warning Note
It's **not** recommended to use `k-if` and `k-for` on the same element due to implicit precedence. Refer to [style guide](/style-guide/rules-essential.html#avoid-k-if-with-k-for) for details.
:::

When `k-if` and `k-for` are both used on the same element, `k-if` will be evaluated first. See the [list rendering guide](list#k-for-with-k-if) for details.
