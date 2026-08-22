import { defineConfig } from 'tsdown'

import { orbzCssPlugin } from './tsdown.css.config.ts'

export default defineConfig({
  clean: false,
  dts: false,
  entry: {
    'standalone/orbz': 'src/browser.client.ts'
  },
  failOnWarn: true,
  fixedExtension: false,
  format: ['esm'],
  hash: false,
  minify: true,
  platform: 'browser',
  plugins: [orbzCssPlugin()],
  sourcemap: true,
  target: 'es2022'
})
