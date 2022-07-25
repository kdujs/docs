---
page: true
title: Examples
aside: false
footer: false
returnToTop: false
---

<script>
import { defineAsyncComponent } from 'kdu'
import ReplLoading from '/@theme/components/ReplLoading.kdu'

export default {
  components: {
    ExampleRepl: defineAsyncComponent({
      loader: () => import('./ExampleRepl.kdu'),
      loadingComponent: ReplLoading
    })
  }
}
</script>

<ClientOnly>
  <ExampleRepl />
</ClientOnly>
