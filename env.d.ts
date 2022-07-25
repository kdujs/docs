/// <reference types="witepress/client" />
/// <reference types="kdu/macros-global" />

declare module '@kdujs/theme/config' {
  import { UserConfig } from 'witepress'
  const config: () => Promise<UserConfig>
  export default config
}

declare module '@kdujs/theme/highlight' {
  const createHighlighter: () => Promise<(input: string) => string>
  export default createHighlighter
}
