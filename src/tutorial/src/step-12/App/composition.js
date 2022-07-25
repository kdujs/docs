import { ref } from 'kdu'
import ChildComp from './ChildComp.kdu'

export default {
  components: {
    ChildComp
  },
  setup() {
    const greeting = ref('Hello from parent')

    return {
      greeting
    }
  }
}
