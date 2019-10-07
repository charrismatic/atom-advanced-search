#!/usr/bin/env node
(function () {
  const help = () => {
    const list_spacer = '\n   ';
    const col_spacer = '\t';


    console.log([
      ['\n Atom Advanced Search', 'search, sort, and filtering tool for Atom apm packages'].join(' - '),
      ['\n [USAGE]', 'apm-tool [options] <name>' ].join(list_spacer),
      ['\n [SELECT OPTIONS]',
        ['  --select-packages',  'Get packages (default)'].join(col_spacer),
        ['  --select-themes',  'Get themes'].join(col_spacer),
        ['  --select-featured',  'Get featured packages/themes (ignores name argument)'].join(col_spacer),
      ].join(list_spacer),
      ['\n [SORT OPTIONS]',
        ['  --sort-stars', 'Sort by stars (default)'].join(col_spacer),
        ['  --sort-downloads', 'Sort by downloads'].join(col_spacer),
      ].join(list_spacer),
      ['\n [GENRAL OPTIONS]',
        ['  --help       ', 'Show this help menu'].join(col_spacer),
        ['  --verbose    ', 'Show more information'].join(col_spacer),
        ['  --nocolor    ', 'Disable color printing on output'].join(col_spacer),
        ['  --version    ', 'Output package version number'].join(col_spacer),
      ].join(list_spacer),
      [''],
    ].join('\n'));
  };

  const color = () => {
    var tty = require('tty');
    var styles = {
      'bold':      ['1m', '22m'],
      'dim':       ['2m', '22m'],
      'italic':    ['3m', '23m'],
      'underline': ['4m', '24m'],
      'inverse':   ['7m', '27m'],
      'black':     ['30m', '39m'],
      'red':       ['31m', '39m'],
      'green':     ['32m', '39m'],
      'yellow':    ['33m', '39m'],
      'blue':      ['34m', '39m'],
      'magenta':   ['35m', '39m'],
      'cyan':      ['36m', '39m'],
      'white':     ['37m', '39m'],
      'default':   ['39m', '39m'],
      'grey':      ['90m', '39m'],
      'bgBlack':   ['40m', '49m'],
      'bgRed':     ['41m', '49m'],
      'bgGreen':   ['42m', '49m'],
      'bgYellow':  ['43m', '49m'],
      'bgBlue':    ['44m', '49m'],
      'bgMagenta': ['45m', '49m'],
      'bgCyan':    ['46m', '49m'],
      'bgWhite':   ['47m', '49m'],
      'bgDefault': ['49m', '49m']
    };

    const _c = (s) => { return `\x1b[${s}`; };

      var enabled = !process.env.NOCOLOR && tty.isatty(1) && tty.isatty(2);

      Object.keys(styles).forEach(function(style) {
        Object.defineProperty(String.prototype, style, {
          get: function() {
            return (enabled ? _c(styles[style][0]) + this + _c(styles[style][1]) : this);
          },
          enumerable: false
        });
      });

      return styles;
  };

  const render = (packages, options) => {



    color();
    const tty = require('tty');

    var MAX_LENGTH = process.stdout.columns || 80;
    var MAX_ROWS = process.stdout.rows || 500;
    var MAX_STARS = 0;
    var MAX_DOWNLOADS = 0;
    var MAX_NAME = 0;
    var MAX_VERSION = 0;
    var pad_stars;
    var pad_downs;
    var base_length;
    var sorted;



    const set_lengths = (pkg) => {
      if (pkg.metadata){
        pkg.description = pkg.metadata.description;
        pkg.version = pkg.metadata.version;
      }
      if (parseInt(pkg.stargazers_count) > MAX_STARS) { MAX_STARS = parseInt(pkg.stargazers_count); }
      if (parseInt(pkg.downloads) > MAX_DOWNLOADS) { MAX_DOWNLOADS = parseInt(pkg.downloads); }
      if (pkg.name.length > MAX_NAME) { MAX_NAME = pkg.name.length; }
      var version_len = (pkg.version) ? pkg.version.length : 0;
      if (version_len > MAX_VERSION) { MAX_VERSION = version_len; }
    };

    const sort_stars = (a, b) => {
      set_lengths(a);
      set_lengths(b);

      if (parseInt(a.stargazers_count) < parseInt(b.stargazers_count)) {
        return 1;
      } else {
        return -1;
      }
    };

    const sort_downloads = (a, b) => {
      set_lengths(a);
      set_lengths(b);

      if (parseInt(a.downloads) < parseInt(b.downloads)) {
        return 1;
      } else {
        return -1;
      }
    };

    const table_header = [
      'Stars',
      'Downloads',
      'Package',
      'Description',
    ].join(' ');

    const table_divider = '-'.padStart(table_header.length, '-');

    const wrap_version = (ver) => {
      return `(${ver})`;
    };

    const format_line = (item) => {
      if (!item.name) { return false; }
      if (item.metadata){
        item.description = item.metadata.description;
        item.version = item.metadata.version;
      }
      const name = item.name;
      const downloads = (item.downloads || 0).toString().padStart(pad_downs, ' ');
      const stars = (item.stargazers_count || 0).toString().padStart(pad_stars, ' ');
      const version = wrap_version(item.version || '0.0.0');
      const description = (item.description || 'undefined').slice(0, MAX_LENGTH - base_length);

      return [
        (options.sort === 'downloads') ? stars.default : stars.yellow,
        (options.sort === 'downloads') ? downloads.yellow : downloads.default,
        name.cyan.bold,
        version.dim.italic,
        description.default,
      ].join(' ');
    };

    const print_table = (results) => {
      var table = [];
      table.push(table_header.bold);
      table.push(table_divider);

      for (item of results) {
        table.push(format_line(item));
      }
      console.log(table.join('\n'));
    };

    if (options.sort === 'downloads'){
      sorted = packages.sort(sort_downloads);
    } else {
      sorted = packages.sort(sort_stars);
    }

    pad_stars = MAX_STARS.toString().length;
    pad_downs = MAX_DOWNLOADS.toString().length;
    pad_name = MAX_NAME;
    pad_version = MAX_VERSION;
    base_length = (4 * 2) + pad_stars + pad_downs + pad_name + pad_version;

    print_table(sorted);
  };

  const __DEV__ = ( process.env.NODE_ENV === 'dev'|| process.env.NODE_ENV === 'development' );
  const __DEBUG__ = process.env.NODE_DEBUG_LOGGING;

  const { exec } = require('child_process');
  const encoding = 'utf-8';
  var data = '';
  var query;
  var options;

  const debug = (...msg) => {
      if (__DEBUG__){
        console.log(...msg);
      }
  };

  const main = (packages) => {
    if (options.verbose) {
      console.log('options', options);
    }

    render(packages, options);
  };

  const get_packages = (query, options) => {
    let comm = [
      'apm',
      options.select === 'featured' ? 'featured'  : 'search',
      '--json',
      options.select === 'themes' ? '--themes' : '',
      options.select === 'featured' ? '' : query,
    ].join(' ');
    console.log(`Searching (${options.select}) apm for:`, query);
    console.log(comm);

    exec(`${comm}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        debug(`stdout: ${stdout}`);
        debug(`stderr: ${stderr}`);
        var packages = JSON.parse(stdout.trim());
        main(packages);
      });
  };

  const parse_options = () => {
    var pkgrc = process.env.PKG_OPTIONS || "{}";
    options = Object.assign({}, defaults, JSON.parse(pkgrc));
    debug('Process Env:', process.env, 'Options: ', options );
  };


  const parse_arguments = (args) => {
    debug('Args:', typeof(args), args);
    if (!args){
      return false;

    } else if (!Array.isArray(args)) {
      if (typeof(args) === 'object' && Object.entries(args).length > 0) {
        parse_options();
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

            help();
            debug('help', arg);
            process.exit(0);
            break;

          case '--version':

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
              query = arg;
              debug('is query', arg);
            } else {
              debug('didnt match passing..', arg);
            }

            debug('----end loop----\n', arg);

        }

      } while (arg = args.shift());
      debug('stopping', args, arg);

    }};

  const process_stream = () => {
    const content = Buffer.from(data).toString(encoding);
    var packages = JSON.parse(content.trim());
    debug(packages);
    main(packages);
  };



  const defaults = {
    verbose: false,
    sort: 'stars',
    select: 'packages',
  };

  parse_options();

  var args = process.argv;

  debug('before', options, query);
  parse_arguments(args);

  if (process.stdin.isTTY) {
    debug('after', options, query);
    get_packages(query, options);

  } else {
    process.stdin.setEncoding(encoding)
    .on('readable', function() {
      var chunk;
      while (chunk = process.stdin.read()){data += chunk;}
    })
    .on('end', function () {
      data = data.replace(/\n$/, '');
      process_stream();
    });
  }

}());
