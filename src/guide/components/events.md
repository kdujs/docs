# Component Events

> This page assumes you've already read the [Components Basics](/guide/essentials/component-basics). Read that first if you are new to components.

## Emitting and Listening to Events

A component can emit custom events directly in template expressions (e.g. in a `k-on` handler) using the built-in `$emit` method:

```kdu-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">click me</button>
```

<div class="options-api">

The `$emit()` method is also available on the component instance as `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('submit')
    }
  }
}
```

</div>

The parent can then listen to it using `k-on`:

```kdu-html
<MyComponent @some-event="callback" />
```

The `.once` modifier is also supported on component event listeners:

```kdu-html
<MyComponent @some-event.once="callback" />
```

Like components and props, event names provide an automatic case transformation. Notice we emitted a camelCase event, but can listen for it using a kebab-cased listener in the parent. As with [props casing](/guide/components/props.html#prop-name-casing), we recommend using kebab-cased event listeners in templates.

:::tip
Unlike native DOM events, component emitted events do **not** bubble. You can only listen to the events emitted by a direct child component.
:::

## Event Arguments

It's sometimes useful to emit a specific value with an event. For example, we may want the `<BlogPost>` component to be in charge of how much to enlarge the text by. In those cases, we can pass extra arguments to `$emit` to provide this value:

```kdu-html
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

Then, when we listen to the event in the parent, we can use an inline arrow function as the listener, which allows us to access the event argument:

```kdu-html
<MyButton @increase-by="(n) => count += n" />
```

Or, if the event handler is a method:

```kdu-html
<MyButton @increase-by="increaseCount" />
```

Then the value will be passed as the first parameter of that method:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
All extra arguments passed to `$emit()` after the event name will be forwarded to the listener. For example, with `$emit('foo', 1, 2, 3)` the listener function will receive three arguments.
:::

## Declaring Emitted Events

Emitted events can be explicitly declared on the component via the <span class="composition-api">[`defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits) macro</span><span class="options-api">[`emits`](/api/options-state.html#emits) option</span>:

<div class="composition-api">

```kdu
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

The `$emit` method that we used in the `<template>` isn't accessible within the `<script setup>` section of a component, but `defineEmits()` returns an equivalent function that we can use instead:

```kdu
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

The `defineEmits()` macro **cannot** be used inside a function, it must be placed directly within `<script setup>`, as in the example above.

If you're using an explicit `setup` function instead of `<script setup>`, events should be declared using the [`emits`](/api/options-state.html#emits) option, and the `emit` function is exposed on the `setup()` context:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

As with other properties of the `setup()` context, `emit` can safely be destructured:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

The `emits` option also supports an object syntax, which allows us to perform runtime validation of the payload of the emitted events:

<div class="composition-api">

```kdu
<script setup>
const emit = defineEmits({
  submit(payload) {
    // return `true` or `false` to indicate
    // validation pass / fail
  }
})
</script>
```

If you are using TypeScript with `<script setup>`, it's also possible to declare emitted events using pure type annotations:

```kdu
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

More details: [Typing Component Emits](/guide/typescript/composition-api.html#typing-component-emits) <sup class="kt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload) {
      // return `true` or `false` to indicate
      // validation pass / fail
    }
  }
}
```

See also: [Typing Component Emits](/guide/typescript/options-api.html#typing-component-emits) <sup class="kt-badge ts" />

</div>

Although optional, it is recommended to define all emitted events in order to better document how a component should work. It also allows Kdu to exclude known listeners from [fallthrough attributes](/guide/components/attrs.html#k-on-listener-inheritance).

:::tip
If a native event (e.g., `click`) is defined in the `emits` option, the listener will now only listen to component-emitted `click` events and no longer respond to native `click` events.
:::

## Events Validation

Similar to prop type validation, an emitted event can be validated if it is defined with the object syntax instead of the array syntax.

To add validation, the event is assigned a function that receives the arguments passed to the <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> call and returns a boolean to indicate whether the event is valid or not.

<div class="composition-api">

```kdu
<script setup>
const emit = defineEmits({
  // No validation
  click: null,

  // Validate submit event
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // No validation
    click: null,

    // Validate submit event
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>

## Usage with `k-model`

Custom events can also be used to create custom inputs that work with `k-model`. Remember that:

```kdu-html
<input k-model="searchText" />
```

does the same thing as:

```kdu-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

When used on a component, `k-model` instead does this:

```kdu-html
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

For this to actually work though, the `<input>` inside the component must:

- Bind the `value` attribute to the `modelValue` prop
- On `input`, emit an `update:modelValue` event with the new value

Here's that in action:

<div class="options-api">

```kdu
<!-- CustomInput.kdu -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

</div>
<div class="composition-api">

```kdu
<!-- CustomInput.kdu -->
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

</div>

Now `k-model` should work perfectly with this component:

```kdu-html
<CustomInput k-model="searchText" />
```

<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFUdtqAjEQ/ZUhFFbBzb4vVlr61B/oi+lDdEdd3VzIRQvL/nsnWZW1CIWQMLdz5pz07N1afmoiq9nSb11rw0roVlnjAnxEH4z61DYG2DmjoODVJJfGCqGFxp/c3uBOxi5ALzTA1hCGRh18Df0D0rBI9UYGOZuPvQAOQ3T6FgEo9F7usYbigF1niCVlh/TQRWdZ3ZelIKCynQxIEcBySnYqlWmwexXsCikYVCvo+xsFDBntjsAWbFRfKmn50RtNzuS9xLXgBSNJ40aCkQcpFuwQgvV1VVHi6Eu/2/ILbri0NmW4izq0Cjl6VW6cuXh0BC7YTRHR/nH24UOeOWydIUJYF1nhl+wiFt/ZW1Rtsn1dREs2Yz1t+Ne9Ni0wqqvPaSZ5dwcYNwZ4y21UeklksydMC3jBM/0/D9LtMfCMNR/nK6Kaej78Ajn54M4=)

</div>
<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp9ULtuwkAQ/JXVKZJBwufeApQoSpEuVZpcCoPXYPA9dLcHheV/z56NLIRQyp3ZnZmdXrw5J891FKVYh71vHUFAim6rTKud9QQ9eGxggMZbDRmvZjP1HgNZ/WlcpBstizss6fIygDJ7awKBxhCqA8ImSS6yI3adzZbKrIvJmk15INSuqwh5Aljfe5xzbWvsNkrclJSAYgt9PysPQ1KbFcRKTFFzXTl5Ctbwn/0Y6UYEJUoYkYRx4DQrcSRyoSwKBk4hD81eXnEnK+cSIn001GqUGHS+8/Ya0LO4EkmGAwxs+1DDk3prbFqDX966sPjJxse+qy5i9suNTOSHbimR0dX8Tfmw819rbTKeviov6SJ1Np9PSQFexzWmXpCdFk98VvCCFzQkqfIHJDlqLaf7gq3uux7+ACeizp4=)

</div>

Another way of implementing `k-model` within this component is to use a writable `computed` property with both a getter and a setter. The `get` method should return the `modelValue` property and the `set` method should emit the corresponding event:

<div class="options-api">

```kdu
<!-- CustomInput.kdu -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input k-model="value" />
</template>
```

</div>
<div class="composition-api">

```kdu
<!-- CustomInput.kdu -->
<script setup>
import { computed } from 'kdu'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <input k-model="value" />
</template>
```

</div>

### `k-model` arguments

By default, `k-model` on a component uses `modelValue` as the prop and `update:modelValue` as the event. We can modify these names passing an argument to `k-model`:

```kdu-html
<MyComponent k-model:title="bookTitle" />
```

In this case, the child component should expect a `title` prop and emit an `update:title` event to update the parent value:

<div class="composition-api">

```kdu
<!-- MyComponent.kdu -->
<script setup>
defineProps(['title'])
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp9kU9rwzAMxb+KMIW00CbsGtKyMXYc7D7vkDbKmjZ2jK30DyHffbIdSlfGTol+kp/1ngfxYkx6rHqRi8LtbGMIHFJvNlI3ynSWYACLNYxQ205BwqPJrfV+fe34T6OmqZ1md8zr8jCA1LtOOwJqqEVYe8F5clyprsIWSvvdK6+Al1KZFpOF1EUWd+EtuCBkXhJyBVDsnzbDMEmNY5FxHfj9MpN2HqbWUoSvFJDxaJHd9MRSRCcrVZr04DrNMQxh46nhpMghEM/Yj6+l2BMZl2cZg4NbuXqXnnGblsZ4ktpeU6MwRadWW9udHVoWl8LLjFKPfO1DSn+kX2HdaPywnXHzzyQYSL44msjfVEOe96ZiI9FnaP+XXKNNT9ELXU3IBS8U9wLIT2Xb34UV6XM4xHSGfOX894VLmOHJWyB+RKQ0KCzi0ceoxx9/6dcm)

</div>
<div class="options-api">

```kdu
<!-- MyComponent.kdu -->
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFUttqwzAM/RVhBtmgSdhryMbGnvcF8x7cRl3Txo6xlV4I+ffJdlvablAISSQfHUnneBTv1habZhCVqP3CtZZepWm17R3B5+Gj5z+DhmDpeg1ZUV7kQlkmjTS4j/AGl2roCEZpABYnlK9gvGKaZuG8UaQenxIWwCENzpwiAGqpwwqyTa77BjtQ7mfQoRj3StsOuW2ATeHDL37q8jw9B4SMUoQcAdSr59dxTJwwTXXJccxfTnXsVEXUixTxKwWUDK3LM5+YiSROrpUt1r43LFwcWx4PvBS8cZpPCpYoxFKsiKyvypITa5/75aLY4bxQ1oZM4QZDrcYCvc7nrt95dEwuRZTqyFNycosud2gadOju8d7A/3CftOOVbky9ugv/mWtdz03hK4sqZd9xTNRtMPsrGyybi0nJ7PuuO62xA6U96WCj9rinNB9AtVXdcGFIyr7FIs4+hK6P1y1n8IDbsArxtUEqIsNTKr21c/oFCZEJ0g==)

</div>

### Multiple `k-model` bindings

By leveraging the ability to target a particular prop and event as we learned before with [`k-model` arguments](#k-model-arguments), we can now create multiple k-model bindings on a single component instance.

Each k-model will sync to a different prop, without the need for extra options in the component:

```kdu-html
<UserName
  k-model:first-name="first"
  k-model:last-name="last"
/>
```

<div class="composition-api">

```kdu
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqNUsFqwzAM/RVjBmmhSdg1pGWD7bLDGIydlh3SRmnTJraxlXYj5N8nO3HaQaG7BOs96Ul6SscflYoORcsTnpqNrhQyA9iqVSaqRkmNrGMaStazUsuGBZQaTNSHAf2aNzByUewBq0hpmdhIYZCVlabv0grNghe5E8HcU3V+Zp4kWCKNh0FoBAoQGlXnCBQxlu7uV1036vU9o7cT6Ps0Jsql+BlswNghbGQBdeJKQkH4MuMuyPjfDCvkE+x74GMSTeNpCL7gw+5hk6tob6Qg4zqbmI2EyXjCHGIx8sHGGd8hKpPEMQF7E5pyE51gHeVKWSTSrcCKbAPThGstT7QCiQ8T9Jnoqe2ltVeOVUBZCXjTUpmZ6+52tAUJe0ddie3ConaxS5C0yXFf/txUaGafQasKWnbwzGYHC+YxLxB83bhUJVSLgw34o6ypCN+T6ckxr9vpFO5cI/PgCom5A5pmdm2WOziCwAhzvQWMnNL8fK3/9/a73Gg9rXyr8+V/0v8CCd4l7A==)

</div>
<div class="options-api">

```kdu
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqNUk1r5DAM/SvCFNLCJGGvIVt2YU972MvSU92DO6PppE1sYyv9IOS/V7In6RQK0xAS6+tJes+T+u199bQbVaPauA2dp2ttu8G7QHATMfwzA8I+uAGKql4cUlBoqy2+psQd7s3YE0zaAmwdV1u0FBuYPjDmjQR3hszlVU4ECEhjsIsFsO9CpAaKv+5gi5QvT2+S849D7imOWX784bet16HZIBx8bwjZAmgPP66nKWPCPAOfBYmPbc2hlLJMl3GfysHtsG9SSWnZ/1OrZGj1OUOAlgQ553jNoG29DqE2KhNZDsZXj9FZJjntqo+BqBVzlKG1YlLF1upA5GNT1+x4jGXcb6sXvK+M9+KpwmipYw0wDuV9cC+8AoPnCYQUbnuq0ydhv9LLB8fd5KzpKIHUNvCfQmcfkgyaZMtTt2RnSXHoROrbYvSsLmb2JLXYwOJbqou7s6p11o+UKaE3LwQTvq4CNM+mH1dZknTHyK9UyJELGejyq2ku8JmvZUUmPCBVCenqQ7nv9162OdN6Xfpc59M7M78DfQg1iw==)

</div>

### Handling `k-model` modifiers

When we were learning about form input bindings, we saw that `k-model` has [built-in modifiers](/guide/essentials/forms.html#modifiers) - `.trim`, `.number` and `.lazy`. In some cases, however, you might also want to add your own custom modifiers.

Let's create an example custom modifier, `capitalize`, that capitalizes the first letter of the string provided by the `k-model` binding:

```kdu-html
<MyComponent k-model.capitalize="myText" />
```

Modifiers added to a component `k-model` will be provided to the component via the `modelModifiers` prop. In the below example, we have created a component that contains a `modelModifiers` prop that defaults to an empty object:

<div class="composition-api">

```kdu{4,9}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

defineEmits(['update:modelValue'])

console.log(props.modelModifiers) // { capitalize: true }
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

</div>
<div class="options-api">

```kdu{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

</div>

Notice the component's `modelModifiers` prop contains `capitalize` and its value is `true` - due to it being set on the `k-model` binding `k-model.capitalize="myText"`.

Now that we have our prop set up, we can check the `modelModifiers` object keys and write a handler to change the emitted value. In the code below we will capitalize the string whenever the `<input />` element fires an `input` event.

<div class="composition-api">

```kdu{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFUsFunDAQ/ZURF1h1Me0VsVGjqMdIlZr2UnpwYMg6Aduyh6R0xb93bLZkm6ySE/jNzHszb+aQXForHtoxKZPKN05ZAo802otaq8EaR3AAhx3M0DkzQMqp6Rq6nq4M/2nUdAyL4gQLvJwMUOvGaE8wTDf4m2AXGLM03dS6KhZRluMH4WB7ScgvgJu98qC0HQkaaRXJXv1BD/iIbqK90ncwmRFYBl0Z8qvTbh7ywbTYi+fKXZ0s8nUCBQtUxaqWbJNloHyQVtx7o9mNQ2z8GPB1UkJEAsZjhXed7ImsL4uCgXuf+64RT3grpLUBEW7UpAYU6If81pknj47J62R7wlMwyAPlDnWLDt17vC/SX3EH6rnWM4/0YhFnFrwsxTpjPe+kxU5p/BpeWRw1OvhD9iOW8I0cOx47j/C1aVWn0Hm2JVTKsacSsg3sLiA7zJvYBO/3nwgOKux90fjCD5/9TEfbsv3ls076K5Z0o25IGR2rYiDDzWJ/jwSPAWEyFCTdHZKIQIiqDrI4jvi/yZMzOPLAyhK/otlLd0nZx40g891adFfSI4/z4Rj3vWow+8TtRX8htpadmWC7FHAip71x3dVy2TTZcJm03GUZa8OlroSMfo6pjK52nDnh+S+qIlT8)

</div>
<div class="options-api">

```kdu{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFU01v4jAQ/SsjayWCFpzdawTVVj33tN29bPbgJkNxm9iWPWlLEf+9YyeE0CIVIYLn482b55e9uHZOPtWdKMQqVF47uiqNbp31BLe7G8v/DBqCjbctzGQ+icW2WWkASoOvqaHGjeoagn2MVse6UMD+DOuwiPlakcrmfS2AR+q8OZ4A2t0dvlIBszQB4BAf/MPfVT4S5QNh6xpFyCeAu60OoI3rCCrlNKlGv2EAfEa/o602D7CzHTAH9EWsX01pPS1bW2MjT53rUvQ8SgE5D1jl4zSxEL1Ky1Y5+RisYQUT+3JIhFLw4j37UrBW8VyKLZELRZ5z4DEsw6aSL3gvlXMxIn1nSLcoMbTLe29fAnoGL0VSbMDJOcgLLT2aGj36r3A/lH/CPirLK3243TNTXLpj5y0PPW6Z5Purmg4L+E2e5R5op8StrfVGoz/Vswd6sALYCOsryPaH+fS6Uzu2Olro36xzbBksTlNm/1NBi7S19Qk2NqR8hqO9ABokeI5RWANKUv4BSabAsUJvIGOTBHlOd+KHCRyMYOkpq63y15T9mEuyf5xDf6MC8lbfh3xodIXZz2G9YcH4SRO/Rc7ZhQ0XffuZKl+9BKv+BaCdiwam3r5FwomGHsE5+iuVcnTU7ILTD+/uBGe9)

</div>

For `k-model` bindings with both argument and modifiers, the generated prop name will be `arg + "Modifiers"`. For example:

```kdu-html
<MyComponent k-model:title.capitalize="myText">
```

The corresponding declarations should be:

<div class="composition-api">

```js
const props = defineProps(['title', 'titleModifiers'])
defineEmits(['update:title'])

console.log(props.titleModifiers) // { capitalize: true }
```

</div>
<div class="options-api">

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```

</div>
