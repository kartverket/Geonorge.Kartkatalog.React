//Chat gpt generert script for å finne JS filer som burde være JSX, ved å la en parser prøve å lese hver .js fil som JSX, og kun renamer de filene som faktisk inneholder JSX syntax. 

import { readFileSync, readdirSync, statSync, renameSync } from "node:fs";
import path from "node:path";
import { transformSync } from "esbuild";

const SRC_DIR = path.resolve("src");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function isJsxFile(jsPath) {
  const code = readFileSync(jsPath, "utf8");
  try {
    // Hvis denne lykkes, betyr det at JSX-syntaks finnes/er tillatt og parsbar.
    // Hvis fila er ren JS uten JSX, vil dette også ofte lykkes — derfor legger vi inn et
    // ekstra “must contain JSX token” sjekk med esbuild sin parse:
    // Esbuild har ikke en ren "containsJSX" flag, så vi gjør en trygg hybrid:
    // 1) Regex grovfilter (billig)
    // 2) Parser som verifiserer at det faktisk er gyldig JSX
    if (!/[<][A-Za-z]|<\/[A-Za-z]|<>\s*|<\/>/.test(code)) return false;

    transformSync(code, { loader: "jsx" });
    return true;
  } catch {
    return false;
  }
}

const files = walk(SRC_DIR).filter((p) => p.endsWith(".js"));

const toRename = [];
for (const f of files) {
  if (isJsxFile(f)) toRename.push(f);
}

if (toRename.length === 0) {
  console.log("No .js files with JSX found.");
  process.exit(0);
}

console.log("Will rename the following files to .jsx:");
for (const f of toRename) console.log(" - " + path.relative(process.cwd(), f));

for (const f of toRename) {
  const newPath = f.replace(/\.js$/, ".jsx");
  renameSync(f, newPath);
}

console.log(`Renamed ${toRename.length} files.`);