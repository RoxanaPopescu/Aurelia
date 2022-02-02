// tslint:disable: no-submodule-imports
const rename = require("gulp-rename");
const gulp = require("gulp");
const through = require("through2");
import path from "path";
import pkgDir from "pkg-dir";

const packageFolder = `${pkgDir.sync()}/`;
const filePath = resolve("artifacts/translation/it.json");

// Export fo xliff
convertToXliff();
console.info("Translations saved as xcliff");

function convertToXliff(): void
{
    const taskName = `localize.export-xliff`;

    gulp.task(taskName, () =>
    {
        return gulp

            // Get the source file.
            .src(filePath)

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
            .pipe(gulp.dest(path.posix.dirname(filePath)));
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
        "    <file original=\"translate.xliff\" source-language=\"fr\">\n" +
        "        <header></header>\n" +
        "        <body>\n";

    for (let key of Object.keys(json))
    {
        const content: any = json[key];

        xliff +=
            "            <trans-unit id=\"" + encodeXmlEntities(key, true) + "\">\n" +
            "                <source>" + encodeXmlEntities(content, false) + "</source>\n" +
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
