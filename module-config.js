// const rollup = require('rollup');

const { terser } = require("rollup-plugin-terser");
const executable = require("rollup-plugin-executable");
const filesize = require("rollup-plugin-filesize");
const cleanup = require("rollup-plugin-cleanup");
const json = require("rollup-plugin-json");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");

var cleanup_options = {
  comments: "some",
  maxEmptyLines: 1,
  sourcemap: false,
  compactComments: true,
  extensions: [".js"],
  lineEndings: "unix",
};


const commonjs_options = {
  // non-CommonJS modules will be ignored, but you can also
  // specifically include/exclude files
  include: "lib/*",
  // exclude: [ 'node_modules/*' ],
  extensions: [ ".js" ],
  // if true then uses of `global` won't be dealt with by this plugin
  // ignoreGlobal: false,  // Default: false
  sourceMap: false,  // Default: true
  preferBuiltins: true,
  // namedExports: {
  // './lib/render': ['render'],
  // },
  // sometimes you have to leave require statements
  // ignore: [ 'conditional-runtime-dependency' ]
};


const resolve_options = {
  mainFields: ["main"], // Default: ['module', 'main']
  extensions: [ ".js", ".json" ],
  preferBuiltins: true,
  // jail: '/lib', // Default: '/'
  // only: [ 'some_module', /^@some_scope\/.*$/ ], // Default: null
  // modulesOnly: true, // Default: false
  // dedupe: [], // Default: []
  // customResolveOptions: {
  //   moduleDirectory: "lib"
  // }
};



// All JSON files will be parsed by default,
const json_options = {
  include: "./package.json",
  exclude: [ "node_modules/**"],
  preferConst: true,
  indent: "  ",
  compact: true,
  namedExports: true
};

// =====
// SETUP
// =====
const BUILD_ENV = process.env.NODE_ENV;

const mod = {
  name: "apm-search",
  banner: "#!/usr/bin/env node",
  path: "./",
  input: "index.js",
  output: BUILD_ENV === "production" ? "apm-search.js" : "apm-search.dev.js",
  dest: "./dist/",
  format: "cjs",
  sourcemap: false,
  strict: true,
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
pluginArr.push(filesize());
pluginArr.push(json(json_options));
pluginArr.push(cleanup(cleanup_options));
pluginArr.push(resolve(resolve_options));
pluginArr.push(commonjs(commonjs_options));
pluginArr.push(executable());
// if (mod.assets) {
//  var asset_paths = [];
//  for ( var asset of mod.assets ) {
//    asset_paths.push( MOD_PATH + mod.name + '/' + asset);
//  }
//  pluginArr.push(copy({ assets: asset_paths }));
//  console.log(pluginArr);
// }
// PRODUCTION:PLUGINS
// ------------------
if (BUILD_ENV === "production"){
  pluginArr.push(terser());
}

config.plugins = pluginArr;

if (mod.watch) {
  config.watch = mod.path;
}

bundle.push(config);

export { bundle as default };
