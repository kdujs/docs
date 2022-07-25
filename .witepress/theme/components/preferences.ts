import { Header } from 'witepress'
import { ref } from 'kdu'

const hasStorage = typeof localStorage !== 'undefined'
const get = (key: string, defaultValue = false): boolean =>
  hasStorage
    ? JSON.parse(localStorage.getItem(key) || String(defaultValue))
    : defaultValue

export const preferCompositionKey = 'kdu-docs-prefer-composition'
export const preferComposition = ref(get(preferCompositionKey))

export const preferSFCKey = 'kdu-docs-prefer-sfc'
export const preferSFC = ref(get(preferSFCKey, true))

export function filterHeadersByPreference(h: Header) {
  return preferComposition.value ? !h.optionsOnly : !h.compositionOnly
}
