// ISSUE#1 WINDOWS SUPPORT DURING COMMAND EXECUTION
// https://nodejs.org/api/all.html#child_process_shell_requirements
// NOTE: On Windows, using cmd.exe a single quote will not work correctly
// because it only recognizes double " for quoting. In Powershell or Git
// bash both \' and \" are usable
///
import { debug } from "./debug";
import { render } from "./render";

const get_packages_async = (query, options) => {
  const { exec } = require("child_process");

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

  console.log([
    "Searching apm (",
    options.select,
    ") for:",
    query
  ].join(" "));

  if (options.verbose) {
    console.log(comm);
  }

  exec(comm.toSting(), (error, stdout, stderr) => {
    if (error) {
      console.error("exec error:", error);
      process.exit(1);
    }
    debug("stdout:", stdout.toString());
    debug("stderr:", stderr.toString());
    var packages = JSON.parse(stdout.trim());
    render(packages, options);
    return packages;
  });
};

export { get_packages_async };
