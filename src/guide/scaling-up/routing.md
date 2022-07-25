# Routing

## Official Router

For most Single Page Applications, it's recommended to use the officially-supported `kdu-router library`. For more details, see kdu-router's [documentation](https://kdujs-router.web.app/).

## Simple Routing from Scratch

If you only need very simple routing and do not wish to involve a full-featured router library, you can do so with [Dynamic Components](/guide/essentials/component-basics.html#dynamic-components) and update the current component state by listening to browser [`hashchange` events](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) or using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History).

Here's a bare-bone example:

<div class="composition-api">

```kdu
<script setup>
import { ref, computed } from 'kdu'
import Home from './Home.kdu'
import About from './About.kdu'
import NotFound from './NotFound.kdu'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFU8GOmzAQ/ZWRe4BIAbrSnhCJtJVa9bCqeuql7sGBSWETbMs2YaUk/75jQ9gki7QnmPF7b8Zvxkf2pHW6qzqWs8KWptEOLLpOr7lsWq2MgyMY3C6hVK3uHFZwhq1RLUREiibQT9XimE8zH3jN9+OnjercdB6iW8Av5X6oTlYT5pIYYVyWSloHhphoYQVHLgGiLMpD6eUQCS9MqVCAy/M7r+yMQel+C1cTmS4U942sVJ/uVSlco2RaC1svPGE8EFX1/UCU58Y6lGjiyCPKWsj/GC0hXsBqPXRxpZ0exL5DqjCnTg2FAjcd/WmwJ/zF3fhK19AcjByv/PdDldTumxLjhwWcTt6Jf/57sW2oVWTDSGmYFDhs9V44pAigEFCTDSvOvmScrb2JRSbWcLo/DJ4SIng6D5FKJvgafHKJpgYJ/s2oHUp4buTOkwLFX1JJAkHeWGJeWcAZZAQqsqlJtmTDbiSt0OmLVZJWNPjCxwPLWT445XO0Jz7mrHZO2zzLKPFiE7st0x43qdDaZ1LTSdfQeqJtk41RvUVD4pyFDRp1Mkoe0CTUXIUGzWe6d/AP2l6advFMV7o8Df/cbudRP4xDoJ97I6YHM0sbJzPDu35Es9THr48zxPMbDvZnNQ==)

</div>

<div class="options-api">

```kdu
<script>
import Home from './Home.kdu'
import About from './About.kdu'
import NotFound from './NotFound.kdu'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[Try it in the Playground](https://kdujs-sfc.web.app/#eNqFU01v2zAM/SuEdnACxPYK9GQ4ATpgww7FsNMu0w6KzcxqYkmQ5LpAk/8+Sv5omhrYJTGp9/goPuqVPRiTHeuOFax0lZXG77iSrdHWw3fdIhysbiHJ8hAEYDIfP+x15+fzGL0H/ND+m+5UPWOmxAjjqtLKebDERAdbeOUKIMmTIkpvhkiEwpSKAlxdAg9fokCNB9Gd/MCrhRer9fANYNF3Vk0RQNVZi8r/FL4poJeq1n120pXwUqusEa4ZgFSdfqJypVtDfdXFVGQs8Uti/6YzKw2X+O0b6bIrscydZIWruzWcz+Fqf8L/NIcPmi1lSfKt/NipqOuvz1TxUTqPCu0qCS1XjVB/MdkA4be7QOGee4DbHmiyyzcO8Ms6ysfBlvm8AhR4bM1JeKQIoBTQWDxsOfuUc7YL/pS52MH59jDaRYho1zJEaZXiS7yKTw01SPAvVh9RwaNUx0CKlOCAVgSCQjpiXhnAGeQEKvO5SbZhw9qlrTDZk9OKVjpOkY8HjrPZS85oBUPMWeO9cUWeU+LJpe5QZT3uM2FMyGSWDJG0+ejadG9179BScc6iXWOdnJLPaFNqrkaL9n91b+Afak+G0JWmVxee53s/mrvRBPq4HcT8FhdpozMLvOv3uUi9/3y/QLz8A+MEcZ4=)

</div>
