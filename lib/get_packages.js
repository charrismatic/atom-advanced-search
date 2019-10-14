// ISSUE#1 WINDOWS SUPPORT DURING COMMAND EXECUTION
// https://nodejs.org/api/all.html#child_process_shell_requirements
// NOTE: On Windows, using cmd.exe a single quote will not work correctly
// because it only recognizes double " for quoting. In Powershell or Git
// bash both \' and \" are usable
///

import { debug } from "./util/debug";
import { debugTime } from "./util/debugTime";

const get_packages = (query, options) => {
  debugTime("[get_packages]", "start");
  debug("[get_packages] args", {query}, {options});

  if (!query && !options.featured) {
    return false;
  }

  let comm = [
    "apm",
    options.select === "featured" ? "featured" : "search",
    "--json",
    options.select === "themes" ? "--themes" : null,
    options.select === "featured" ? null : query,
  ].join(" ");

  if (options.verbose) {
    console.log(comm);
  }

  debug("[get_packages] execSync");
  debugTime("[get_packages]", "mark");

  console.log([ "Searching apm (", options.select, ") for:", query ].join(" "));

  const { execSync } = require("child_process");
  try {
    const data = execSync(comm.toString());
    const text = Buffer.from(data).toString("UTF-8");
    const packages = JSON.parse(text.trim());
    debug("[get_packages] return");
    debugTime("[get_packages]", "end");
    return packages;
  } catch (e) {
    debug("[get_packages] error");
    debugTime("[get_packages]", "end");
    console.error("exec error: ", e);
    return e;
  }
};

export { get_packages };
