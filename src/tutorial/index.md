---
page: true
title: Tutorial
sidebar: false
aside: false
footer: false
returnToTop: false
---

<script>
import { defineAsyncComponent } from 'kdu'
import ReplLoading from '/@theme/components/ReplLoading.kdu'

export default {
  components: {
    TutorialRepl: defineAsyncComponent({
      loader: () => import('./TutorialRepl.kdu'),
      loadingComponent: ReplLoading
    })
  }
}
</script>

<ClientOnly>
  <TutorialRepl />
</ClientOnly>
