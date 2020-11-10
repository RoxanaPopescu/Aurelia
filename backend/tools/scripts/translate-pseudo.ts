// tslint:disable: no-submodule-imports

import fs from "fs";
import path from "path";
import { Plugin } from "gulp-translate/lib/plugin/plugin";
import { translateConfig } from "../translate";
import { paths } from "../paths";

// The path for the export file that should be translated.
const exportFilePath = paths.artifacts.translatables;

// The path for the import file to create.
const importFilePath = paths.translations.replace("{locale}", "en-US-x-pseudo");

// Create the translate task.
const plugin = new Plugin(translateConfig);
const task = plugin.translate({ translator: "pseudo" });

// Process the export file to create an import file.

const fileContents = fs.readFileSync(exportFilePath).toString();
const file = { contents: fileContents, path: exportFilePath };

fs.mkdirSync(path.dirname(importFilePath), { recursive: true });

task.process(file)
    .then(f => fs.writeFileSync(importFilePath, JSON.stringify(JSON.parse(f.contents)["./"], null, 2)))
    .catch(reason => console.error(reason));

console.info(`Pseudo-translations saved to:\n${importFilePath}\n`);
