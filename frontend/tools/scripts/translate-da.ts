import fs from "fs";
import { paths } from "../paths";

// The path for the export file that was just created.
const exportFilePath = paths.artifacts.translatables;

// The path for the import file that should be updated.
const importFilePath = paths.resources.translations.replace("{locale}", "da");

// Process the export file to create an import file.

const exportFileContents = JSON.parse(fs.readFileSync(exportFilePath).toString());
const importFileContents = JSON.parse(fs.readFileSync(importFilePath).toString());

for (const key of Object.keys(exportFileContents))
{
    if (importFileContents[key] == null)
    {
        importFileContents[key] = exportFileContents[key].content;
    }
}

for (const key of Object.keys(importFileContents))
{
    if (exportFileContents[key] == null)
    {
        // tslint:disable-next-line: no-dynamic-delete
        delete importFileContents[key];
    }
}

fs.writeFileSync(importFilePath, `${JSON.stringify(importFileContents, null, 2)}\n`);
