const { help } = require('./help');
const { pkgver } = require('./version');
const { debug } = require('./debug');

const parse_arguments = (args) => {
  var options = {}
  debug('Args:', typeof(args), args);
  if (!args){
    return false;

  } else if (!Array.isArray(args)) {
    if (typeof(args) === 'object' && Object.entries(args).length > 0) {
      parse_options(args);
    }
    return false;

  } else {
    var arg = args.shift();
    do {
      debug('start loop', arg);
      switch (arg) {
        case __filename:
          debug('found this file, skipping', arg);
          debug('next arg', arg);
          break;

        case '--help':
          // require('./lib/help');
          help();
          debug('help', arg);
          process.exit(0);
          break;

        case '--version':
          // require('./lib/version');
          version();
          debug('version', arg);
          process.exit(0);
          break;

        case '--verbose':
          options.verbose = true;
          debug('verbose', arg);

        case '--sort-stars':
          options.sort = 'stars';
          debug('stars', arg);
          break;

        case '--sort-downloads':
          options.sort = 'downloads';
          debug('downloads', arg);
          break;

        case '--select-packages':
          options.select = 'packages';
          debug('stars', arg);
          break;

        case '--select-themes':
          options.select = 'themes';
          debug('themes', arg);
          break;

        case '--select-featured':
          options.select = 'featured';
          debug('featured', arg);
          break;

        default:
          if (arg.match(/^--/)){
            debug(`Notice: Argument '${arg}' is unkown.`);
            debug('unknown', arg);
          } else if (typeof(arg) === 'undefined') {
            debug('is undefined', arg);

          } else if ( arg.length > 0) {
            options.query = arg;
            debug('is query', arg);
          } else {
            debug('didnt match passing..', arg);
          }

          debug('----end loop----\n', arg);

      }

    } while (arg = args.shift());
    debug('stopping', args, arg);
  };
  return options;
};

module.exports = { parse_arguments };
