# List Rendering

## `k-for`

We can use the `k-for` directive to render a list of items based on an array. The `k-for` directive requires a special syntax in the form of `item in items`, where `items` is the source data array and `item` is an **alias** for the array element being iterated on:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```kdu-html
<li k-for="item in items">
  {{ item.message }}
</li>
```

Inside the `k-for` scope, template expressions have access to all parent scope properties. In addition, `k-for` also supports an optional second alias for the index of the current item:

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```kdu-html
<li k-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li k-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpdkM1qwzAQhF9l0UUJxPLdOIX20Fuh96oHxZFbJdYP0poUhN69K9ttICexn2Znhs3sOQRxPc+sY30aogkISeMcnqQzNviIkCHqEQqM0VvgJOXSSTd4lxCCitrhm05JfWk4VuWOvy+Q7/9EBrVN2+dHBruqO+Cv3nMoB0q4sxcViX3Sct+ufagJDeQRJoW6TthPBq7N6ONRsl21P4BxZ/2zp2eNk4yEABJzfihZCjRAdFm4T7QkthYEl5B2MmTSt//R7MDWmzRWBXFJ3tHV8pKzfVBuBwupjG5VZ8m+EUPq2pbAJTVpHMRNn4QKoRIRZ4fGaqGTbU7R35KOZC5ZtaEmhZVfBcaSFg==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpVUMFqwzAM/RXhS1tInHvIBttht8Hu8w5uo2xuE9vYCi2E/PukpGSrMbbfs/SeeJN6iVFf2lHVqsmn5CI9G4+3GBJBi50de4LJeIDWkt0f1rehhDQmL8gQ8Io2oad3zNl+Yw27jwXvCqmWekc45Bo+Jxi2mrcQdjAX8J97tYm5r9VkFnU+eDfVNhwDFou9JRRETe/gUnYhPRm1F58CnG/xduALFl+juFAEp+lxUJhnKIHZpeEPcZO+z8TkYlL1jkWaarNWhXKDxFQONupzDp4jXNO5f7BvveYlHGcs2KgfopjrqmLinMvcnfQVj9rGKIxOoyc3oMY8lMcUrhkTixslMhKFmn8BGjuVvQ==)

</div>

The variable scoping of `k-for` is similar to the following JavaScript:

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // has access to outer scope `parentMessage`
  // but `item` and `index` are only available in here
  console.log(parentMessage, item.message, index)
})
```

Notice how the `k-for` value matches the function signature of the `forEach` callback. In fact, you can use destructuring on the `k-for` item alias similar to destructuring function arguments:

```kdu-html
<li k-for="{ message } in items">
  {{ message }}
</li>

<!-- with index alias -->
<li k-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

For nested `k-for`, scoping also works similar to nested functions. Each `k-for` scope has access to parent scopes:

```kdu-html
<li k-for="item in items">
  <span k-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

You can also use `of` as the delimiter instead of `in`, so that it is closer to JavaScript's syntax for iterators:

```kdu-html
<div k-for="item of items"></div>
```

## `k-for` with an Object

You can also use `k-for` to iterate through the properties of an object. The iteration order will be based on the result of calling `Object.keys()` on the object:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Kdu',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Kdu',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```kdu-html
<ul>
  <li k-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

You can also provide a second alias for the property's name (a.k.a. key):

```kdu-html
<li k-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

And another for the index:

```kdu-html
<li k-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNo9UMtuwjAQ/JWVL4CUB1RVD1GohNRD1R76A77ksQhD/JC9hqIo/951UvDFO7uzs6MZxcG54tJHUYk6dF45goAU3bs0SjvrCUbw2HSkrggTHL3VsGL+ShppOmsCgb7/tGfsCPZP5nqUBoAUDVjB6tPegCz0FgYVKIAy8M0KWeI0kU7WM+mrMQgfFpe2iy1zT9gfiGcv291bvn3Nd1s+O22kqcvFK7tkQKjd0BAmRHUc+Ad+9aDgkh+t30uxvjZDxAwueM/4fo+/m2TjYV2KeVcSwDguc5imIgHe4LJK5azBYKHW5aDmS3U5n6zLpw+RiSW8XDeuOAdrON45Evk/CFKw5OJTCs4zYSlORC5UZcmNc8jDsStu2BaNc6lT+GhIaSww6Lz19hbQs7gUSYZNTWL6A55KnTM=)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNo9UUtuwyAQvcqIjRPJn6SqurDcSpG6qNpFL8AGxxOFBBsEQ5PI8t072EkQAt7MvPk8RrFzrjx3UdSiCXuvHX3IAa/OeoIODyoaglEOAJ0itVovb0keKfohIUnAq7/9tifcU/0ISEbSZLCG7MtegCx0FowOFEAP8NPFLH+QAVSko/Uc+q0GhE+Lybm4JLnYMu+I3Y7TZy+b7VuxeS22m2wJkTQtJfmaD95N9ZyFAWHvjCJMiJpo+E7Exmg4Fwfr36VY/SkTMYcz3nLur8PrOrX5GEuKmZvaHcfFD9NUJsAMfvLcI8w5GCyhTWX0XKmp5pJN9exD5EL3SeKiV648BTuw/Itwd0eQ4i5lsvH/JCzFkciFuqrYcApFOOzLC7alci5ZSh8H0j2WGPqi9fYS0HNyKVKapIuY/gE6OKRq)

</div>

## `k-for` with a Range

`k-for` can also take an integer. In this case it will repeat the template that many times, based on a range of `1...n`.

```kdu-html
<span k-for="n in 10">{{ n }}</span>
```

Note here `n` starts with an initial value of `1` instead of `0`.

## `k-for` on `<template>`

Similar to template `k-if`, you can also use a `<template>` tag with `k-for` to render a block of multiple elements. For example:

```kdu-html
<ul>
  <template k-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `k-for` with `k-if`

