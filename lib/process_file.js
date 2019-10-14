import { encoding } from "./var/encoding";

const process_file = async (filename) => {
  const { fs } = require("fs");
  var fildata;
  console.log("filename", filename);
  if (!filename) { return false; }

  let base_dir = process.env.INIT_CWD || ".";
  console.log("base_dir", base_dir);

  var filepath = [base_dir, filename].join("/");
  console.log("filepath", filepath);
  await fs.readFile(filepath, ((err, data) => {
    if (err) {console.log("Error reading from file", err, data);
      return false;
    }
    fildata = Buffer.from(data).toString(encoding);
  }));

  console.log("fildata", fildata);
  return JSON.parse(fildata);
};

export { process_file };
