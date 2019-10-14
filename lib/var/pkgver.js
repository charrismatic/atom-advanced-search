import { version, name } from "../../package.json";

const pkgver = () => {
  console.log([name, version].join(" v"));
};

export { pkgver };
