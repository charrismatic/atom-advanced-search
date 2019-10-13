//#!/usr/bin/env node
import { help } from "./lib/help";
import { debug } from "./lib/debug";
import { parse_arguments } from "./lib/parse_args";
import { get_packages } from "./lib/get_packages";
import { render } from "./lib/render";
import { parse_options } from "./lib/parse_options";
import { process_file } from "./lib/process_file";
import { process_stream } from "./lib/process_stream";
import { encoding } from "./lib/encoding";

// const __DEV__ = ( process.env.NODE_ENV === "dev"|| process.env.NODE_ENV === "development" );

const main = () => {
  var query;
  var args = process.argv;
  args.shift();
  if (args[0] === __filename) {
    args.shift();
  }

  var options = parse_options();
  var runtime_options = parse_arguments(args);

  options = Object.assign({}, options, runtime_options);

  if (options.verbose) {
    console.log("options", options);
  }

  if(options.select === "featured") {
    query="";

  } else {

    query = options.query;
    if (!query){
      help();
      process.exit(0);
    }
  }


  debug(options);
  var packages = [];
  if (options.file) {
    packages = process_file(options.file);
    console.log("packages");

  } else {
    packages = get_packages(query, options);
  }

  render(packages, options);
};


/// --------------------
//  MAIN
// ---------------------
debug("START");
if (process.stdin.isTTY) {
  main();
} else {
  var data = "";
  process.stdin
    .setEncoding(encoding)
    .on("readable", function() {
      var chunk;
      debug("noiTTY");
      while ( chunk = process.stdin.read()
    ){ data += chunk; }
    }).on("end", function () {
      data = data.replace(/\n$/, "");
      process_stream(data);
    });
}
