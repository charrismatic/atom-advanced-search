// import { version, name } from '../../package.json';
const { version, name } = require('../package.json');

const pkgver = () => {
  console.log([name, version].join(' v'));
}

module.exports = { pkgver };
