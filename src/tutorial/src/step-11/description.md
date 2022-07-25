# Components

So far, we've only been working with a single component. Real Kdu applications are typically created with nested components.

A parent component can render another component in its template as a child component. To use a child component, we need to first import it:

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.kdu'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.kdu'

export default {
  components: {
    ChildComp
  }
}
```

We also need to register the component using the `components` option. Here we are using the object property shorthand to register the `ChildComp` component under the `ChildComp` key.

</div>
</div>

<div class="sfc">

Then, we can use the component in the template as:

```kdu-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

We also need to register the component using the `components` option. Here we are using the object property shorthand to register the `ChildComp` component under the `ChildComp` key.

Because we are writing the template in the DOM, it will be subject to browser's parsing rules, which is case-insensitive for tag names. Therefore, we need to use the kebab-cased name to reference the child component:

```kdu-html
<child-comp></child-comp>
```

</div>


Now try it yourself - import the child component and render it in the template.
