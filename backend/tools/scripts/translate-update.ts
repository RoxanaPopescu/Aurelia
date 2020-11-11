// tslint:disable: no-submodule-imports

import fs from "fs";
import globs from "globs";
import { paths } from "../paths";

// The path for the export file that was just created.
const exportFilePath = paths.artifacts.translationExportFile;

// Read the contents of the export file.
const exportFileContents = JSON.parse(fs.readFileSync(exportFilePath).toString());

// Get the input file paths.
const importFilePaths = globs.sync(paths.translationImportFile.replace(/\{locale\}/g, "!(*[^.]-x-pseudo?(-*|.*))"));

// Update the import files.
for (const importFilePath of importFilePaths)
{
    // Read the contents of the import file.
    const oldImportFileContents = JSON.parse(fs.readFileSync(importFilePath).toString());

    // Update the import file, such that:
    // - The order of the keys is the same as in the export file.
    // - Any keys that exist in the import file, but not in the export file, are removed.
    // - Any keys that exist in the export, file but not in the import file, are added with the source string as value.

    const newImportFileContents = {} as any;

    for (const key of Object.keys(exportFileContents))
    {
        if (oldImportFileContents[key] == null)
        {
            newImportFileContents[key] = exportFileContents[key].content;
        }
        else
        {
            newImportFileContents[key] = oldImportFileContents[key];
        }
    }

    fs.writeFileSync(importFilePath, `${JSON.stringify(newImportFileContents, null, 2)}\n`);
}

console.info(
    // tslint:disable-next-line: prefer-template
    "Translation files updated\n" +
    "Before committing the changes, you must review the translation files, " +
    "and either translate or remove any new or changed strings\n");
