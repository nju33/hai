import babel from 'rollup-plugin-babel';
const banner = `
/*!
 * Copyright 2016, nju33
 * Released under the MIT License
 * https://github.com/totora0155/hai.js
 */
`.trim();

export default {
  banner,
  entry: 'lib/hai.js',
  format: 'umd',
  dest: 'dist/hai.js',
  moduleName: 'Hai',
  plugins: [
    babel({
      externalHelpers: true
    })
  ]
};
