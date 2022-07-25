import './styles/index.css'
import { h, App } from 'kdu'
import { WPTheme } from '@kdujs/theme'
import PreferenceSwitch from './components/PreferenceSwitch.kdu'
import {
  preferComposition,
  preferSFC,
  filterHeadersByPreference
} from './components/preferences'

export default Object.assign({}, WPTheme, {
  Layout: () => {
    // @ts-ignore
    return h(WPTheme.Layout, null, {
      'sidebar-top': () => h(PreferenceSwitch),
    })
  },
  enhanceApp({ app }: { app: App }) {
    app.provide('prefer-composition', preferComposition)
    app.provide('prefer-sfc', preferSFC)
    app.provide('filter-headers', filterHeadersByPreference)
    // app.component('KduSchoolLink', KduSchoolLink)
  }
})
