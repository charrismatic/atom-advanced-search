import { debug } from './debug';

const get_packages = (query, options) => {
  let comm = [
    'apm',
    options.select === 'featured' ? 'featured'  : 'search',
    '--json',
    options.select === 'themes' ? '--themes' : '',
    options.select === 'featured' ? '' : query,
  ].join(' ');

  console.log(`Searching apm (${options.select}) for:`, query);

  // - Async
  // exec(`${comm}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   debug(`stdout: ${stdout}`);
  //   debug(`stderr: ${stderr}`);
  //   var packages = JSON.parse(stdout.trim());
  //   return packages;
  //   main(packages);
  // });

  const { execSync } = require('child_process');
  try {
    const data = execSync(`${comm}`);
    const text = Buffer.from(data).toString('UTF-8');
    const packages = JSON.parse(text.trim());
    return packages;
  } catch (e) {
    console.error(`exec error: ${e}`);
    return;
  }
};

export { get_packages };
