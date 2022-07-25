import Modal from './Modal.kdu'
import { ref } from 'kdu'

export default {
  components: {
    Modal
  },
  setup() {
    const showModal = ref(false)

    return {
      showModal
    }
  }
}
