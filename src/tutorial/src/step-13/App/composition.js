import { ref } from 'kdu'
import ChildComp from './ChildComp.kdu'

export default {
  components: {
    ChildComp
  },
  setup() {
    const childMsg = ref('No child msg yet')

    return {
      childMsg
    }
  }
}
