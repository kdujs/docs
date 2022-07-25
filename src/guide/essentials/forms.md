---
outline: deep
---

<script setup>
import { ref } from 'kdu'
const message = ref('')
const multilineText = ref('')
const checked = ref(false)
const checkedNames = ref([])
const picked = ref('')
const selected = ref('')
const multiSelected = ref([])
</script>

# Form Input Bindings

When dealing with forms on the frontend, we often need to sync the state of form input elements with corresponding state in JavaScript. It can be cumbersome to manually wire up value bindings and change event listeners:

```kdu-html
<input
  :value="text"
  @input="event => text = event.target.value">
```

The `k-model` directive helps us simplify the above to:

```kdu-html
<input k-model="text">
```

In addition, `k-model` can be used on inputs of different types, `<textarea>`, and `<select>` elements. It automatically expands to different DOM property and event pairs based on the element it is used on:

- `<input>` with text types and `<textarea>` elements use `value` property and `input` event;
- `<input type="checkbox">` and `<input type="radio">` use `checked` property and `change` event;
- `<select>` use `value` as a prop and `change` as an event.

::: tip Note
`k-model` will ignore the initial `value`, `checked` or `selected` attributes found on any form elements. It will always treat the current bound JavaScript state as the source of truth. You should declare the initial value on the JavaScript side, using <span class="options-api">the `data` option</span><span class="composition-api">reactivity APIs</span>.
:::

## Basic Usage

### Text

```kdu-html
<p>Message is: {{ message }}</p>
<input k-model="message" placeholder="edit me" />
```

<div class="demo">
  <p>Message is: {{ message }}</p>
  <input k-model="message" placeholder="edit me" />
</div>

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNo9j02OwyAMha9iscmMNAn7ilaaA8wNvEkTZ0obwMJEXUTcvUaNunwf7wfv5pd5eMybORknU/ZcQKhsfMHoA6dcYIdMC1RYcgrQqbXDiHFKUQoEEhn/Cc7N89V13xidfddogYpCgdexkCoAx5e/I+DlBPv+ydfqbJvE4nzkrcCjD2mm9YzmsKABLZroltaZsnKafdtXbjXo7GfJ/Jj3z/sw8nCXFPW2ve3j8SBodL2RxvSiptHcSmE5WavgLr0s0/Ck6zAyNzLkLRYfaCAJ/TWnp1DWcjStpmKspr4AQDhzJQ==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNo9UNFuwyAM/BXLL92kBd4jVmkfsD/ghRZ3pQ3EAkedFOXf5yxNJQTcwZ19nvGL2dzjhD26dq6J5egL/fJYBSJdwjQIzL4AxCDh7X27A1SSqZYdAWRqLfxQD4fDRi3roZsuZ1/GCoQyD0FIEYDj4/emhNR6mOfdCJbFWV4V4lLhSeDe5THS8Onx+cUjqNGZruMQqSpPMYnqlbcqdPZVCT8w5TVRlwObWxuLpv1v3T8fmketvnXuUcexYo9XEW69tUrcWtcuZ/OgkwnMK2PqVCRlMtRyd6rjo1FVc497clz+APSOdwg=)

</div>

<span id="kmodel-ime-tip"></span>
::: tip Note
For languages that require an [IME](https://en.wikipedia.org/wiki/Input_method) (Chinese, Japanese, Korean etc.), you'll notice that `k-model` doesn't get updated during IME composition. If you want to respond to these updates as well, use your own `input` event listener and `value` binding instead of using `k-model`.
:::

### Multiline text

```kdu-html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea k-model="message" placeholder="add multiple lines"></textarea>
```

<div class="demo">
  <span>Multiline message is:</span>
  <p style="white-space: pre-line;">{{ message }}</p>
  <textarea k-model="message" placeholder="add multiple lines"></textarea>
</div>

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNo9kEtuwzAMRK9CaOMWqO296wToAXoDbRSbaZToQ4g00sLw3Uvlt5zhzMOAq/ki6i7zYgYz8lQ8CTDKQnubfKRcBFYoeIQNjiVHaDTa2GTTlBMLRGR2Pwi7mnlrmnebxv6OUYAKwUjBCVYlI5NL++8liA8+4avtedBWvd1SBCx/AXfWXE9esNXLhANQwbbWPq3Zr+urvG1jX9dqUfBXXEEHlzbmGYMSHilrQGdMeMphxqK+m2eIdQgFhEplpY79k6C8Kh7bzYe5/6KNjroz56TfWm0CsI+Dtge4OdXTH1VtzUmEeOh7Nc7c8nHqrnjoHFF1urIk8RE75NgeSr4yFoVbUzGbTZvZ/gGLkJJ8)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNo9UNFuwyAM/BWLl27SkrxnWaV9wP6AFxrclRaIhR21U5R/n2mbSgi4s+9s3WK+idqLn01vBh5LINnbjDeaioDHo5ujwGIzgHfi3t4ff4CCMpe8IYCEzO4Xe9jtHtRaH730DN3LWIFgougEK5KByeX9jw4JMWTcbCBwr6pau3cRsPxF/LLmegqCjVZGnUUFmyr7tGa/LC/xug4dPYSCN3EFHVyaNHmM6vDssgZ0jRFPU/RYlHfeQ6qLUESorqyuQ7c5qF8Fz93NhwmpZtQkR+2Zp6z53cOwz4Kq+y0eazTgiq05iRD3XafEmRs+ju0VD60jqkxb5iwhYYucmkOZroxFza3ZsjTrP366ll8=)

