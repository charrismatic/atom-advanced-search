#!/usr/bin/env node
'use strict';

const help = () => {
  const listspacer = "\n   ";
  const colspacer = "\t";
  console.log([
    ["\n Atom Advanced Search", "search, sort, and filtering tool for Atom apm packages"].join(" - "),
    ["\n [USAGE]", "apm-search [options] <name>" ].join(listspacer),
    ["\n [SELECT OPTIONS]",
      ["  --select-packages",  "Get packages (default)"].join(colspacer),
      ["  --select-themes",  "Get themes"].join(colspacer),
      ["  --select-featured",  "Get featured packages/themes (ignores name argument)"].join(colspacer),
    ].join(listspacer),
    ["\n [SORT OPTIONS]",
      ["  --sort-stars", "Sort by stars (default)"].join(colspacer),
      ["  --sort-downloads", "Sort by downloads"].join(colspacer),
    ].join(listspacer),
    ["\n [GENRAL OPTIONS]",
      ["  --help       ", "Show this help menu"].join(colspacer),
      ["  --verbose    ", "Show more information"].join(colspacer),
      ["  --nocolor    ", "Disable color printing on output"].join(colspacer),
      ["  --version    ", "Output package version number"].join(colspacer),
    ].join(listspacer),
    [""],
  ].join("\n"));
};

const __DEBUG__ = process.env.NODE_DEBUG_LOGGING ? true : false;

const debug = (...msg) => {
  var util = require("util");
  function _inspect(data){
    console.log(util.inspect(data, true,3, true));
  }

  if (__DEBUG__){
    _inspect(...msg);

  }
};

const TimerLabels = {};
const Timers = {};

const debugTime = (label,  action) => {
  const __DEBUG__ = process.env.NODE_DEBUG_LOGGING ? true : false;

  if (__DEBUG__){
    const perf = require("perf_hooks");

    switch (action) {
    case "start":
      TimerLabels[label] = perf.performance;
      console.time(label);
      console.timeLog(label);
      break;

    case "mark":
      console.timeLog(label);
      break;

    case "end":
      console.timeLog(label);
      console.timeEnd(label);
      let _timer = TimerLabels[label].nodeTiming;
      Timers[label] = {
        name: _timer.name,
        duration: [_timer.duration.toString().split(".")[0], _timer.duration.toString().split(".")[1].slice(0,10)].join("."),
        environment: [_timer.environment.toString().split(".")[0], _timer.environment.toString().split(".")[1].slice(0,10)].join("."),
        bootstrapComplete: [_timer.bootstrapComplete.toString().split(".")[0], _timer.bootstrapComplete.toString().split(".")[1].slice(0,10)].join("."),
        timeOrigin: [TimerLabels[label].timeOrigin.toString().split(".")[0], TimerLabels[label].timeOrigin.toString().split(".")[1].slice(0,10)].join("."),
      };
      console.log([label,"END","\t"].join(" "), JSON.stringify(Timers[label]));
      TimerLabels[label] = null;
      break;

    default:
      console.timeLog(label);
      break;
    }
  }
};

const name="atom-advanced-search";const version="1.0.4";

const pkgver = () => {
  console.log([name, version].join(" v"));
};

const defaults = {
  verbose: false,
  file: false,
  sort: "stars",
  select: "packages",
  color: true,
};

const parse_options = (options) => {
  var pkgrc = process.env.PKG_OPTIONS || "{}";
  options = Object.assign({}, defaults, JSON.parse(pkgrc));
  debug("Options set in environment variable:", process.env.PKG_OPTIONS, "Options: ", options);
  return options;
};

