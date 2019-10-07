// module.exports = ((data) => {

const help = () => {
  const list_spacer = '\n   ';
  const col_spacer = '\t';
  // TODO: What to call this?
  //  atom-better-search
  //  atom-explorer
  console.log([
    ['\n Atom Advanced Search', 'search, sort, and filtering tool for Atom apm packages'].join(' - '),
    ['\n [USAGE]', 'apm-search [options] <name>' ].join(list_spacer),
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
}

module.exports = { help };
