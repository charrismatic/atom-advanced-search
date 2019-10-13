#!/bin/bash


## COMANND BOOKMARKS
# . .npmrc && BUILD_DEBUG=YES .bin/build "$STYLE_SRC/style.scss" "$THEME_DEST"
# $(npm config list --local)
# INPUT_DIR="$(dirname $INPUT)"
# THISDIR=$(dirname "$(readlink -f "$0")")
# ---
# PROJ_ROOT="$(npm prefix)"
# BUILD_DIR=".build"
# DIST_DIR=".dist"
# DOCS_DIR=".docs"
# ---

# PARSE INPUT BEFORE READING ENV
INPUT=${1?"error input required"}
OUTDIR="${2:-$(dirname $INPUT)}"
DEST_BUILD="$OUTDIR/$BUILD_DIR"

# GET VALUES FROM ENVIRONMENT
# NOTE: WHEN RUN AS NPM SCRIPT .NPMRC IS
# SOURCED BEFORE COMMAND TO SET DEFAULT
# INPUT AND OUTPUT ARGUMENTS WHEN COMMAND
# IS CALLED; SET ARGUMENTS WITH 'npm run [name] -- <arg> ...'
if [ -f "$(npm prefix)/.npmrc" ]; then
  echo "Loading project env"
  . "$(npm prefix)/.npmrc"
fi


_parsing () {
  local e
  for e in "${@:2}"; do [[ "$e" == "$1" ]] && return 0; done

  echo "$e"
  return 1
}


echo "Script runs: Null test passes"

DEFAULT="--FALSE--"
FROM_RUN="--FALSE--"
FROM_TTY_ARG="--FALSE--"
FROM_TTY_ENV="--FALSE--"
FROM_NPMRC="--FALSE--"
FROM_PKGJSON="--FALSE--"


echo -E "Command parameters:\n"
echo -e "\n\n----\n\n"
echo -e "\$\0 is $0"
echo -e "\$\# is $#"
echo -e "\  @ is @"
echo -e "\$\@ is $*"
echo -e "\n\n"
echo -e "\n\n----\n\n"


_parsing "$@"


while [[ $@ -gt 0 ]];
do
key="$1"
echo "$key"

case $key in

    -e|--from_tty)
      FROM_TTY_ARG="$2"
      shift
      shift
      ;;

    --from_run)
      FROM_RUN="$2"
      shift
      shift
      ;;
    
    --env)
      command env
      exit 0
      shift
      ;;

    *)

    DEFAULT="PASSESD"
    shift
    ;;

  esac
done
set -- "${POSITIONAL[@]}"

FROM_TTY_ENV="$npm_config_from_tty"
FROM_NPMRC="$npm_config_test"
FROM_PKGJSON="$npm_package_test"


echo "Parameters As Interpreted:"
echo -e "\n\n----\n\n"
echo "FROM_TTY_ENV  = $FROM_TTY_ENV"
echo "FROM_TTY_ARG  = ${FROM_TTY_ARG}"
echo "FROM_RUN  = ${FROM_RUN}"
echo "DEFAULT  = ${DEFAULT}"
echo "FROM_NPMRC = ${FROM_NPMRC}"
echo "FROM_PKGJSON = ${FROM_PKGJSON}"