const parse_arguments = (args) => {
  debugTime("[parse_arguments]", "start");
  debug("[parse_arguments] args", typeof(args), {args});

  var options = {};

  if (!args || args.length === 0){
    return false;
  } else if (!Array.isArray(args)) {

    if (typeof(args) === "object" && Object.entries(args).length > 0) {
      parse_options(args);
    }

    return false;

  } else {
    var arg = args.shift();
    do {
      debug("[parse_arguments] start loop", arg);
      switch (arg) {
      case __filename:
        debug("found this file, skipping", arg);
        debug("next arg", arg);
        break;

      case "--help":
        help();
        debug("[parse_arguments] set help", arg);
        debug("[parse_arguments] print help exit");
        debugTime("[parse_arguments]", "end");
        process.exit(0);
        break;

      case "--version":
        debugTime("[parse_arguments]", "end");
        debug("[parse_arguments] print version exit");
        pkgver();
        debug("[parse_arguments] set version", arg);
        process.exit(0);
        break;

      case "--verbose":
        options.verbose = true;
        debug("[parse_arguments] set verbose", arg);
        break;

      case "--sort-stars":
        options.sort = "stars";
        debug("[parse_arguments] set stars", arg);
        break;

      case "--nocolor":
        process.env.NOCOLOR = true;
        options.color = false;
        debug("[parse_arguments] set color", arg);
        break;

      case "--sort-downloads":
        options.sort = "downloads";
        debug("[parse_arguments] set downloads", arg);
        break;

      case "--select-packages":
        options.select = "packages";
        debug("[parse_arguments] set selected stars", arg);
        break;

      case "--select-themes":
        options.select = "themes";
        debug("[parse_arguments] set selected themes", arg);
        break;

      case "--select-featured":
        options.select = "featured";
        debug("[parse_arguments] set selected featured", arg);
        break;

      case "--file":
        arg = args.shift() || false;
        options.file = arg;
        debug("[parse_arguments] set file", arg);
        break;

      default:
        if (arg.match(/^--/)){
          var arg_status = [];
          arg_status.push("unknown");
        } else if (typeof(arg) === "undefined") {
          debug("[parse_arguments] is undefined", arg);
          arg_status.push("undefined");
        } else if ( arg.length > 0) {
          options.query = arg;
          arg_status = "query";
          debug("[parse_arguments] is query", arg);
        } else {
          debug("[parse_arguments] didnt match passing..", arg_status, arg);
          console.log(["Notice: Argument", arg, "is unknown"].join(" "));
        }
        debug("----end loop----\n");
      }

      arg = args.shift();
    } while (arg);
    debug("stopping", args, arg);
  }
  debugTime("[parse_arguments]", "end");
  debug("[parse_arguments] end loop", JSON.stringify({options}));
  return options;
};

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

const color = (enabled) => {
  var tty = require("tty");

  var styles = {
    "bold":      ["1m", "22m"],
    "dim":       ["2m", "22m"],
    "italic":    ["3m", "23m"],
    "underline": ["4m", "24m"],
    "inverse":   ["7m", "27m"],
    "black":     ["30m", "39m"],
    "red":       ["31m", "39m"],
    "green":     ["32m", "39m"],
    "yellow":    ["33m", "39m"],
    "blue":      ["34m", "39m"],
    "magenta":   ["35m", "39m"],
    "cyan":      ["36m", "39m"],
    "white":     ["37m", "39m"],
    "default":   ["39m", "39m"],
    "grey":      ["90m", "39m"],
    "bgBlack":   ["40m", "49m"],
    "bgRed":     ["41m", "49m"],
    "bgGreen":   ["42m", "49m"],
    "bgYellow":  ["43m", "49m"],
    "bgBlue":    ["44m", "49m"],
    "bgMagenta": ["45m", "49m"],
    "bgCyan":    ["46m", "49m"],
    "bgWhite":   ["47m", "49m"],
    "bgDefault": ["49m", "49m"]
  };

  const _c = (s) => {return ["\x1b[", s].join(""); };

  const fmt = (style, text) => {return [_c(style[1]), _c(style[0]), text, _c(style[1])].join("");};

  if (!process.env.COLORTERM) {
    console.log("COLORTERM environment variable not set, continuing to display with color.");
    console.log("Set NOCOLOR in the environment or --nocolor in the commandline if there are issues");
  }
  enabled = !process.env.NOCOLOR && tty.isatty(1) && tty.isatty(2);

  Object.keys(styles).forEach(function(style) {
    Object.defineProperty(String.prototype, style, {
      get: function() {
        return (enabled ? fmt(styles[style], this) : this);
      },
      enumerable: false
    });
  });

  return styles;
};

