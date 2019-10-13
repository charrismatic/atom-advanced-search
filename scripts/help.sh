#!/bin/bash

echo -e "
 Atom Advanced Search - search, sort, and filtering tool for Atom apm packages

 [USAGE]
   apm-search [options] <name>

 [SELECT OPTIONS]
     --select-packages	Get packages (default)
     --select-themes	Get themes
     --select-featured	Get featured packages/themes (ignores name argument)

 [SORT OPTIONS]
     --sort-stars	Sort by stars (default)
     --sort-downloads	Sort by downloads

 [GENRAL OPTIONS]
     --help       \tShow this help menu
     --verbose    \tShow more information
     --nocolor    \tDisable color printing on output
     --version    \tOutput package version number
"
