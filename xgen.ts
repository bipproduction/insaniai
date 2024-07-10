import yargs from "yargs";
import * as readdirp from "readdirp";
import * as path from "path";
import * as _ from "lodash"; // Menggunakan sintaks default import
import * as prettier from "prettier";
import * as fs from "fs";

const root = process.cwd();

(() => {
  yargs(process.argv.splice(2), process.cwd())
    .command(
      "api",
      "generate api",
      (yargs) => yargs,
      generateDivisionApi
    )
    .scriptName("xgen")
    .demandCommand(1)
    .recommendCommands()
    .help().argv;
})();

async function generateDivisionApi(argv: any) {
  const dir = path.join(root, "src", "lib", "api");
  const results: string[] = [];
  const listImport: string[] = [];

  for await (const entry of await readdirp.promise(dir, {
    fileFilter: ["*.ts", "!index.ts"],
  })) {
    const fileName = path.basename(entry.path, ".ts");
    const method = entry.path.split("/")[0].toUpperCase();
    const importPath = entry.path.replace(".ts", "");

    const text = `
        {
            "path": "${_.kebabCase(fileName)}",
            "method": "${method}",
            "bin": ${fileName}${method}
        }
        `;
    results.push(text);
    listImport.push(`import {${fileName} as ${fileName}${method}} from "./${importPath}"`);
  }

  const text = `
    ${listImport.join("\n")}
    export const API_INDEX = [${results.join(",")}]
    `;
  const formatted = await prettier.format(text, { parser: "typescript" });
  fs.writeFileSync(path.join(dir, "./index.ts"), formatted);
  console.log("success");
}
