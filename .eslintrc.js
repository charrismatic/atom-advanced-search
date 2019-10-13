module.exports = {
    "env": {
        "node": true,
        "browser": false,
        "es6": true,
        "shelljs": true,
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "indent": ["warn", 2],
      "linebreak-style": [ "error",  "unix" ],
      "quotes": [ "error", "double" ],
      "semi": [ "error", "always" ]
    }
};
