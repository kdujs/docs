# Event Handling

## Listening to Events

We can use the `k-on` directive, which we typically shorten to the `@` symbol, to listen to DOM events and run some JavaScript when they're triggered. The usage would be `k-on:click="handler"` or with the shortcut, `@click="handler"`.

The handler value can be one of the following:

1. **Inline handlers:** Inline JavaScript to be executed when the event is triggered (similar to the native `onclick` attribute).

2. **Method handlers:** A property name or path that points to a method defined on the component.

## Inline Handlers

Inline handlers are typically used in simple cases, for example:

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```kdu-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNo9T7tuwzAM/BVCS1qkkdrVUIzmHzpqsWUadhI9INLNYOjfI8VGxjveg7eKS4zyNiyiEZpsmiMDIS+xNX52MSSGFRKOkGFMwcGhSA/GG2+DJwYbFs+Y4Fw1H9+fxmu1pRR/AYwu3jvGilj3C3Pw8Gvvs72djdjdx6MR7WUY4EerTbLJY/s3Ieymrg//CFNH0CN6eEXgAOv6/iFn4NkhSa3q91q9y8WX2LacXBfllYIva1fjAcx+ICMaeDGVKxsrNmJijtQoVYgrnWi08oG97GKsjEyltxRKJHfqU3gQphJuRI3JxmeRn6Gzeqc=)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNo9kNFuwyAMRX/F8tOmLrC9Rixa/2GPvJDgKmkTQOC0laL8e6GJIiGE7cu5ul7wHIK42RlrVKmLQ+BGO3oGHxksXcw8MizaAVjD5uOzvDUDROI5um0CoLnzs2OKNXyXjua1yPKVj5IHNxdMUxgNU6lYtTOzd/DXjUN3+9W4Y04njc3ZWvhRcpNs8tD89wT7J9P6O0FvErREDt4IsrAssFNgXYGHiZJQMmSAkoc5fuEwlYzVZIK4Ju9y/ncYvQ+SxvqIh3lBpdbYM4dUS5kb11SlSyce1AoTQumImH2zoaA0VW30j0QxwzUWTFkGri8ydoDK)

</div>

## Method Handlers

The logic for many event handlers will be more complex though, and likely isn't feasible with inline handlers. That's why `k-on` can also accept the name or path of a component method you'd like to call.

For example:

<div class="composition-api">

```js
const name = ref('Kdu.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` is the native DOM event
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Kdu.js'
  }
},
methods: {
  greet(event) {
    // `this` inside methods points to the current active instance
    alert(`Hello ${this.name}!`)
    // `event` is the native DOM event
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```kdu-html
<!-- `greet` is the name of the method defined above -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpVUNFqwzAM/BXNDNLCar+XtGww2GBs+wE/xE2V1m1iG1tuH0L+fXK6DgYGIel0vrtRvIQgz/ss1qJObbSBICHlsNXODsFHghEidjBBF/0AFUMr7bRrvUsEzgwImwJYVB/7LE+pWpZtl11L1js4RERa4AUdLWHUDsD0GGnRvGPfe3gcC4O8mD7j9NDwLYBS0MwHDdgEdET+hewF4fX7E+ZFQdkO/tHeieeZJBMPWMrhi/ln2kk7frW6mWR73BAOoTeEpaN6l4lY8nPb2/a80WLWrsX2rdRa3dYMrdXfnXgSt5RWgwns3jvOcdajfxdJi/VdoRacXum1OBKFtFaKB6e0Sl0rr7iTJoQykTE7spwLpmG1i/6aMDK5FncfYvoB/kuZMA==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNplUW1rwyAQ/is3GbSF1nwPWdlgsMHY9gf8EJtcG9tERS/toOS/T+0Mg4J43tvznM9d2Yu1/NSOrGSVb5yytBUaf6xxBC3u5dgTXIUGaCXJ5er2BnBIo9PZA9BywBIWH+3Ij35xi07RTOt4D0idaX2ZGw4OkZZ4Rk0zJEBRQE2d8jUo7VWLuQ2sUZo8kAHqEJrRudAIsiF1xlhLUjeYUWSPjpb1O/a9gcdrBORxvOmhXv1nSuyBKuAGUC0T2Ov3J6RErlR7uJszc6Q4J+kOGM3hK7DMFOn3WQShw6mKWeDgEA62l4TRo2o3EhkNz02vmtOTYEkgwbZv0VbFLR1Kq2LuY2umhrinzSBtUN3osMM0o/hLeMFmxQULS46+YB2R9WVRhMDRb/y+4RfccWltjHA3alIDcvTDZufMxaML4ILlf7DpFyCluuk=)

</div>

A method handler automatically receives the native DOM Event object that triggers it - in the example above, we are able to access the element dispatching the event via `event.target.tagName`.

<div class="composition-api">

See also: [Typing Event Handlers](/guide/typescript/composition-api.html#typing-event-handlers) <sup class="kt-badge ts" />

</div>
<div class="options-api">

See also: [Typing Event Handlers](/guide/typescript/options-api.html#typing-event-handlers) <sup class="kt-badge ts" />

</div>

### Method vs. Inline Detection

The template compiler detects method handlers by checking whether the `k-on` value string is a valid JavaScript identifier or property access path. For example, `foo`, `foo.bar` and `foo['bar']` are treated as method handlers, while `foo()` and `count++` are treated as inline handlers.

## Calling Methods in Inline Handlers

Instead of binding directly to a method name, we can also call methods in an inline handler. This allows us to pass the method custom arguments instead of the native event:

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```kdu-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNptj8FuwyAQRH8F7SWNVMPdolH7Db1ywZTUJAav2EVWFPnfC3Vk5ZDjDDPDvjt8IcrrT4EeNLkckAV5Lngy6VyS4zAnQfb2Fj2R/fVHcTdJCDv5zLtn0mqSVlu9FqtgH3Gy7JtiPRTmuvPppuCuHwba4GEMh6OB07e9iTFotWVqXojX+WW0vDeaeOpotX8I7xAizpm7aFFeaE4V7f9o83ggA/2G0bzK3rSBkRmpV6oaF+ro7OTiB2kRmyNzSRyil55iN+R5IZ/ruIE2U+lXWP8AsZ5zgg==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNptUNFqwzAM/BWhl66wOO8hK9s37NUvTqIubuPYWApZKf33WekIexgYw53udJzu+JGSuQ4LNthyn32Sk53pO8UsMNDZLZPA3c4AgWSMAzeKrACwu70EYnZfdHwqAKy4ibLsvLJWHmooX3ltvWcUIBTS5IQUSdstInGG937y/fXNogYcRn84Wjx9uhuMvq2fmqIH+F+/jk52h4I/nrbeA/EVfdCOVXDJXDjOpf9Wwv4O2OJWdauF5UCKLY4iiZu6LsSFKz73ZqXOuJSUMXmZxQcyxKHqclyZclluUdfoAfDxAwLsgBg=)

</div>

## Accessing Event Argument in Inline Handlers

Sometimes we also need to access the original DOM event in an inline handler. You can pass it into a method using the special `$event` variable, or use an inline arrow function:

```kdu-html
<!-- using $event special variable -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- using inline arrow function -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // now we have access to the native event
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // now we have access to the native event
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## Event Modifiers

It is a very common need to call `event.preventDefault()` or `event.stopPropagation()` inside event handlers. Although we can do this easily inside methods, it would be better if the methods can be purely about data logic rather than having to deal with DOM event details.

To address this problem, Kdu provides **event modifiers** for `k-on`. Recall that modifiers are directive postfixes denoted by a dot.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```kdu-html
<!-- the click event's propagation will be stopped -->
<a @click.stop="doThis"></a>

<!-- the submit event will no longer reload the page -->
<form @submit.prevent="onSubmit"></form>

<!-- modifiers can be chained -->
<a @click.stop.prevent="doThat"></a>

<!-- just the modifier -->
<form @submit.prevent></form>

<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div @click.self="doThat">...</div>
```

::: tip
Order matters when using modifiers because the relevant code is generated in the same order. Therefore using `@click.prevent.self` will prevent **clicks default action on the element itself and its children** while `@click.self.prevent` will only prevent clicks default action on the element itself.
:::

The `.capture`, `.once`, and `.passive` modifiers mirror the [options of the native `addEventListener` method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options):

```kdu-html
<!-- use capture mode when adding the event listener -->
<!-- i.e. an event targeting an inner element is handled here before being handled by that element -->
<div @click.capture="doThis">...</div>

<!-- the click event will be triggered at most once -->
<a @click.once="doThis"></a>

<!-- the scroll event's default behavior (scrolling) will happen -->
<!-- immediately, instead of waiting for `onScroll` to complete  -->
<!-- in case it contains `event.preventDefault()`                -->
<div @scroll.passive="onScroll">...</div>
```

The `.passive` modifier is typically used with touch event listeners for [improving performance on mobile devices](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners).

::: tip
Do not use `.passive` and `.prevent` together, because `.passive` already indicates to the browser that you _do not_ intend to prevent the event's default behavior, and you will likely see a warning from the browser if you do so.
:::

## Key Modifiers

When listening for keyboard events, we often need to check for specific keys. Kdu allows adding key modifiers for `k-on` or `@` when listening for key events:

```kdu-html
<!-- only call `vm.submit()` when the `key` is `Enter` -->
<input @keyup.enter="submit" />
```

You can directly use any valid key names exposed via [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) as modifiers by converting them to kebab-case.

```kdu-html
<input @keyup.page-down="onPageDown" />
```

In the above example, the handler will only be called if `$event.key` is equal to `'PageDown'`.

### Key Aliases

Kdu provides aliases for the most commonly used keys:

- `.enter`
- `.tab`
- `.delete` (captures both "Delete" and "Backspace" keys)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### System Modifier Keys

You can use the following modifiers to trigger mouse or keyboard event listeners only when the corresponding modifier key is pressed:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Note
On Macintosh keyboards, meta is the command key (⌘). On Windows keyboards, meta is the Windows key (⊞). On Sun Microsystems keyboards, meta is marked as a solid diamond (◆). On certain keyboards, specifically MIT and Lisp machine keyboards and successors, such as the Knight keyboard, space-cadet keyboard, meta is labeled “META”. On Symbolics keyboards, meta is labeled “META” or “Meta”.
:::

For example:

```kdu-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
Note that modifier keys are different from regular keys and when used with `keyup` events, they have to be pressed when the event is emitted. In other words, `keyup.ctrl` will only trigger if you release a key while holding down `ctrl`. It won't trigger if you release the `ctrl` key alone.
:::

### `.exact` Modifier

The `.exact` modifier allows control of the exact combination of system modifiers needed to trigger an event.

```kdu-html
<!-- this will fire even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button @click.exact="onClick">A</button>
```

## Mouse Button Modifiers

- `.left`
- `.right`
- `.middle`

These modifiers restrict the handler to events triggered by a specific mouse button.
