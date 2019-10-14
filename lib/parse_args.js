import { help } from "./help";
import { pkgver } from "./var/pkgver";
import { debug } from "./util/debug";
import { debugTime } from "./util/debugTime";
import { parse_options } from "./parse_options";

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

export { parse_arguments };
