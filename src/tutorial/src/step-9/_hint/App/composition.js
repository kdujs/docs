import { ref, onMounted } from 'kdu'

export default {
  setup() {
    const p = ref(null)

    onMounted(() => {
      p.value.textContent = 'mounted!'
    })

    return {
      p
    }
  }
}