</div>

Note that interpolation inside `<textarea>` won't work. Use `k-model` instead.

```kdu-html
<!-- bad -->
<textarea>{{ text }}</textarea>

<!-- good -->
<textarea k-model="text"></textarea>
```

### Checkbox

Single checkbox, boolean value:

```kdu-html
<input type="checkbox" id="checkbox" k-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

<div class="demo">
  <input type="checkbox" id="checkbox-demo" k-model="checked" />
  <label for="checkbox-demo">{{ checked }}</label>
</div>

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpVj82KwzAMhF9F+NJd2Nj3kBb2PXTJj0LTxLawFbpL8LvXTtpCj/NpZtBs6pdZz8OqatXEPkwsEElWvqCbLPsgsEGgERKMwVs4ZesJHbreuyjQX6mfaYBz8XxJWOkbXWOOolyRhZDlpRUqSprJ8Sog/0xnVHu683+oYBo+9VxZP9DygjRkZo6Kpe1ogdGHj8Rl297fpNSY3ZUDjXk/oH7UMamyLetb9C6P3tAB4PMQUdWwk8Ly1KJRXUU41sZkcItVHHt9p063zIXosDqZLGmKtuqCv0cKuRxVqUnokkoPKu59FA==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNpVUNFqwzAM/BWhpw0W+z1khf2HX5xYpWliW9gy7Qj59znJUigY23eSDt0t+MOsJlewxS4PaWS5mEBPjknA0dWWWWAxAcBZsR+fxx8gkZQUTgQw3GiYyLUgqdBBrttTr3o6/ZKuQMjzbIU2JN0YuAjIL9O3wV2mj0+DMLp3PDU+OppPklzl9CEx255muMb0NnFZlnMtWNdO7111oNOvBfALR79Zbbxldc8x1Bh2T+a/kA22p0uDNacNG7yJcG61rsQ9N/k6qAf1yjJvjEolyOhJUfZNn+IjU6riBs9AcP0DStSA9w==)

</div>

We can also bind multiple checkboxes to the same array or [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) value:

<div class="composition-api">

```js
const checkedNames = ref([])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      checkedNames: []
    }
  }
}
```

</div>

```kdu-html
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" k-model="checkedNames">
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" k-model="checkedNames">
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" k-model="checkedNames">
<label for="mike">Mike</label>
```

<div class="demo">
  <div>Checked names: {{ checkedNames }}</div>

  <input type="checkbox" id="demo-jack" value="Jack" k-model="checkedNames">
  <label for="demo-jack">Jack</label>

  <input type="checkbox" id="demo-john" value="John" k-model="checkedNames">
  <label for="demo-john">John</label>

  <input type="checkbox" id="demo-mike" value="Mike" k-model="checkedNames">
  <label for="demo-mike">Mike</label>
</div>

In this case, the `checkedNames` array will always contain the values from the currently checked boxes.

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqVks1OwzAQhF9l5QsgkeRepZEQNyR4AczBSTaqm/hHttOCorw7u3Up5UZvmd2ZbyKtF/HkfTn2s9iIOnZB+wQR0+wbabXxLiRYIOAAKwzBGbgj65200nbOxgTdDrsR+zdlMMKWjffvHw/S1lVmEYVEQuMnlZAUQN3rQ/Occ2A5uIFl+Uta17piG6cpoa2fE6Qvj1spTsbWfUoBuie9V91I3wc1zbx+yXIsjOtx+vGfwbSo8k9MqsUJBhcuhIaTdXVasOcfzW5nr5uzvKn5FGk4eVOz0SNeNb9meUtzJjSc/G2uq8ulxKPI5y+M8uU+OksPZGGMPC8ITIfjCc/oWbCWYpeSj5uqosE+FnHoyiO2pfKeJ2WYbdIGS4ymaIM7RgwEl4Ixq7SrWL8BZjjgRA==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqVUk1rwzAM/SvCpw2W+F6ywNhtsP2BeQcnVqmb+APbaTtC/vvkuO262wrG1pP03jNIM3vxvh7UxDasiX3QPrXC4sm7kEDhVk5jgllYACWTfHgsMUDANAV7QQD9DvsB1Yc0GDfw+VXyS37ootPwqzqBhMaPMiEhgEbpQ/taBMAWhXn+IwnL0vDcltnE0NZPCdK3x2fB1sbOnQQDrQjvZT9QfJDjlMtvBQ6VcQrHS/9ZmAq8fGKUHY6wdeGq0GZmw9dC7vmHs9vZW+cC73JeKW1m3uVs9IA3zu8F3uNcFNrM/HVu+HVS7Ilpk9eiMtLX++gsrcw6f3EukDANrkxeMNqpjAXbpeTjhnNK7GMVt319xK6W3udMHSabtMEao6m64I4RA4kLdtkctvwAEfXkJw==)

</div>

### Radio

```kdu-html
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" k-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" k-model="picked" />
<label for="two">Two</label>
```

<div class="demo">
  <div>Picked: {{ picked }}</div>

  <input type="radio" id="one" value="One" k-model="picked" />
  <label for="one">One</label>

  <input type="radio" id="two" value="Two" k-model="picked" />
  <label for="two">Two</label>
</div>

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFUEFOxDAM/IqVS0GizX2VrcQL4MAxl27riuw2iZW4u0JV/47TpcAFcfOMPTPyLOqZqLkMszook/vkiCEjz9Ta4DzFxLBAwhFWGFP0UMlpZYMNfQyZgVx/wQGO5eSheglYPdpg9N1ILAQwepo6RkEAZnDX9nUTHWBZdv26Gl02RWDZuEAzA38QHq1K3eCiVeAGATGgjNdumstK8gRdah8HnATf3YTSxYnN1J1wgjGmXdmKwuiN/j+Lb2Xcs9429EeWPPY7a1O2ovjJMvq7B/Wk7s3WvqPmnGOQ7pdiYr8W2SpppzCFk8YLtuqdmfJBayHOuc5j39zw1HREhWnSHNh5bDD7+pTiLWMSc6uKzWrDqtZPoqKo6A==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqNUctuxCAM/BWLy7ZSE+6rNFK/oD30yIUNjsomAQTOplWUf6/JY3vsSgg8Y8YjjWfxFkLZmVGcRZWaaAPVyuF38JHAYKvHnmBWDsBo0k/PWw0QkcboDgQQbNOhOcPp3eFpI5f88MWnkvfRDAiH0GvCjKgy9lZ/7Op53gfBslQyd7KAP1kXRgL6CfiqRNTGeiXAGgbeIZc33Y+5xe6MumLwBnvG2zSm5GbW6wv20Pp4KGtWVHKl//eiKZeH1+eKHvNalTUr/rwqec9BvAg75MSLQYfymrzjbazRqr2RlOB0tlyV4HVlrMQXUUhnKZm4piK1TTnhpdQhZKaMoyM7YIlpKC7RTwkjD1fi2ItYfgH6m63r)

</div>

### Select

Single select:

```kdu-html
<div>Selected: {{ selected }}</div>

