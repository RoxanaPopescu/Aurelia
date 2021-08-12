// tslint:disable: no-submodule-imports
const rename = require("gulp-rename");
const gulp = require("gulp");
const through = require("through2");
import fs from "fs";
import path from "path";
import pkgDir from "pkg-dir";
import globs from "globs";
import { Plugin } from "gulp-translate/lib/plugin/plugin";
import { translateConfig } from "../translate";

const packageFolder = `${pkgDir.sync()}/`;
const plugin = new Plugin(translateConfig);

const sharedFilePath = resolve(`artifacts/translation/shared.json`);
const appFilePath = resolve(`artifacts/translation/app.json`);

// Translate
translate("shared", sharedFilePath);
translate("app", appFilePath);
console.info(`Translations saved as .json`);

// Export fo xliff
convertToXliff("shared", sharedFilePath);
convertToXliff("app", appFilePath);
console.info(`Translations saved as xcliff`);

function translate(type: "shared" | "app", currentPath: string)
{
    translateConfig.exportFilePath = currentPath;
    const task = plugin.export(translateConfig);

    const filePaths = globs.sync([
        resolve(`src/${type}/**/*.html`),
        resolve(`src/${type}/**/resources/strings/**/*.json`)
    ],
    {
        ignore: translateConfig.excludedFilePaths
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

function convertToXliff(type: "shared" | "app", currentPath: string)
{
    const taskName = `localize.export-xliff-${type}`;

    gulp.task(taskName, () =>
    {
        return gulp

            // Get the source file.
            .src(currentPath)

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
            .pipe(gulp.dest(path.posix.dirname(currentPath)));
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
function exportJsonToXliff(json: any)
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

        let note =
            "Found in:\n" + unit.sources.join("\n");

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
function encodeXmlEntities(text: any, isAttributeContent: any)
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