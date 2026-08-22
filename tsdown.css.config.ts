import { readFile } from 'node:fs/promises'

const ORBZ_STYLES_ID = 'virtual:orbz-styles'
const RESOLVED_ORBZ_STYLES_ID = `\0${ORBZ_STYLES_ID}`
const ORBZ_STYLES_URL = new URL('./src/element/index.css', import.meta.url)

export function orbzCssPlugin() {
  return {
    name: 'orbz-css',
    resolveId(id: string): string | undefined {
      return id === ORBZ_STYLES_ID ? RESOLVED_ORBZ_STYLES_ID : undefined
    },
    async load(id: string): Promise<string | undefined> {
      if (id !== RESOLVED_ORBZ_STYLES_ID) {
        return undefined
      }

      const styles = await readFile(ORBZ_STYLES_URL, 'utf8')

      return `export default ${JSON.stringify(styles)}`
    }
  }
}