<select k-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Selected: {{ selected }}</div>
  <select k-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp1kM9ugzAMh1/FyoVNGnBHFKnbC0zaNZcARqPNP8VhPaC8+xxgq3ro0T9//hJ7FWfvq+u4iEa0NITZRyCMi++knY13IcIKASdIMAVnoGC0kFbawVnKqMYh4ginDL0Uxau0bb172MBFROO1isgVQEte2Q6+jqkG1vWuSIkncz/PZXZrwLU0bkR9kuKPlGKTMeJ8nJ2FcSbVa1b8KL0gk0x8alSEhx2cxbbe6cfZ7vwkf3+Sfzzk/OPtAS7a+n9V8Sb225VG+epCzvJ118zLo0FS8PK7WQq+aa6l+I7RU1PXHFyopGmobthXyvucVGGxcTZYIZmyD+5GGFjO27ImSZtE+gVy7Z7D)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp1UctqwzAQ/JVFl7RQ2/fgGtL+QKFXXWRrQ53ohXbdFIz/vetHDDkEhKQZzY60o1GdUiqvdlBHVVOX+8SNDviXYmaweDaDYxh1ALCGzcvrugfIyEMOdwRA6LBjtEc4HFZumheZZNTV7iyA0SdnGAUB1JRMaOB7Lx/H3QumSSrn81W50HAtfLTo3rW667RaBCKJifsYwPZkWicGv8YNKEpRfDk0hJs3xIB1taofa5vTE/7jCf/5wMt7lwsE1NXeqHpTvZ8TLbxJ5YVikLSX6PR2QFpJ66uzVvIdM9bqhznRsaqEuFBB5668YVualGamzEPg3mOJ5Is2xxthFnPpdgteTf+5xqHc)

