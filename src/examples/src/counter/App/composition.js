import { ref } from 'kdu'

export default {
  setup() {
    const count = ref(0)

    return {
      count
    }
  }
}
