import { encoding } from "./encoding";
import { debug } from "./debug";
import { render } from "./render";
import { parse_arguments } from "./parse_args";
import { parse_options } from "./parse_options";

const process_stream = (data) => {
  const content = Buffer.from(data).toString(encoding);

  debug("data", data);

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
    render(packages, options);
  }
};

export { process_stream };
