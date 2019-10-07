#!/usr/bin/env node

const { parse_arguments } = require('./lib/parse_args');
const { get_packages } = require('./lib/get_packages');
const { help } = require('./lib/help');
const { render } = require('./lib/render');
const { debug } = require('./lib/debug');

const __DEV__ = ( process.env.NODE_ENV === 'dev'|| process.env.NODE_ENV === 'development' );
const __DEBUG__ = process.env.NODE_DEBUG_LOGGING;

const encoding = 'utf-8';

const defaults = {
  verbose: false,
  sort: 'stars',
  select: 'packages',
};

var options;
var query;
var data = '';

const main = (query, options) => {
  if (!query){
    help();
    process.exit(0);
  }
  if (options.verbose) {
    console.log('options', options);
  }
  debug('parsed', options, query);

  const packages = get_packages(query, options);
  render(packages, options);
};

const parse_options = () => {
  var pkgrc = process.env.PKG_OPTIONS || "{}";
  options = Object.assign({}, defaults, JSON.parse(pkgrc));
  debug('Process Env:', process.env, 'Options: ', options );
  return options;
};

const process_stream = () => {
  const content = Buffer.from(data).toString(encoding);
  var packages = JSON.parse(content.trim());
  debug(packages);
  render(packages, options);
};

const process_file = (filename) => {
  const fs = require('fs');
  if (!filename) { return false; }
  fs.readFile([__dirname, filename].join('/'), ((err, data) => {
    if (err) {console.log('Error reading from file', err, data);
      return false;
    }
    let packages = Buffer.from(data).toString(encoding);
    // console.log(packages);
    render(packages, options);
  }));
};


/// --------------------
//  MAIN
// ---------------------
options = parse_options();

var args = process.argv;
args.shift();
if (args[0] === __filename) {
  args.shift();
}

runtime_options = parse_arguments(args);
options = Object.assign({}, options, runtime_options);
query = options.query;

if (process.stdin.isTTY) {
  main(query, options);

} else {
  process.stdin.setEncoding(encoding)
  .on('readable', function() {
    var chunk;
    while (chunk = process.stdin.read()){
      data += chunk;
    }
  })
  .on('end', function () {
    data = data.replace(/\n$/, '');
    process_stream();
  });
}
