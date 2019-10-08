// ISSUE#1 WINDOWS SUPPORT DURING COMMAND EXECUTION
// https://nodejs.org/api/all.html#child_process_shell_requirements
// NOTE: On Windows, using cmd.exe a single quote will not work correctly
// because it only recognizes double " for quoting. In Powershell or Git
// bash both \' and \" are usable
///
import { debug } from './debug';

const get_packages_async = (query, options) => {
  let comm = [
    'apm',
    options.select === 'featured' ? 'featured'  : 'search',
    '--json',
    options.select === 'themes' ? '--themes' : '',
    options.select === 'featured' ? '' : query,
  ].join(' ');

  console.log(`Searching apm (${options.select}) for:`, query);

  const { exec } = require('child_process');
  exec(`${comm}`, (error, stdout, stderr) => {
    if (error) { console.error(`exec error: ${error}`); return; }
    debug(`stdout: ${stdout}`);
    debug(`stderr: ${stderr}`);
    var packages = JSON.parse(stdout.trim());
    return packages;
    render(packages, options);
  });
};

export { get_packages_async };
