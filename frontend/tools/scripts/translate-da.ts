import fs from "fs";
import { paths } from "../paths";

// The path for the export file that was just created.
const exportFilePath = paths.artifacts.translatables;

// The path for the import file that should be updated.
const importFilePath = paths.resources.translations.replace("{locale}", "da");

// Process the export file and update the import file.

const exportFileContents = JSON.parse(fs.readFileSync(exportFilePath).toString());
const oldImportFileContents = JSON.parse(fs.readFileSync(importFilePath).toString());
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
