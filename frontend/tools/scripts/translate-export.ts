// tslint:disable: no-submodule-imports
import fs from "fs";
import globs from "globs";
import { Plugin } from "gulp-translate/lib/plugin/plugin";
import { translateConfig } from "../translate";
import { Format } from "../webpack/helpers";

// Get the source file paths.
const filePaths = globs.sync(translateConfig.includedFilePaths,
{
    ignore: translateConfig.excludedFilePaths
});

// Create the export task.
const plugin = new Plugin(translateConfig);
const task = plugin.export(translateConfig);

// Process the source files.
for (const filePath of filePaths)
{
    const fileContents = fs.readFileSync(filePath).toString();
    const file = { contents: fileContents, path: filePath };

    task.process(file)
        .catch(reason => console.error(reason));
}

// Finalize the export task.
task.finalize()
    .catch(reason => console.error(reason));

console.info(`Translatables saved to:\n${Format.info(translateConfig.exportFilePath!)}\n`);
