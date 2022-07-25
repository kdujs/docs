import { ref } from 'kdu'
import TodoItem from './TodoItem.kdu'

export default {
  components: {
    TodoItem
  },
  setup() {
    const groceryList = ref([
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ])

    return {
      groceryList
    }
  }
}
