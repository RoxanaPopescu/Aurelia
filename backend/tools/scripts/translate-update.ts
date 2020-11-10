// tslint:disable: no-submodule-imports

import fs from "fs";
import { paths } from "../paths";

// The locales for which translations should be updated.
const locales =
[
    "da"
];

// The path for the export file that was just created.
const exportFilePath = paths.artifacts.translatables;

// Read the contents of the export file.
const exportFileContents = JSON.parse(fs.readFileSync(exportFilePath).toString());

for (const locale of locales)
{
    // The path for the import file that should be updated.
    const importFilePath = paths.translations.replace("{locale}", locale);

    // Read the contents of the import file.
    const oldImportFileContents = JSON.parse(fs.readFileSync(importFilePath).toString());

    // Update the import file.

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
    "Translation files updated.\n" +
    "Before committing the changes, you must review the translation files, " +
    "and either translate or remove any new or changed strings");