const render = (packages, options) => {
  debugTime("[render]", "start");
  debug("[render] args", {packages}, {options});

  if (!packages) {
    console.log("No packages listed");
    debug("[render] exit no packages");
    debugTime("[render]", "end");
    return false;
  }

  color(options.color);

  var MAX_LENGTH = process.stdout.columns || 80;
  var MAX_STARS = 0;
  var MAX_DOWNLOADS = 0;
  var MAX_NAME = 0;
  var MAX_VERSION = 0;

  var pad_stars;
  var pad_downs;
  var pad_version;
  var base_length;
  var sorted;

  const set_lengths = (pkg) => {
    var pkg_stars = pkg.stargazers_count;
    var pkg_down = pkg.downloads;
    var pkg_name = pkg.name;
    var pkg_ver = "0.0.0.0";
    if (pkg.metadata) {
      pkg_ver = pkg.metadata.version;
    } else {
      pkg_ver = pkg.version;
    }
    if (parseInt(pkg_stars) > MAX_STARS) { MAX_STARS = parseInt(pkg_stars); }
    if (parseInt(pkg_down) > MAX_DOWNLOADS) { MAX_DOWNLOADS = parseInt(pkg_down); }
    if (pkg_name.length > MAX_NAME) { MAX_NAME = pkg_name.length; }
    var version_len = (pkg_ver) ? pkg_ver.length : 0;
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
    "Stars",
    "Downloads",
    "Package",
    "Description"
  ].join(" ");

  const table_divider = "-".padStart(table_header.length, "-");

  const wrap_version = (ver) => {
    return ["(", ver, ")"].join("");
  };

  const format_line = (item) => {
    if (!item.name) { return false; }
    if (item.metadata) {
      item.description = item.metadata.description;
      item.version = item.metadata.version;
    }
    const name = item.name;
    const downloads = (item.downloads || 0).toString().padStart(pad_downs, " ");
    const stars = (item.stargazers_count || 0).toString().padStart(pad_stars, " ");
    const version = wrap_version(item.version || "0.0.0");
    const description = (item.description || "undefined").slice(0, MAX_LENGTH - base_length - name.length);

    return ["",
      (options.sort === "downloads") ? stars.default : stars.yellow.bold,
      (options.sort === "downloads") ? downloads.yellow.bold : downloads.default,
      name.cyan.bold,
      version.dim.italic,
      description.white
    ].join(" ");
  };

  const print_table = (results) => {
    var table = [];
    table.push(table_header.bold);
    table.push(table_divider);

    for (var item of results) {
      table.push(format_line(item));
    }
    console.log(table.join("\n"));
  };

  if (options.sort === "downloads") {
    debug("[render] sort_downloads");
    debugTime("[render]", "mark");
    sorted = packages.sort(sort_downloads);
  } else {
    debug("[render] sort_stars");
    debugTime("[render]", "mark");
    sorted = packages.sort(sort_stars);
  }

  pad_stars = MAX_STARS.toString().length;
  pad_downs = MAX_DOWNLOADS.toString().length;
  pad_version = MAX_VERSION;
  base_length = (4 * 2) + pad_stars + pad_downs + pad_version;

  debug("[render] print table");
  debugTime("[render]", "mark");
  debug(
    ["Longest", MAX_LENGTH].join(": "),
    ["pad_stars", pad_stars].join(": "),
    ["pad_downs", pad_downs].join(": "),
    ["pad_version", pad_version].join(": "),
  );
  print_table(sorted);
  debug("[render] done");
  debugTime("[render]", "end");
  return true;
};

const encoding = "utf-8";

const process_file = async (filename) => {
  const { fs } = require("fs");
  var fildata;
  console.log("filename", filename);
  if (!filename) { return false; }

  let base_dir = process.env.INIT_CWD || ".";
  console.log("base_dir", base_dir);

  var filepath = [base_dir, filename].join("/");
  console.log("filepath", filepath);
  await fs.readFile(filepath, ((err, data) => {
    if (err) {console.log("Error reading from file", err, data);
      return false;
    }
    fildata = Buffer.from(data).toString(encoding);
  }));

  console.log("fildata", fildata);
  return JSON.parse(fildata);
};

const process_stream = (data) => {
  debugTime("[process_stream]", "start");
  debug("[process_stream] start");

  const content = Buffer.from(data).toString(encoding);

  debug("received data stream:", typeof data, data.length);

  var options = parse_options();

  var args = process.argv;
  args.shift();
  if (args[0] === __filename) {
    args.shift();
  }

  var runtime_options = parse_arguments(args);
  debug("runtime_options", runtime_options);
  options = Object.assign({}, options, runtime_options);

  try {
    var packages = JSON.parse(content.trim());
  } catch (e) {
    console.log("Error processing input data", e);
  } finally {
    debug("[process_stream] exit to render stream");
    debugTime("[process_stream]", "end");
    render(packages, options);
  }
};

const _main = () => {

  var query;
  var args = process.argv;

  args.shift();
  if (args[0] === __filename) {
    args.shift();
  }

  var options = parse_options();
  var runtime_options = parse_arguments(args);

  options = Object.assign({}, options, runtime_options);

  if (options.verbose) {
    console.log("options", options);
  }

  if (options.select === "featured") {
    query="";
  } else {

    query = options.query;
    if (!query){
      help();
      debugTime("[main]", "end");
      process.exit(0);
    }
  }

  debug({options});
  var packages = [];
  if (options.file) {
    debugTime("[main]", "mark");
    packages = process_file(options.file);
    debugTime("[main]", "mark");
  } else {
    debugTime("[main]", "mark");
    packages = get_packages(query, options);
    debugTime("[main]", "mark");
  }

  let status = render(packages, options);
  return status;

};

const main = ()=>{
  debugTime("[main]", "start");
  let status = _main();
  debugTime("[main]", "end");
  debug("[main] result", status);
  process.exit(0);
};

debug("START");
debugTime("[Application]", "start");
if (process.stdin.isTTY) {

  debug("[Application] init main (isTTY)");
  debugTime("[Application]", "mark");

  main();

} else {

  var data = "";
  process.stdin
    .setEncoding(encoding)
    .on("readable", function() {
      var chunk;

      debug("[Application] read stream START (noTTY)");
      debugTime("[Application]", "mark");

      while (chunk = process.stdin.read()){ data += chunk; }

      debug("[Application] read stream END (noTTY)");
      debugTime("[Application]", "mark");

    }).on("end", function () {

      debug("[Application] init process_stream (noTTY)");
      debugTime("[Application]", "mark");

      data = data.replace(/\n$/, "");
      process_stream(data);
    });
}
