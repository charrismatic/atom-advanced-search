//#!/usr/bin/env node

import { help } from './lib/help';
import { debug, __DEBUG__ } from './lib/debug';
import { parse_arguments } from './lib/parse_args';
import { get_packages } from './lib/get_packages';
import { render } from './lib/render';

const __DEV__ = ( process.env.NODE_ENV === 'dev'|| process.env.NODE_ENV === 'development' );

const encoding = 'utf-8';
var query;
var data = '';
const defaults = {
  verbose: false,
  sort: 'stars',
  select: 'packages',
  color: true,
};


const main = (query, options) => {
  if (!query && !options.select){
    help();
    process.exit(0);
  }

  if (options.verbose) {
    console.log('options', options);
  }

  const packages = get_packages(query, options);
  render(packages, options);
};



const parse_options = () => {
  var pkgrc = process.env.PKG_OPTIONS || "{}";
  options = Object.assign({}, defaults, JSON.parse(pkgrc));
  debug('Process Env:', process.env, 'Options: ', options );
  return options;
}



const process_stream = (options) => {
  const content = Buffer.from(data).toString(encoding);
  if (!content){
    help();
    process.exit(0);
  }
  try {
    var packages = JSON.parse(content.trim());
    debug(packages);
  } catch (e) {
    console.log("Error processing input data", e);
  } finally {
    render(packages, options);
  }
}


const process_file = (filename) => {
  const { fs } = require('fs');
  if (!filename) { return false; }
  fs.readFile([__dirname, filename].join('/'), ((err, data) => {
    if (err) {console.log('Error reading from file', err, data);
      return false;
    }
    let packages = Buffer.from(data).toString(encoding);
    render(packages, options);
  }))
}


/// --------------------
//  MAIN
// ---------------------

var options;
options = parse_options();

var args = process.argv;
args.shift();
if (args[0] === __filename) {
  args.shift();
}
var runtime_options = parse_arguments(args);

options = Object.assign({}, options, runtime_options);
query = options.query;

if (process.stdin.isTTY) {

  main(query, options);

} else {

  process.stdin.setEncoding(encoding)
  .on('readable', function() {
    var chunk;
    while (chunk = process.stdin.read()){ data += chunk }
  })
  .on('end', function () {
    data = data.replace(/\n$/, '');

    process_stream(options);

  });
}
