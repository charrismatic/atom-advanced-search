
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
}

export { help };
