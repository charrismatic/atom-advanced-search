#!/bin/bash

# =================================================================
#   SYNC ASSETS: (LOADS ASSETS ASSETS AND ASSET DIRECTORY SKELETON)
# =================================================================
BASE_DIR="$(npm prefix)"
. $BASE_DIR/.env

# SYNC_FLAGS="--dry-run"
# SYNC_FLAGS="--info=name,stats1,misc1,flist"
SYNC_FLAGS="--human-readable --update $SYNC_FLAGS"
SYNC_FLAGS="$SYNC_FLAGS --exclude=scss"


if [[ $RUN_ENV_VERBOSE == "yes" ]]; then
  echo -e "Sync Flags: ${SYNC_FLAGS}\n"
fi

echo -e "\n[Syncing assets]"
echo -e "  Project: $BASE_DIR"
echo -e "  Source:  $ASSETS_DIR"
echo -e "  Dest:    ${SERVE_DIR}/${ASSETS_DIR}/"
echo -e ""

rsync ${SYNC_FLAGS} \
  --recursive \
  ${BASE_DIR}/${ASSETS_DIR}/ \
  ${BASE_DIR}/${SERVE_DIR}/${ASSETS_DIR}/

echo -e "Done.\n"
exit 0
