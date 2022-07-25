import { ref, watchEffect } from 'kdu'

const API_URL = `https://api.github.com/repos/kdujs/docs/commits?per_page=3&sha=`
const branches = ['main', 'master']

export default {
  setup() {
    const currentBranch = ref(branches[0])
    const commits = ref(null)

    watchEffect(async () => {
      // this effect will run immediately and then
      // re-run whenever currentBranch.value changes
      const url = `${API_URL}${currentBranch.value}`
      commits.value = await (await fetch(url)).json()
    })

    function truncate(v) {
      const newline = v.indexOf('\n')
      return newline > 0 ? v.slice(0, newline) : v
    }

    function formatDate(v) {
      return v.replace(/T|Z/g, ' ')
    }

    return {
      branches,
      currentBranch,
      commits,
      truncate,
      formatDate
    }
  }
}
