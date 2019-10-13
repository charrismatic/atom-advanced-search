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

export { color };
