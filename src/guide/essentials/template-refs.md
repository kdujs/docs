# Template Refs

While Kdu's declarative rendering model abstracts away most of the direct DOM operations for you, there may still be cases where we need direct access to the underlying DOM elements. To achieve this, we can use the special `ref` attribute:

```kdu-html
<input ref="input">
```

`ref` is a special attribute, similar to the `key` attribute discussed in the `k-for` chapter. It allows us to obtain a direct reference to a specific DOM element or child component instance after it's mounted. This may be useful when you want to, for example, programmatically focus an input on component mount, or initialize a 3rd party library on an element.

## Accessing the Refs

<div class="composition-api">

To obtain the reference with Composition API, we need to declare a ref with the same name:

```kdu
<script setup>
import { ref, onMounted } from 'kdu'

// declare a ref to hold the element reference
// the name must match template ref value
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

If not using `<script setup>`, make sure to also return the ref from `setup()`:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</div>
<div class="options-api">

The resulting ref is exposed on `this.$refs`:

```kdu
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Note that you can only access the ref **after the component is mounted.** If you try to access <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> in a template expression, it will be `null` on the first render. This is because the element doesn't exist until after the first render!

<div class="composition-api">

If you are trying to watch the changes of a template ref, make sure to account for the case where the ref has `null` value:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // not mounted yet, or the element was unmounted (e.g. by k-if)
  }
})
```

See also: [Typing Template Refs](/guide/typescript/composition-api.html#typing-template-refs) <sup class="kt-badge ts" />

</div>

## Refs inside `k-for`

> Requires v3.2.25 or above

<div class="composition-api">

When `ref` is used inside `k-for`, the corresponding ref should contain an Array value, which will be populated with the elements after mount:

```kdu
<script setup>
import { ref, onMounted } from 'kdu'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li k-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpFkMtugzAQRX9l5E1AAqO2OwSRqq676bbugpBBdWJsyx6aSoh/7xhIuvBjHvf4embx6r28nidRiyb2QXuCiDT5o7J69C4QzBBwKMDZdzdZwjMsMAQ3woFVB2WV7Z2NBEbz1qbe7POpgOcCXr7y/7ImHD9wiPeWrfaAZlkO7RFmZQE6g4Gyu0D+dGZCOXY+06lFS8JfenOsspQzZeHVVJt3ds0BK73pCDkCaCaznnwzGq7l4EKrRKKDtqtrJZKlPZmeVGJXAMzz6hyWZWdURm/YauU21eMxUYhtYiV7lZfoLM90/RCT1wKD6+2LKcfjS7ES30Q+1lXFiUss49DLG55k533KyMDz0SNKjGN5Cu4WMTBciYRhU4tY/gBVxZge)

</div>
<div class="options-api">

When `ref` is used inside `k-for`, the resulting ref value will be an array containing the corresponding elements:

```kdu
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li k-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFkN1OwzAMhV/FirhgUpsIuKsKEs9BuOhWl2VLk8hOGVLVd8fNfpDgAilK4mPni31m9ZqSPvaTalTLO3Ipv9iAXylShh6HbvIZZhsA+i5395vzHYAwTxSuEYB3nBt4e6jgsYKn97O8rMdSrfsYp5Cx/wHsYuDoUfv4cZ/3jvUd4cDaZRx5U97ZIKs1t6YkkGTyXUaJANrJl1Nu3sGxHiI9W7UCwIXSkFXS53AR2apLOcA8Q6lbSocCMN6dmaZAW3P7SVXKjasb9dglfeAYxKkyg2BLQsDNdSqrxMo1tmqfc+LGGBEOXPOw0yfc6i6lVdEkdrgRNfJYbymeGEngVhWzLhwj4idSTRh6JKT/uL/K/7CvrqrlG1VFpq0=)

</div>

It should be noted that the ref array does **not** guarantee the same order as the source array.

## Function Refs

Instead of a string key, the `ref` attribute can also be bound to a function, which will be called on each component update and gives you full flexibility on where to store the element reference. The function receives the element reference as the first argument:

```kdu-html
<input :ref="(el) => { /* assign el to a property or ref */ }">
```

Note we are using a dynamic `:ref` binding so we can pass it a function instead of a ref name string. When the element is unmounted, the argument will be `null`. You can, of course, use a method instead of an inline function.

## Ref on Component

> This section assumes knowledge of [Components](/guide/essentials/component-basics). Feel free to skip it and come back later.

`ref` can also be used on a child component. In this case the reference will be that of a component instance:

<div class="composition-api">

```kdu
<script setup>
import { ref, onMounted } from 'kdu'
import Child from './Child.kdu'

const child = ref(null)

onMounted(() => {
  // child.value will hold an instance of <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</div>
<div class="options-api">

```kdu
<script>
import Child from './Child.kdu'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child will hold an instance of <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">If the child component is using Options API or not using `<script setup>`, the</span><span class="options-api">The</span> referenced instance will be identical to the child component's `this`, which means the parent component will have full access to every property and method of the child component. This makes it easy to create tightly coupled implementation details between the parent and the child, so component refs should be only used when absolutely needed - in most cases, you should try to implement parent / child interactions using the standard props and emit interfaces first.

<div class="composition-api">

An exception here is that components using `<script setup>` are **private by default**: a parent component referencing a child component using `<script setup>` won't be able to access anything unless the child component chooses to expose a public interface using the `defineExpose` macro:

```kdu
<script setup>
import { ref } from 'kdu'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

When a parent gets an instance of this component via template refs, the retrieved instance will be of the shape `{ a: number, b: number }` (refs are automatically unwrapped just like on normal instances).

See also: [Typing Component Template Refs](/guide/typescript/composition-api.html#typing-component-template-refs) <sup class="kt-badge ts" />

</div>
<div class="options-api">

The `expose` option can be used to limit the access to a child instance:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

In the above example, a parent referencing this component via template ref will only be able to access `publicData` and `publicMethod`.

</div>
