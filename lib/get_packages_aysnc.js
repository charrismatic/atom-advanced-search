// ISSUE#1 WINDOWS SUPPORT DURING COMMAND EXECUTION
// https://nodejs.org/api/all.html#child_process_shell_requirements
// NOTE: On Windows, using cmd.exe a single quote will not work correctly
// because it only recognizes double " for quoting. In Powershell or Git
// bash both \' and \" are usable
///
import { debug } from "./util/debug";
import { debugTime } from "./util/debugTime";
import { render } from "./render";

const get_packages_async = (query, options) => {
  debugTime("[get_packages_async]", "start");
  debug("[get_packages_async] args", {query}, {options});


  if (!query && !options.featured) {
    return false;
  }

  let comm = [
    "apm",
    options.select === "featured" ? "featured"  : "search",
    "--json",
    options.select === "themes" ? "--themes" : null,
    options.select === "featured" ? null : query,
  ].join(" ");

  if (options.verbose) {
    console.log(comm);
  }

  debug("[get_packages_async] exec");
  debugTime("[get_packages_async]", "mark");

  console.log(["Searching apm (", options.select, ") for:", query].join(" "));

  const { exec } = require("child_process");
  exec(comm.toSting(), (error, stdout, stderr) => {
    if (error) {
      console.error("[get_packages_async.exec] error:", error);
      debug("[get_packages_async] error");
      debugTime("[get_packages_async]", "end");
      debug("[Application] exit");
      debugTime("[Application]", "end");
      process.exit(1);
    }

    debug("stdout:", stdout.toString());
    debug("stderr:", stderr.toString());

    debug("[get_packages_async] exit to render");
    debugTime("[get_packages_async]", "end");
    var packages = JSON.parse(stdout.trim());
    render(packages, options);
    // return packages;
  });
};

export { get_packages_async };