</div>

:::tip Note
If the initial value of your `k-model` expression does not match any of the options, the `<select>` element will render in an "unselected" state. On iOS this will cause the user not being able to select the first item because iOS does not fire a change event in this case. It is therefore recommended to provide a disabled option with an empty value, as demonstrated in the example above.
:::

Multiple select (bound to array):

```kdu-html
<div>Selected: {{ selected }}</div>

<select k-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Selected: {{ multiSelected }}</div>

  <select k-model="multiSelected" multiple>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp1UMtugzAQ/JWVL2mlAumVEqS0n9BjnAMBozjB9speSivEv3cNRG0OuXnG81jNKPaI6bXpRS6KUHuNBEFRj6W02qDzBCN41cIErXcGNizdSCtt7WyI0k7VpBrYRdHT4fgsbZEtOZzAgJTBriLFCKBo9Ff5uXpyGMe/gGkqsvgbTSxceLgmxjWq20lxE0oBpu9IY7dEstYhaWfLfZGtr3v+/QH/ccfz1XMDgyL7dzTDQD9z2SI43OqPMEbjoBs65/C63eL3m7TTPMDsEC9imTAxFaaX4CyPPHvk+hGk4BWWs6TgaSOW4kyEIc8yJi4hCW2dDuqUVoiRSX1vSRuVqmCSk3dDUJ7DpYgx3D6J6RewWqNd)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp1UctugzAQ/JWVT61UIL1SGintJ/QY50DwRnGCsWUvJRXi37vGATWHSpbtmX2NZkexcy6/ql6UogqN1462ssObs55A4anuW4JRdgCqpvrpOf0BPFLvuwUBBGyxIVQl7A+Jm+LDF5+qWDszIDSurQkZAVRKf2+/1uJxXDvBNFVFjMYiTkw8XDNjFbbvUiyJUoBhldq1qSXnWkfadttdVdx/j/zHP/znA8+q5wkMquKPaIaBfuZhKWG/jD8kPwat6FzC62bjbm+LAXOFeBHaRGszU7v8EmzHts818h4IUrALSZYUvJeIpTgTuVAWBROXkIVTkw94zGvnIpP7viNtMMdgsqO3Q0DPzaVYNiCmX3/Ep0A=)

</div>

Select options can be dynamically rendered with `k-for`:

<div class="composition-api">

```js
const selected = ref('A')

const options = ref([
  { text: 'One', value: 'A' },
  { text: 'Two', value: 'B' },
  { text: 'Three', value: 'C' }
])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'One', value: 'A' },
        { text: 'Two', value: 'B' },
        { text: 'Three', value: 'C' }
      ]
    }
  }
}
```

</div>

```kdu-html
<select k-model="selected">
  <option k-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Selected: {{ selected }}</div>
