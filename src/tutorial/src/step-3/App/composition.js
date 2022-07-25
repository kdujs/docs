import { ref } from 'kdu'

export default {
  setup() {
    const titleClass = ref('title')

    return {
      titleClass
    }
  }
}
