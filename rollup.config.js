const multiEntry = require('@rollup/plugin-multi-entry');
const html = require('rollup-plugin-html');
const postcss = require('rollup-plugin-postcss');
const terser = require('@rollup/plugin-terser');

module.exports = {
  input: './src/components/**/*.js',
  plugins: [
    multiEntry(),
    html(),
    postcss({ inject: false }),
    terser(),
  ],
  output: {
      file: './_site/public/components.min.js',
      format: 'iife',
      name: 'components'
  }
}
