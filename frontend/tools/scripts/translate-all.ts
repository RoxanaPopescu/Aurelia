import fs from "fs";
import { paths } from "../paths";

// The locales to convert
const locales = [
    "da",
    "en-x-ikea"
];

// The path for the export file that was just created.
const exportFilePath = paths.artifacts.translatables

let exportFileContents = JSON.parse(fs.readFileSync(exportFilePath).toString());

for (let locale of locales) {
    // The path for the import file that should be updated.
    let importFilePath = paths.resources.translations.replace("{locale}", locale);

    let oldImportFileContents = JSON.parse(fs.readFileSync(importFilePath).toString());
    let newImportFileContents = {} as any;

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

    console.log("Transferred keys to:", locale);
}

console.log("Before committing, remember to update locales\n");
