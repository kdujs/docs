import { ref } from 'kdu'

export default {
  setup() {
    const awesome = ref(true)

    function toggle() {
      // ...
    }

    return {
      awesome,
      toggle
    }
  }
}
