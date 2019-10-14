//#!/usr/bin/env node
import { help } from "./lib/help";
import { debug } from "./lib/util/debug";
import { debugTime } from "./lib/util/debugTime";
import { parse_arguments } from "./lib/parse_args";
import { get_packages } from "./lib/get_packages";
import { render } from "./lib/render";
import { parse_options } from "./lib/parse_options";
import { process_file } from "./lib/process_file";
import { process_stream } from "./lib/process_stream";
import { encoding } from "./lib/var/encoding";

// const __DEV__ = ( process.env.NODE_ENV === "dev"|| process.env.NODE_ENV === "development" );

const _main = () => {

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

  if (options.select === "featured") {
    query="";
  } else {

    query = options.query;
    if (!query){
      help();
      debugTime("[main]", "end");
      process.exit(0);
    }
  }

  debug({options});
  var packages = [];
  if (options.file) {
    debugTime("[main]", "mark");
    packages = process_file(options.file);
    debugTime("[main]", "mark");
  } else {
    debugTime("[main]", "mark");
    packages = get_packages(query, options);
    debugTime("[main]", "mark");
  }

  let status = render(packages, options);
  return status;

};

const main = ()=>{
  debugTime("[main]", "start");
  let status = _main();
  debugTime("[main]", "end");
  debug("[main] result", status);
  process.exit(0);
};




/// --------------------
//  MAIN
// ---------------------
debug("START");
debugTime("[Application]", "start");
if (process.stdin.isTTY) {

  debug("[Application] init main (isTTY)");
  debugTime("[Application]", "mark");

  main();

} else {

  var data = "";
  process.stdin
    .setEncoding(encoding)
    .on("readable", function() {
      var chunk;

      debug("[Application] read stream START (noTTY)");
      debugTime("[Application]", "mark");

      while (chunk = process.stdin.read()){ data += chunk; }

      debug("[Application] read stream END (noTTY)");
      debugTime("[Application]", "mark");

    }).on("end", function () {

      debug("[Application] init process_stream (noTTY)");
      debugTime("[Application]", "mark");

      data = data.replace(/\n$/, "");
      process_stream(data);
    });
}
