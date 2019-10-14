import { encoding } from "./var/encoding";
import { debug } from "./util/debug";
import { debugTime } from "./util/debugTime";
import { render } from "./render";
import { parse_arguments } from "./parse_args";
import { parse_options } from "./parse_options";

const process_stream = (data) => {
  debugTime("[process_stream]", "start");
  debug("[process_stream] start");

  const content = Buffer.from(data).toString(encoding);

  debug("received data stream:", typeof data, data.length);

  var options = parse_options();

  var args = process.argv;
  args.shift();
  if (args[0] === __filename) {
    args.shift();
  }

  var runtime_options = parse_arguments(args);
  debug("runtime_options", runtime_options);
  options = Object.assign({}, options, runtime_options);

  try {
    var packages = JSON.parse(content.trim());
  } catch (e) {
    console.log("Error processing input data", e);
  } finally {
    debug("[process_stream] exit to render stream");
    debugTime("[process_stream]", "end");
    render(packages, options);
  }
};

export { process_stream };
