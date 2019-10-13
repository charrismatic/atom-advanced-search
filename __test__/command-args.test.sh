#!/bin/bash

./dist/apm-search.js && \
./dist/apm-search.js --help && \
./dist/apm-search.js --verbose && \
./dist/apm-search.js --version && \
./dist/apm-search.js --sort-stars && \
./dist/apm-search.js --sort-downloads &&  \
./dist/apm-search.js --select-packages &&  \
./dist/apm-search.js --select-featured &&  \
./dist/apm-search.js --select-themes


echo "SUCCESS - NO INPUT GIVEN FOR ALL FLAGS DOES NOT YIELD AN ERROR"




./dist/apm-search.js --sort-downloads wilson
./dist/apm-search.js --sort-stars wilson




./dist/apm-search.js dolphin
./dist/apm-search.js elephant