```

<div class="composition-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNplUctugzAQ/JWVL7RSMHdEIqX9gB7aW90DgUUhwQ/ZJlRC/veuMaGpevPsjGZnvDM7GsOv7chKVrnG9saDQz+ag1C9NNp6mMFiBwE6qyVkJM2EEqrRykXpgI3HFvZR9JQds+dfUhvf02PlPoUC8vL47UvI3hRmO7jVw4iEjhmE3R/+Y9IP/Mt//mzx0eGVFEJ90faqSDWoAAGP0gy1R0IAVYoL11zqFoe9YPf8gi0CkqTQJOm0JcEKe3VvIxiUy9KN5AvcHCjkvIp5DAuBgi3WRZqmKEVavaQUvmr72+F9DVNGh+1nQ6iKyMZmWxu2Y+k6uawNvzit6H5zNBYrQUHJJ20WjK4WsWBn740ri4IGF5e7ruETnnhtTJxwOyrfS+ToZH6yenJoyVywaEMtAgs/eNa9Bw==)

</div>
<div class="options-api">

[Try it in the Playground](https://kdujs-sfc.web.app/#eNp1UsFuwyAM/RWLSzepIfcoq9TtA3bYbmMH2rhq2gQQOG2lqP8+B0KUyySEePazeQ8zir1z8toMohJ1OPrW0U4ZfDjrCRo86aEjGJUBaDTpl9d0BvBIgzcZAQTs8EjYVLDZb7Y5ah211oQKfnIEYATCBzHv0+BmCzfdDRir4LnUrVjfd7tivf/HOntcd/tgXqb9pkPEvPGqy8UpA8LedZqQEUCdjMC16G2D3ZsS2ZkSkcCU5IopJ+uZMMPWZLtKQBWFLEkZ4dKBhY8zWU4G4DmLrcsUTVLKdHVUqahu2tvua3lm7pCVcXldTtnJ2eJGbEXbT2Mseu3kJVjDI47zUnOChXKfdLMS/AcmrMSZyIWqLDlwCUU4HeUdD1I7N0WkHwy1PUoMfXHw9h7Qc3Ml8uuK5x8SpcAU)

</div>

## Value Bindings

For radio, checkbox and select options, the `k-model` binding values are usually static strings (or booleans for checkbox):

```kdu-html
<!-- `picked` is a string "a" when checked -->
<input type="radio" k-model="picked" value="a" />

<!-- `toggle` is either true or false -->
<input type="checkbox" k-model="toggle" />

<!-- `selected` is a string "abc" when the first option is selected -->
<select k-model="selected">
  <option value="abc">ABC</option>
</select>
```

But sometimes we may want to bind the value to a dynamic property on the current active instance. We can use `k-bind` to achieve that. In addition, using `k-bind` allows us to bind the input value to non-string values.

### Checkbox

```kdu-html
<input
  type="checkbox"
  k-model="toggle"
  true-value="yes"
  false-value="no" />
```

`true-value` and `false-value` are Kdu-specific attributes that only work with `k-model`. Here the `toggle` property's value will be set to `'yes'` when the box is checked, and set to `'no'` when unchecked. You can also bind them to dynamic values using `k-bind`:

```kdu-html
<input
  type="checkbox"
  k-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

:::tip Tip
The `true-value` and `false-value` attributes don't affect the input's `value` attribute, because browsers don't include unchecked boxes in form submissions. To guarantee that one of two values is submitted in a form (e.g. "yes" or "no"), use radio inputs instead.
:::

### Radio

```kdu-html
<input type="radio" k-model="pick" :value="first" />
<input type="radio" k-model="pick" :value="second" />
```

`pick` will be set to the value of `first` when the first radio input is checked, and set to the value of `second` when the second one is checked.

### Select Options

```kdu-html
<select k-model="selected">
  <!-- inline object literal -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`k-model` supports value bindings of non-string values as well! In the above example, when the option is selected, `selected` will be set to the object literal value of `{ number: 123 }`.

## Modifiers

### `.lazy`

By default, `k-model` syncs the input with the data after each `input` event (with the exception of IME composition as [stated above](#kmodel-ime-tip)). You can add the `lazy` modifier to instead sync after `change` events:

```kdu-html
<!-- synced after "change" instead of "input" -->
<input k-model.lazy="msg" />
```

### `.number`

If you want user input to be automatically typecast as a number, you can add the `number` modifier to your `k-model` managed inputs:

```kdu-html
<input k-model.number="age" />
```

If the value cannot be parsed with `parseFloat()`, then the original value is used instead.

The `number` modifier is applied automatically if the input has `type="number"`.

### `.trim`

If you want whitespace from user input to be trimmed automatically, you can add the `trim` modifier to your `k-model`-managed inputs:

```kdu-html
<input k-model.trim="msg" />
```

## `k-model` with Components

> If you're not yet familiar with Kdu's components, you can skip this for now.

HTML's built-in input types won't always meet your needs. Fortunately, Kdu components allow you to build reusable inputs with completely customized behavior. These inputs even work with `k-model`! To learn more, read about [Usage with `k-model`](/guide/components/events.html#usage-with-k-model) in the Components guide.
