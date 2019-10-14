import { defaults } from "./var/default_options";
import { debug } from "./util/debug";
import { debugTime } from "./util/debugTime";

const parse_options = (options) => {
  var pkgrc = process.env.PKG_OPTIONS || "{}";
  options = Object.assign({}, defaults, JSON.parse(pkgrc));
  debug("Options set in environment variable:", process.env.PKG_OPTIONS, "Options: ", options);
  return options;
};

export { parse_options };
