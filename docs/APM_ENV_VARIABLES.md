
## ENVIRONMENT VARIABLES USED BY THE APM PACKAGE

_How the list was created_

```sh
grep -ir -E \
  -e env\\.\\S+\\b  \
  -e npm_config\\S+\\b \
    --only-matching \
    --no-filename \
    --exclude-dir=node_modules \
    $(apm config get prefix) \
      | sort -u --ignore-case  
```

These values can provide useful information for debugging issues.

- `env.ATOM_ACCESS_TOKEN`
- `env.ATOM_API_URL`
- `env.ATOM_ARCH`
- `env.ATOM_ELECTRON_URL`
- `env.ATOM_ELECTRON_VERSION`
- `env.ATOM_HOME`
- `env.ATOM_PACKAGES_URL`
- `env.ATOM_REPOS_HOME`
- `env.ATOM_RESOURCE_PATH`
- `env.GITHUB_USER`
- `env.GYP_MSVS_VERSION`
- `ENV.has_key`
- `env.HOME`
- `env.HTTP_PROXY`
- `env.HTTPS_PROXY`
- `env.LOCALAPPDATA`
- `env.NODE_DEBUG`
- `env.NODE_TLS_REJECT_UNAUTHORIZED`
- `env.npm_config_arch`
- `env.npm_config_cache`
- `env.npm_config_disturl`
- `env.npm_config_node_gyp`
- `env.npm_config_python`
- `env.npm_config_registry`
- `env.npm_config_runtime`
- `env.npm_config_target`
- `env.npm_config_target_arch`
- `env.PATH`
- `env.ProgramFiles`
- `env.PYTHON`
- `env.RUSTUP_HOME`
- `env.SystemDrive`
- `env.USERPROFILE`
- `env.Path`
- `npm_config_node_gyp`
- `npm_config_python`
- `npm_config_python="${binDir}/python-interceptor.sh`
- `npm_config_python="${SCRIPT_DIR}/python-interceptor.sh`

```
  "defaultEnv": {
    "USER_HOME": "$( process.env.HOME)||process.env.USERPROFILE)",
    "ATOM_USER_HOME": "${HOME}/.atom",
    "ATOM_USER_APM_HOME": "${ATOM_USER_HOME}/.apm",
    "ATOM_USER_APM_LOGS": "${ATOM_USER_APM_HOME}/_logs",
    "ATOM_HOME": "$(apm config get prefix)",
    "ATOM_APM_HOME": "${ATOM_HOME}/.apm",
    "ATOM_API_URL": "https://atom.io/api"
  }
```
