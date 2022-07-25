<script setup>
import ElasticHeader from './demos/ElasticHeader.kdu'
import DisabledButton from './demos/DisabledButton.kdu'
import Colors from './demos/Colors.kdu'
import AnimateWatcher from './demos/AnimateWatcher.kdu'
</script>

# Animation Techniques

Kdu provides the [`<Transition>`](/guide/built-ins/transition.html) and [`<TransitionGroup>`](/guide/built-ins/transition-group.html) components for handling enter / leave and list transitions. However, there are many other ways of using animations on the web, even in a Kdu application. Here we will discuss a few additional techniques.

## Class-based Animations

For elements that are not entering / leaving the DOM, we can trigger animations by dynamically adding a CSS class:

<div class="composition-api">

```js
const disabled = ref(false)

function warnDisabled() {
  disabled.value = true
  setTimeout(() => {
    disabled.value = false
  }, 1500)
}
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      disabled: false
    }
  },
  methods: {
    warnDisabled() {
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 1500)
    }
  }
}
```

</div>

```kdu-html
<div :class="{ shake: disabled }">
  <button @click="warnDisabled">Click me</button>
  <span k-if="disabled">This feature is disabled!</span>
</div>
```

```css
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
```

<DisabledButton />

## State-driven Animations

Some transition effects can be applied by interpolating values, for instance by binding a style to an element while an interaction occurs. Take this example for instance:

<div class="composition-api">

```js
const x = ref(0)

function onMousemove(e) {
  x.value = e.clientX
}
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      x: 0
    }
  },
  methods: {
    onMousemove(e) {
      this.x = e.clientX
    }
  }
}
```

</div>

```kdu-html
<div
  @mousemove="onMousemove"
  :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
  class="movearea"
>
  <p>Move your mouse across this div...</p>
  <p>x: {{ x }}</p>
</div>
```

```css
.movearea {
  transition: 0.3s background-color ease;
}
```

<Colors />

In addition to color, you can also use style bindings to animate transform, width, or height. You can even animate SVG paths using spring physics - after all, they are all attribute data bindings:

<ElasticHeader />

## Animating with Watchers

With some creativity, we can use watchers to animate anything based on some numerical state. For example we can animate the number itself:

<div class="composition-api">

```js
import { ref, reactive, watch } from 'kdu'
import gsap from 'gsap'

const number = ref(0)
const tweened = reactive({
  number: 0
})

watch(number, (n) => {
  gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 })
})
```

</div>
<div class="options-api">

```js
import gsap from 'gsap'

export default {
  data() {
    return {
      number: 0,
      tweened: 0
    }
  },
  watch: {
    number(n) {
      gsap.to(this, { duration: 0.5, tweened: Number(n) || 0 })
    }
  }
}
```

</div>

```kdu-html
Type a number: <input k-model.number="number" />
<p>{{ tweened.number.toFixed(0) }}</p>
```

<AnimateWatcher />

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp9UruO2zAQ/JUFm9MBEmUESKPIDtKkTJWSjR5rm7b4AElZuej077eUZN0LuIZczu7MkrMc2S9r+bXtWcFK3zhpA3gMvT0ILZU1LsAIDo8pLVUT5A1TGKrQnGGCozMKHoj7sNWefGVXPIaUELox2gfQvarRwT6KJbvHOxwGRI3tjC/6ySg0rOUF7ISeqFjouWnymkpjmOhH2B9gZsDcnAeTrJop3bztXRWk0STEv6eb6p95j+znZ9hB7AAwCU17mS8u0PvpEFDZrgpIJ4CylTdousr7vWAtKiPYjAP8fbII1SZfSm37ANdMmRY7vsDEWQLBIF95pd30annK7vnDON6NWcn0rN/yH7bkHExTmcfxED2nG1FU5m/uSUcfnroY8lfRxaOj0SEbUJ7OoYDadO2PDfXyPxbwDRVB5ATZsIqwlC3DzRTZe/FG01eZ1cSa8IIV9xkIFqcQAcHOIVhf5Hmv7fXEG6PymPtJpvQdCjZPMDLoB70nEHDxmT82fMCaV9ZGhLteB6mQo1dZ7czgyZYL9X6rkxN4Q5c51C266OXXuh/KP2mv/2Ji0wvrsxVP)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp9Ustu2zAQ/JUFL7EBizIK9KKqKXrpsaceeaGktc1YfIBcVkkU/XtIKVJeQAAB2p3hDPfBkf12jl+7yCpWh9YrR7fCKO2sJzgH6eDkrYabHN4IIwzez1SHJxl7glEYgE6S3O2XGMAjRW/WDMBE3aCv4HhYERoQDXYJWpAp/6aZHiS1l2oVL9Kd2bxhromT3dFFhQOM0EUvSVmTzPj3w6v130369ARHmPZvrxImfXW59ZsSQu16SZgz+vfgEORWea2MiwTXQtsOe77APwVbAsGgnFW1g7aXISSmUediZW/HcS0rFf5H3WO3O+5hmurSJV1dvr3a1IEe+hzyV4+l+5M1VAyozheqoLF992NDg3rECr6hTtDS2WzCDmzZZKHT0O6CNWnLs5d4IYJg27AFy7PNgGAXIheqsozGXc+8tbrM3K/Uf+xRsJdNCpYezntBAu5CEU4tH7Dh0rmMcB8NKY0cgy4ab4eAPpXz3qdM4H/0hUfToc+D+9r3w/FP3uui2fQMxnz6aQ==)

</div>
