"use strict";

const path = require('path');
const fs = require('fs');
const packageJsonPath = path.resolve(__dirname, '../package.json');

try {
  const packageName = require(packageJsonPath).name;
  const dtsPath = path.resolve(__dirname, `../dist/doc-temp/${packageName}.d.ts`);
  let defs = fs.readFileSync(dtsPath).toString();

  // remove leading declare module
  defs = defs.replace(/^declare module ".*" \{/, '');
  // remove "} declare module {"
  defs = defs.replace(/\}\r?\ndeclare module ".*" \{/g, '');
  // remove closing "}"
  defs = defs.replace(/\}\r?\n$/, '');
  // remove imports
  defs = defs.replace(/^\s+import.*;$/gm, '');
  // remove "export *"
  defs = defs.replace(/^\s+export \*.*;$/gm, '');

  fs.writeFileSync(dtsPath, defs);
  console.log(`Shaped the dist/doc-temp/${packageName}.d.ts file.`);
} catch (e) {
  console.error(`Unable to shape the .d.ts file.`);
  console.error(e.message);
}
