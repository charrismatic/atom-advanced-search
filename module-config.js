// const rollup = require('rollup');
import { terser } from "rollup-plugin-terser";

const executable = require('rollup-plugin-executable');
const filesize = require('rollup-plugin-filesize');
const cleanup = require('rollup-plugin-cleanup');
const uglify = require('rollup-plugin-terser');
const json = require('rollup-plugin-json');

var cleanup_options = {
  comments: 'some',
  maxEmptyLines: 2,
  sourcemap: false,
  compactComments: true,
  extensions: ['.js'],
  lineEndings: 'unix',
};

// All JSON files will be parsed by default,
const json_options = {
  // but you can also specifically include/exclude files
  include: './package.json',
  exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
  // for tree-shaking, properties will be declared as
  // variables, using either `var` or `const`
  preferConst: true, // Default: false
  // specify indentation for the generated default export —
  // defaults to '\t'
  indent: '  ',
  compact: true,
  namedExports: true
};

// =====
// SETUP
// =====
const BUILD_ENV = process.env.NODE_ENV;

const MOD_SRC = '.';
const MOD_DEST = './dist';

const mod = {
  name: 'apm-tool',
  banner: '#!/usr/bin/env node',
  path: './src/',
  input: 'index.js',
  output: 'apm-tool.js',
  dest: './dist/',
  format: 'iife',
  sourcemap: false,
  strict: false,
  watch: false,
  assets: false,
};

var bundle = [];

var config = {};
config.input = mod.path + mod.input;
config.output = {
  name: mod.name,
  file: mod.dest + mod.output,
  format: mod.format,
  sourcemap: mod.sourcemap,
  strict: mod.strict,
  watch: mod.watch,
  banner: mod.banner,
};

// PLUGINS
// -------
var pluginArr = [];
pluginArr.push(json(json_options));
pluginArr.push(executable());
pluginArr.push(filesize());
pluginArr.push(cleanup(cleanup_options));

// if (mod.assets) {
  // var asset_paths = [];
  // for ( var asset of mod.assets ) {
  //   asset_paths.push( MOD_PATH + mod.name + '/' + asset);
  // }
  // pluginArr.push(copy({ assets: asset_paths }));
  // console.log(pluginArr);
// }

// PRODUCTION:PLUGINS
// ------------------
if (BUILD_ENV === 'production'){
  pluginArr.push(terser());
}
config.plugins = pluginArr;
console.log(pluginArr);

if (mod.watch) {
  config.watch = MOD_SRC;
}
console.log(pluginArr);
bundle.push(config);

export { bundle as default };
