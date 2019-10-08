import { color } from './color';

const render = (packages, options) => {

  if (!packages) {
    console.log("No packages listed");
    return false;
  }

  // ADDS COLOR PROPERTIES TO STRINGS WHEN IMPORTED
  color(options.color);
  const tty = require('tty');

  var MAX_LENGTH = process.stdout.columns || 80;
  var MAX_ROWS = process.stdout.rows || 500;
  var MAX_STARS = 0;
  var MAX_DOWNLOADS = 0;
  var MAX_NAME = 0;
  var MAX_VERSION = 0;
  var pad_stars;
  var pad_downs;
  var pad_name;
  var pad_version;
  var base_length;
  var sorted;


  // SET THE MAX VALUES FOR FORMATTING LATER WHILE WE ARE INSIDE THE LOOP
  const set_lengths = (pkg) => {
    var pkg_meta = pkg.metadata;
    var pkg_stars = pkg.stargazers_count;
    var pkg_down = pkg.downloads;
    var pkg_name = pkg.name;
    if (pkg_meta) {
      var pkg_ver = pkg.metadata.version || pkg.version;
      var pkg_desc = pkg.metadata.description || pkg.description;
    }

    if (parseInt(pkg_stars) > MAX_STARS) { MAX_STARS = parseInt(pkg_stars)};
    if (parseInt(pkg_down) > MAX_DOWNLOADS) { MAX_DOWNLOADS = parseInt(pkg_down)};
    if (pkg_name.length > MAX_NAME) { MAX_NAME = pkg_name.length};
    var version_len = (pkg_ver) ? pkg_ver.length : 0;
    if (version_len > MAX_VERSION) { MAX_VERSION = version_len};
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

    for (var item of results) {
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
  base_length = (4 * 2 +1) + pad_stars + pad_downs + pad_name + pad_version;

  print_table(sorted);
};

export { render }
