<script setup>
import ListBasic from './transition-demos/ListBasic.kdu'
import ListMove from './transition-demos/ListMove.kdu'
import ListStagger from './transition-demos/ListStagger.kdu'
</script>

# TransitionGroup

`<TransitionGroup>` is a built-in component designed for animating the insertion, removal, and order change of elements or components that are rendered in a list.

## Differences from `<Transition>`

`<TransitionGroup>` supports the same props, CSS transition classes, and JavaScript hook listeners as `<Transition>`, with the following differences:

- By default, it doesn't render a wrapper element. But you can specify an element to be rendered with the `tag` prop.

- [Transition modes](./transition.html#transition-modes) are not available, because we are no longer alternating between mutually exclusive elements.

- Elements inside are **always required** to have a unique `key` attribute.

- CSS transition classes will be applied to individual elements in the list, **not** to the group / container itself.

:::tip
When used in [DOM templates](/guide/essentials/component-basics.html#dom-template-parsing-caveats), it should be referenced as `<transition-group>`.
:::

## Enter / Leave Transitions

Here is an example of applying enter / leave transitions to a `k-for` list using `<TransitionGroup>`:

```kdu-html
<TransitionGroup name="list" tag="ul">
  <li k-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

<ListBasic />

## Move Transitions

The above demo has some obvious flaws: when an item is inserted or removed, its surrounding items instantly "jump" into place instead of moving smoothly. We can fix this by adding a few additional CSS rules:

```css{1,13-17}
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
```

Now it looks much better - even animating smoothly when the whole list is shuffled:

<ListMove />

[Full Example](/examples/#list-transition)

## Staggering List Transitions

By communicating with JavaScript transitions through data attributes, it's also possible to stagger transitions in a list. First, we render the index of an item as a data attribute on the DOM element:

```kdu-html{11}
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    k-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

Then, in JavaScript hooks, we animate the element with a delay based on the data attribute. This example is using the [GreenSock library](https://greensock.com/) to perform the animation:

```js{5}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```

<ListStagger />

<div class="composition-api">

[Full Example in the Playground](https://kdujs-sfc.web.app/#eNqlVE1v2zAM/SuEL3aGWG4P28FIu63BNmALdtpt3sG16USNLGn6aBcE+e+jZLutU2DA0EtsPVKPj4+Mj8lHrdm+9UmZrGxjuHZg0Xl9XUnea2UcHMFgt4RG9do7bOEEnVE9pHQpfUza2lqPeHilQCUbJa0DwennCn5WEoiqt9sS0hvjG4QNYgqn5fPA17rZc4T1rpbnofXON3v4rozh9sU1dLDh5+g3L7fw2ZsDBSr560nSb4/mQJqoryxNF0+BqcfNoHk6ZtkCrq7hGMgNmWNk7Ip1XDg0WcYd9jEjvDAqzpzaqAc069pitmBcNsK3aLNYmN3XwuOCyp5i6c7LxnElQckb7JTBTzKwolgMFVEw6w4CmdJ1w10QfjHDd8i3u6CXYGp0xjhxLaFVEkfGMCGSGOEIAIzcJVxGCwEGUnLxkr3DPh3RFkVNSVS6rR0156i3Fv/AG7hgl2/HJCXXZJxAh2WsGtDQ6rm2Ddb3+D/aLs60TefXqloVw+bTztOBZqhF7ZBOACsuaQVgn/eKqlxVSRxhlUAxhH+YWloeGvpilNdDKVdvKdOLKhnOZWMtAV0tLE7Yh9s46xzDgCg4G/5j0lN0jotgXcSjiQMeFZEmwYcXINlESWlxQ5cQXVnQY7boEynp3OOBsqctfhYIvubxeoiH5xQci9K/7vi4/nAiU6OUQvDBp+LMKEJXxTOnk2UyfEnynuZ/Z5WkD1KcP9WLAVsl5bQRVRLWJABVsnNO27IovNT7LaPGihB7T/PygowZp18l9LmaXyDgzua2a9gD3rJa64Aw46XjPTK0fX5r1INFQ3LmPAWB92hyg+SECWP5N+9Z+gvuuIq0icnpL1Bh19A=)

</div>
<div class="options-api">

[Full Example in the Playground](https://kdujs-sfc.web.app/#eNqtVE2P0zAQ/SujXNqixtk9wKHqLrAVIEHFiRvh4E2mjTeOHfyxu1XV/87YabJpizigraoknjd+fn4z9j752LasLn2ySJa2MKJ1t7kSTauNg63lLWyMbmASPie5ylWhlXUgBT1u4GeuAPbQ2O0CJnfGFwhrxAkc5mPgKy9qgbCquDqHVpUvaviujRH2Yho6WIvz6DevtvDZmx0BufoVJOFzVFvihnvpYB/SS+74dNZ9Axh03qh+BPDbo9kRGe0oDImIHnGZQjetd1gu+uQ+sKYdvxAOlMEIthHSoZlOhcNmBje3ED4Y6WVOr/UTmhW3OJ0xoQrpS7RTVwnLoojZ7EJCg67SpR0UaHWHG23wkwqLoByJQMms20lkuuWFcDsqydUFVqHYVqFaR6hbJfD2jHMotcIRb6g2aY/QEKQZ3SoLuD5ShF9HT2Zes3fYTEZIiZJTMgkJ1bDoyIASn+ENXLHrt6NErVbkskSHi6ikRw69OYPiNfJH/B/FV39RPI69ntZYyFzRf5kNB4oG1BKt5A5pBLAUiroK6rTRtPJNnsRmyBPIOviH4coKJ7T6YrRvO2rHt5TpZZ5040VhLQU2XFrsYx/uY6+kGEpL4EnzDEkv6GlcBntjPBrdxaMi0iRFv9c6JUpKiw0/h+jUjF4nh6UnJZ017ii7PxQjIHidxukBD+8ePC5K534/nCY4RHNJSiZF51N2ZhRFl9nI6WSedHdZ2lB/PFit6J6L/UHrRcDmyXDS8iS0UQjkSeVcaxdZ5lVbbxltLAvYe6qXl2TMsSPyhK7O0wkUeLCp3RTsCe8Zb9sQYcYrJxpkaJv03ugni4bknPJkFHxEkxokJ0woy795z9IvuPtOTA5/ABVP3PE=)

</div>

---

**Related**

- [`<TransitionGroup>` API reference](/api/built-in-components.html#transitiongroup)
