# Kdu and Web Components

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) is an umbrella term for a set of web native APIs that allows developers to create reusable custom elements.

We consider Kdu and Web Components to be primarily complementary technologies. Kdu has excellent support for both consuming and creating custom elements. Whether you are integrating custom elements into an existing Kdu application, or using Kdu to build and distribute custom elements, you are in good company.

## Using Custom Elements in Kdu

Consuming custom elements inside a Kdu application largely works the same as using native HTML elements, with a few things to keep in mind:

### Skipping Component Resolution

By default, Kdu will attempt to resolve a non-native HTML tag as a registered Kdu component before falling back to rendering it as a custom element. This will cause Kdu to emit a "failed to resolve component" warning during development. To let Kdu know that certain elements should be treated as custom elements and skip component resolution, we can specify the [`compilerOptions.isCustomElement` option](/api/application.html#app-config-compileroptions).

If you are using Kdu with a build setup, the option should be passed via build configs since it is a compile-time option.

#### Example In-Browser Config

```js
// Only works if using in-browser compilation.
// If using build tools, see config examples below.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Example Wite Config

```js
// wite.config.js
import kdu from '@witejs/plugin-kdu'

export default {
  plugins: [
    kdu({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Example Kdu CLI Config

```js
// kdu.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('kdu')
      .use('kdu-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ion- as custom elements
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Passing DOM Properties

Since DOM attributes can only be strings, we need to pass complex data to custom elements as DOM properties. When setting props on a custom element, Kdu 3 automatically checks DOM-property presence using the `in` operator and will prefer setting the value as a DOM property if the key is present. This means that, in most cases, you won't need to think about this if the custom element follows the [recommended best practices](https://web.dev/custom-elements-best-practices/).

However, there could be rare cases where the data must be passed as a DOM property, but the custom element does not properly define/reflect the property (causing the `in` check to fail). In this case, you can force a `k-bind` binding to be set as a DOM property using the `.prop` modifier:

```kdu-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- shorthand equivalent -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Building Custom Elements with Kdu

The primary benefit of custom elements is that they can be used with any framework, or even without a framework. This makes them ideal for distributing components where the end consumer may not be using the same frontend stack, or when you want to insulate the end application from the implementation details of the components it uses.

### defineCustomElement

Kdu supports creating custom elements using exactly the same Kdu component APIs via the [`defineCustomElement`](/api/general.html#definecustomelement) method. The method accepts the same argument as [`defineComponent`](/api/general.html#definecomponent), but instead returns a custom element constructor that extends `HTMLElement`:

```kdu-html
<my-kdu-element></my-kdu-element>
```

```js
import { defineCustomElement } from 'kdu'

const MyKduElement = defineCustomElement({
  // normal Kdu component options here
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement only: CSS to be injected into shadow root
  styles: [`/* inlined css */`]
})

// Register the custom element.
// After registration, all `<my-kdu-element>` tags
// on the page will be upgraded.
customElements.define('my-kdu-element', MyKduElement)

// You can also programmatically instantiate the element:
// (can only be done after registration)
document.body.appendChild(
  new MyKduElement({
    // initial props (optional)
  })
)
```

#### Lifecycle

- A Kdu custom element will mount an internal Kdu component instance inside its shadow root when the element's [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) is called for the first time.

- When the element's `disconnectedCallback` is invoked, Kdu will check whether the element is detached from the document after a microtask tick.

  - If the element is still in the document, it's a move and the component instance will be preserved;

  - If the element is detached from the document, it's a removal and the component instance will be unmounted.

#### Props

- All props declared using the `props` option will be defined on the custom element as properties. Kdu will automatically handle the reflection between attributes / properties where appropriate.

  - Attributes are always reflected to corresponding properties.

  - Properties with primitive values (`string`, `boolean` or `number`) are reflected as attributes.

- Kdu also automatically casts props declared with `Boolean` or `Number` types into the desired type when they are set as attributes (which are always strings). For example given the following props declaration:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  And the custom element usage:

  ```kdu-html
  <my-element selected index="1"></my-element>
  ```

  In the component, `selected` will be cast to `true` (boolean) and `index` will be cast to `1` (number).

#### Events

Events emitted via `this.$emit` or setup `emit` are dispatched as native [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) on the custom element. Additional event arguments (payload) will be exposed as an array on the CustomEvent object as its `detail` property.

#### Slots

Inside the component, slots can be rendered using the `<slot/>` element as usual. However, when consuming the resulting element, it only accepts [native slots syntax](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- [Scoped slots](/guide/components/slots.html#scoped-slots) are not supported.

- When passing named slots, use the `slot` attribute instead of the `k-slot` directive:

  ```kdu-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject

The [Provide / Inject API](/guide/components/provide-inject.html#provide-inject) and its [Composition API equivalent](/api/composition-api-dependency-injection.html#provide) also work between Kdu-defined custom elements. However, note that this works **only between custom elements**. i.e. a Kdu-defined custom element won't be able to inject properties provided by a non-custom-element Kdu component.

### SFC as Custom Element

`defineCustomElement` also works with Kdu Single-File Components (SFCs). However, with the default tooling setup, the `<style>` inside the SFCs will still be extracted and merged into a single CSS file during production build. When using an SFC as a custom element, it is often desirable to inject the `<style>` tags into the custom element's shadow root instead.

The official SFC toolings support importing SFCs in "custom element mode" (requires `@witejs/plugin-kdu@^1.4.0` or `kdu-loader@^16.5.0`). An SFC loaded in custom element mode inlines its `<style>` tags as strings of CSS and exposes them under the component's `styles` option. This will be picked up by `defineCustomElement` and injected into the element's shadow root when instantiated.

To opt-in to this mode, simply end your component file name with `.ce.kdu`:

```js
import { defineCustomElement } from 'kdu'
import Example from './Example.ce.kdu'

console.log(Example.styles) // ["/* inlined css */"]

// convert into custom element constructor
const ExampleElement = defineCustomElement(Example)

// register
customElements.define('my-example', ExampleElement)
```

### Tips for a Kdu Custom Elements Library

When building custom elements with Kdu, the elements will rely on Kdu's runtime. There is a ~16kb baseline size cost depending on how many features are being used. This means it is not ideal to use Kdu if you are shipping a single custom element - you may want to use vanilla JavaScript, [petite-kdu](https://github.com/kdujs/petite-kdu), or frameworks that specialize in small runtime size. However, the base size is more than justifiable if you are shipping a collection of custom elements with complex logic, as Kdu will allow each component to be authored with much less code. The more elements you are shipping together, the better the trade-off.

If the custom elements will be used in an application that is also using Kdu, you can choose to externalize Kdu from the built bundle so that the elements will be using the same copy of Kdu from the host application.

It is recommended to export the individual element constructors to give your users the flexibility to import them on-demand and register them with desired tag names. You can also export a convenience function to automatically register all elements. Here's an example entry point of a Kdu custom element library:

```js
import { defineCustomElement } from 'kdu'
import Foo from './MyFoo.ce.kdu'
import Bar from './MyBar.ce.kdu'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// export individual elements
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

If you have many components, you can also leverage build tool features such as Wite's [glob import](https://witejs.web.app/guide/features.html#glob-import) or webpack's [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) to load all components from a directory.

## Web Components vs. Kdu Components

Some developers believe that framework-proprietary component models should be avoided, and that exclusively using Custom Elements makes an application "future-proof". Here we will try to explain why we believe that this is an overly simplistic take on the problem.

There is indeed a certain level of feature overlap between Custom Elements and Kdu Components: they both allow us to define reusable components with data passing, event emitting, and lifecycle management. However, Web Components APIs are relatively low-level and bare-bones. To build an actual application, we need quite a few additional capabilities which the platform does not cover:

- A declarative and efficient templating system;

- A reactive state management system that facilitates cross-component logic extraction and reuse;

- A performant way to render the components on the server and hydrate them on the client (SSR), which is important for SEO and [Web Vitals metrics such as LCP](https://web.dev/vitals/). Native custom elements SSR typically involves simulating the DOM in Node.js and then serializing the mutated DOM, while Kdu SSR compiles into string concatenation whenever possible, which is much more efficient.

Kdu's component model is designed with these needs in mind as a coherent system.

With a competent engineering team, you could probably build the equivalent on top of native Custom Elements - but this also means you are taking on the long-term maintenance burden of an in-house framework, while losing out on the ecosystem and community benefits of a mature framework like Kdu.

There are also frameworks built using Custom Elements as the basis of their component model, but they all inevitably have to introduce their proprietary solutions to the problems listed above. Using these frameworks entails buying into their technical decisions on how to solve these problems - which, despite what may be advertised, doesn't automatically insulate you from potential future churns.

There are also some areas where we find custom elements to be limiting:

- Eager slot evaluation hinders component composition. Kdu's [scoped slots](/guide/components/slots.html#scoped-slots) are a powerful mechanism for component composition, which can't be supported by custom elements due to native slots' eager nature. Eager slots also mean the receiving component cannot control when or whether to render a piece of slot content.

- Shipping custom elements with shadow DOM scoped CSS today requires embedding the CSS inside JavaScript so that they can be injected into shadow roots at runtime. They also result in duplicated styles in markup in SSR scenarios. There are [platform features](https://github.com/whatwg/html/pull/4898/) being worked on in this area - but as of now they are not yet universally supported, and there are still production performance / SSR concerns to be addressed. In the meanwhile, Kdu SFCs provide [CSS scoping mechanisms](/api/sfc-css-features.html) that support extracting the styles into plain CSS files.

Kdu will always be staying up to date with the latest standards in the web platform, and we will happily leverage whatever the platform provides if it makes our job easier. However, our goal is to provide solutions that work well and work today. That means we have to incorporate new platform features with a critical mindset - and that involves filling the gaps where the standards fall short while that is still the case.
