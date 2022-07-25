import { marked } from 'marked'
import { debounce } from 'lodash-es'
import { ref, computed } from 'kdu'

export default {
  setup() {
    const input = ref('# hello')

    const output = computed(() => marked(input.value))

    const update = debounce((e) => {
      input.value = e.target.value
    }, 100)

    return {
      input,
      output,
      update
    }
  }
}