:::warning Note
It's **not** recommended to use `k-if` and `k-for` on the same element due to implicit precedence. Refer to [style guide](/style-guide/rules-essential.html#avoid-k-if-with-k-for) for details.
:::

When they exist on the same node, `k-if` has a higher priority than `k-for`. That means the `k-if` condition will not have access to variables from the scope of the `k-for`:

```kdu-html
<!--
This will throw an error because property "todo"
is not defined on instance.
-->
<li k-for="todo in todos" k-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

This can be fixed by moving `k-for` to a wrapping `<template>` tag (which is also more explicit):

```kdu-html
<template k-for="todo in todos">
  <li k-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## Maintaining State with `key`

When Kdu is updating a list of elements rendered with `k-for`, by default it uses an "in-place patch" strategy. If the order of the data items has changed, instead of moving the DOM elements to match the order of the items, Kdu will patch each element in-place and make sure it reflects what should be rendered at that particular index.

This default mode is efficient, but **only suitable when your list render output does not rely on child component state or temporary DOM state (e.g. form input values)**.

To give Kdu a hint so that it can track each node's identity, and thus reuse and reorder existing elements, you need to provide a unique `key` attribute for each item:

```kdu-html
<div k-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

When using `<template k-for>`, the `key` should be placed on the `<template>` container:

```kdu-html
<template k-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Note
`key` here is a special attribute being bound with `k-bind`. It should not be confused with the property key variable when [using `k-for` with an object](#k-for-with-an-object).
:::

[It is recommended](/style-guide/rules-essential.html#use-keyed-k-for) to provide a `key` attribute with `k-for` whenever possible, unless the iterated DOM content is simple (i.e. contains no components or stateful DOM elements), or you are intentionally relying on the default behavior for performance gains.

The `key` binding expects primitive values - i.e. strings and numbers. Do not use objects as `k-for` keys. For detailed usage of the `key` attribute, please see the [`key` API documentation](/api/built-in-special-attributes.html#key).

## `k-for` with a Component

> This section assumes knowledge of [Components](/guide/essentials/component-basics). Feel free to skip it and come back later.

You can directly use `k-for` on a component, like any normal element (don't forget to provide a `key`):

```kdu-html
<MyComponent k-for="item in items" :key="item.id" />
```

However, this won't automatically pass any data to the component, because components have isolated scopes of their own. In order to pass the iterated data into the component, we should also use props:

```kdu-html
<MyComponent
  k-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

The reason for not automatically injecting `item` into the component is because that makes the component tightly coupled to how `k-for` works. Being explicit about where its data comes from makes the component reusable in other situations.

<div class="composition-api">

Check out [this example of a simple todo list](https://kdujs-sfc.web.app/#eNp1VE1v2zAM/SuEMcAOmsjotpPhFi2wDthhwzDkVu/gWMyixpYES04yBPnvoyQrcbP2kkh8fOTjh3xMHrVmWz4kRVKaphfagkE76PtKik6r3sIRelzDCda96iAl1/QMLRVX3yx2I8byaHARyQ2gko2SxoLEvcOWeLBw5wJmaTqLoCXEjOZnxzq6HwDBC7idh7MVtsUC0i8K7AaBC7NB41OcvMeE8vGKsqy3CGqgPES0fW02b/M+XfG+q72ntPVeBkYlf5PoSrboKjpYXy4n5Z+ddT3Ixgoloeb8R6g3m4UEvkK2q9sBmR7MJpukvQS6uXmtYNK0wPUiSAH8D5GIlESSxDIPc6QJ0oWGodvaorvZcq36DrYLJQszrDphme5xh9LeVclFdJWQs5NRtvUKWyAS4ZRx4cog9JFzqH1NZe5dor+QerDhDJSmUxzbQI1iqyTCgr8KGs0ktsGNajm6pE/sD4OviNwPoqnP/DymXA3WKukklfl4dkiZu1LDcTjrc6kWglpy0RiKyxwyByE5Hmb0FwZ2UVVs8S+5OSsTfGL3k4qIv1zAhx47tYuoYUa3osHMJ5nD7Sx63pf5Wdgo3ksmcxxeMk/Ck1t0tWYvRkl6r36HqhEgsUVc5iqh5+fuVbKxVpsiz8nwYhZm3bA9rlittbOwfpBWdMjQdItVr/YGewoedNEmnSjt9EW/8Y3guBYSf/ZKm+w59Q1I3RsJ9idaMWcPjfDAu9vp1k2MgzoewxOAE6mYjBkeGmrhljr6ASl0FgNTK+9/+ePVEviI0z6e/gEJoKDi) to see how to render a list of components using `k-for`, passing different data to each instance.

</div>
<div class="options-api">

Check out [this example of a simple todo list](https://kdujs-sfc.web.app/#eNqNVN9r2zAQ/lcOM0hCY5luezJuaWEb7GF7GH2r++BYl1mNLQlLbjpC/vedJMt2t27UBCLdj+8+fXfSKbnVmh34kORJYepeaHtdStFp1Vu4U1x9tdjBvlcdrFgWDS5hVUqAUuKzD+W4r4bWwslZa0X5EqU1OZxmlPPWOXllq/UmBAL0aIdexh2AxKOLv8Nnm8Nq5TPcZ8lIaPdxD3OK+wTP4XIK9gnCtkgQnxTYBoEL06DxnMMXyPwD6v2rUHfVAUEN1gPavjLNW/E+vIr3TR09VFsd5RIpLh+mLFLZehkJ62Mw+qhQtEPbKO60Dq6K8+9BxllnqtoIw7yMTA+mWS9IOorePde5uFhQHgmPIVODYsB586LGIgKuqIdLvqWkX5FNg0YbmgzdVhbdzhZ71XdwSJXMzbDrhGW6xyeapKsymY9VJhTsQIu22mELlER+qpu685H3lnOo/MwUmQ+J8ULqYeJ9SDvFsQ2p06GS6Bb8BWg0E9kaG9VydEU/s58MviBy38m6mvKzWHI3WKuko1Rk49p5iswdNSyHiZ8rlQqSZOYYDrd2ni0IyfF5Q3/hQsys8gP+ojBnZYIv7L530eM3s/Omx049Ra9hRreixrUvsoXLTYy8LrKJ2EjeUyZzbF6yTcKjkXaVZo9GSXpQ/IiVo4PIThNaJvSAuH2ZNNZqk2cZGR5NavY1O+KOVVo7C+sHaUWHDE2X7np1NNgTeODlhonKLt+kF4/Y3y9TaXWvqBrcr7wSq3DDkObMG4Mcq4f/T6kbOzE27HQKlwPO460d2w03NUl5IGXfOfR1hCZJr3/45R/D4BGXep5/AxvYvjc=) to see how to render a list of components using `k-for`, passing different data to each instance.

</div>

## Array Change Detection

### Mutation Methods

Kdu is able to detect when a reactive array's mutation methods are called and trigger necessary updates. These mutation methods are:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Replacing an Array

Mutation methods, as the name suggests, mutate the original array they are called on. In comparison, there are also non-mutating methods, e.g. `filter()`, `concat()` and `slice()`, which do not mutate the original array but **always return a new array**. When working with non-mutating methods, we should replace the old array with the new one:

<div class="composition-api">

```js
// `items` is a ref with array value
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

You might think this will cause Kdu to throw away the existing DOM and re-render the entire list - luckily, that is not the case. Kdu implements some smart heuristics to maximize DOM element reuse, so replacing an array with another array containing overlapping objects is a very efficient operation.

## Displaying Filtered/Sorted Results

Sometimes we want to display a filtered or sorted version of an array without actually mutating or resetting the original data. In this case, you can create a computed property that returns the filtered or sorted array.

For example:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```kdu-html
<li k-for="n in evenNumbers">{{ n }}</li>
```

In situations where computed properties are not feasible (e.g. inside nested `k-for` loops), you can use a method:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```kdu-html
<ul k-for="numbers in sets">
  <li k-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Be careful with `reverse()` and `sort()` in a computed property! These two methods will mutate the original array, which should be avoided in computed getters. Create a copy of the original array before calling these methods:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
