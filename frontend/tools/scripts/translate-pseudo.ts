// tslint:disable: no-submodule-imports

import fs from "fs";
import path from "path";
import { Plugin } from "gulp-translate/lib/plugin/plugin";
import { translateConfig } from "../translate";
import { paths } from "../paths";
import { Format } from "../webpack/helpers";

// The path for the export file that should be translated.
const exportFilePath = paths.artifacts.translationExportFile;

// The path for the import file to create.
const importFilePath = paths.translationImportFile.replace("{locale}", "en-x-pseudo");

// Create the translate task.
const plugin = new Plugin(translateConfig);
const task = plugin.translate({ translator: "pseudo" });

// Process the export file to create an import file.

const fileContents = fs.readFileSync(exportFilePath).toString();
const file = { contents: fileContents, path: exportFilePath };

fs.mkdirSync(path.dirname(importFilePath), { recursive: true });

task.process(file)
    .then(f => fs.writeFileSync(importFilePath, f.contents))
    .catch(reason => console.error(reason));

console.info(`Pseudo-translations saved to:\n${Format.info(importFilePath)}\n`);
