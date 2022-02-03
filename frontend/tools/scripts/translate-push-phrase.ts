// tslint:disable: no-submodule-imports
const rename = require("gulp-rename");
const gulp = require("gulp");
const through = require("through2");
const cp = require('child_process');
import fs from "fs";
import path from "path";
import pkgDir from "pkg-dir";
import globs from "globs";
import { Plugin } from "gulp-translate/lib/plugin/plugin";
import { translateConfig } from "../translate";

const packageFolder = `${pkgDir.sync()}/`;
const plugin = new Plugin(translateConfig);

const localeFilePath = resolve("artifacts/translation/en.json");
translateConfig.exportFilePath = localeFilePath;

// Create initial file
fs.writeFileSync(localeFilePath, "");

// Translate
translate();
console.info("Translations saved as .json");

// Export fo xliff
convertToXliff();
console.info("Translations saved as xcliff");

// Upload to phrase
const uploadPhaseTask = "upload-phrase";
gulp.task(uploadPhaseTask, () =>
{
    cp.exec('phrase push');
});
gulp.series(uploadPhaseTask)();
console.info("Translations uploaded to phrase");

function translate(): void
{
    const task = plugin.export(translateConfig);

    const filePaths = globs.sync([
        resolve("src/**/*.html"),
        resolve("src/**/resources/strings/**/*.json")
    ],
    {
        ignore: translateConfig.excludedFilePaths,
        dot: true
    });

    for (const filePath of filePaths)
    {
        const fileContents = fs.readFileSync(filePath).toString();
        const file = { contents: fileContents, path: filePath };

        task.process(file)
            .catch(reason => console.error(reason));
    }

    task.finalize().catch(reason => console.error(reason));
}

function convertToXliff(): void
{
    const taskName = "localize.export-xliff";

    gulp.task(taskName, () =>
    {
        return gulp

            // Get the source file.
            .src(localeFilePath)

            // Convert the file from JSON to XLIFF.
            .pipe(through.obj((file: any, encoding: any, callback: any) =>
            {
                const json = JSON.parse(file.contents.toString());
                const xliff = exportJsonToXliff(json);
                file.contents = new Buffer(xliff);

                // Notify stream engine that we are done with this file and push it back into the stream.
                callback(null, file);
            }))

            // Rename the destination file.
            .pipe(rename(
            {
                extname: ".xliff"
            }))

            // Write the destination file.
            .pipe(gulp.dest(path.posix.dirname(localeFilePath)));
    });

    gulp.series(taskName)();
}

/**
 * Appends the specified path or glob to the absolute package folder path.
 * @param pathOrGlob The path or glob to append.
 * @returns The absolute path or glob.
 */
function resolve(pathOrGlob: string): string
{
    return path.join(packageFolder, pathOrGlob);
}

 /**
  * Converts the specified JSON object, representing a translation export file, to an XLIFF string.
  * @param json The JSON object representing the export file.
  * @returns The XLIFF string representing the export file.
  */
function exportJsonToXliff(json: any): string
{
    let xliff =
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<xliff version=\"1.2\">\n" +
        "    <file original=\"translate.xliff\" source-language=\"en\">\n" +
        "        <header></header>\n" +
        "        <body>\n";

    for (let key of Object.keys(json))
    {
        const unit: any = json[key];

        let note = "Found in:\n" + unit.sources.join("\n");

        if (unit.hint)
        {
            note += "\nHint:\n" + unit.hint;
        }

        if (unit.context)
        {
            note += "\nContext:\n" + unit.context.join("\n");
        }

        xliff +=
            "            <trans-unit id=\"" + encodeXmlEntities(key, true) + "\">\n" +
            "                <source>" + encodeXmlEntities(unit.content, false) + "</source>\n" +
            "                <note>" + encodeXmlEntities(note, false) + "</note>\n" +
            "            </trans-unit>\n";
    }

    xliff +=
        "        </body>\n" +
        "    </file>\n" +
        "</xliff>";

    return xliff;
}

/**
 * Encodes any XML character entities in the specified text.
 * @param text The text to encode.
 * @returns The the encoded text.
 */
function encodeXmlEntities(text: any, isAttributeContent: any): string
{
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    if (isAttributeContent)
    {
        text = text
            .replace(/'/g, "&apos;")
            .replace(/"/g, "&quot;")
    }

    return text;
}
