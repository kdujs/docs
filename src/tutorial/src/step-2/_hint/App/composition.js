import { reactive, ref } from 'kdu'

export default {
  setup() {
    const counter = reactive({ count: 0 })
    const message = ref('Hello World!')

    return {
      counter,
      message
    }
  }
}
