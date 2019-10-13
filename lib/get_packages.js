// ISSUE#1 WINDOWS SUPPORT DURING COMMAND EXECUTION
// https://nodejs.org/api/all.html#child_process_shell_requirements
// NOTE: On Windows, using cmd.exe a single quote will not work correctly
// because it only recognizes double " for quoting. In Powershell or Git
// bash both \' and \" are usable
///

import { debug } from './debug';


const get_packages = (query, options) => {

  console.log(
    [
    "Searching apm (",
    options.select,
    ") for:",
    query
    ].join(" ")
  );


  let comm = [
    "apm",
    options.select === "featured" ? "featured" : "search",
    "--json",
    options.select === "themes" ? "--themes" : null,
    options.select === "featured" ? null : "query",
    options.select === "featured" ? null : query,
  ].join(" ");


  const { execSync } = require("child_process");
  try {
    const data = execSync(comm.toString());
    const text = Buffer.from(data).toString("UTF-8");
    const packages = JSON.parse(text.trim());
    return packages;
  } catch (e) {
    console.error("exec error: ", e);
    return;
  }
};

export { get_packages };
