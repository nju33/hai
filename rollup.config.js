const nodeResolver = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const svelte = require('rollup-plugin-svelte');
const replace = require('rollup-plugin-replace');
const json = require('rollup-plugin-json');
const string = require('rollup-plugin-string');
const strip = require('rollup-plugin-strip');

const banner = `
/*!
 * Copyright 2016, nju33
 * Released under the MIT License
 * https://github.com/nju33/hai
 */
`.trim();

const nodeEnv = process.env.NODE_ENV || 'development';
const plugins = [
  nodeResolver({jsnext: true}),
  babel({include: 'lib/**/*.js'}),
  svelte({include: 'lib/components/*.html'}),
  replace({
    'process.env.NODE_ENV': JSON.stringify(nodeEnv)
  }),
  json({include: 'lib/**/*.json'}),
  string({include: 'lib/**/*.css'})
];

if (nodeEnv === 'production') {
  plugins.push(strip());
}

module.exports = {
  banner,
  plugins,
  cache: null,
  entry: 'lib/hai.js'
};
