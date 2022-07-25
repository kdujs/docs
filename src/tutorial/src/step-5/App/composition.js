import { ref } from 'kdu'

export default {
  setup() {
    const text = ref('')

    function onInput(e) {
      text.value = e.target.value
    }

    return {
      text,
      onInput
    }
  }
}
