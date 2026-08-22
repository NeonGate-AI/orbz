import { defineConfig } from 'tsdown'

import { orbzCssPlugin } from './tsdown.css.config.ts'

export default defineConfig({
  clean: true,
  copy: {
    from: 'src/element/index.css',
    rename: 'index.css',
    to: 'dist'
  },
  dts: {
    sourcemap: true
  },
  entry: {
    browser: 'src/browser.client.ts',
    orbz: 'src/index.ts'
  },
  failOnWarn: true,
  fixedExtension: false,
  format: ['esm'],
  hash: false,
  minify: false,
  platform: 'neutral',
  plugins: [orbzCssPlugin()],
  sourcemap: true,
  target: 'es2022'
})
