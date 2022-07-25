import { ref } from 'kdu'
import ChildComp from './ChildComp.kdu'

export default {
  components: {
    ChildComp
  },
  setup() {
    const msg = ref('from parent')

    return {
      msg
    }
  }
}
