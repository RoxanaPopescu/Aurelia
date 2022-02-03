// tslint:disable: no-submodule-imports
const rename = require("gulp-rename");
const gulp = require("gulp");
const through = require("through2");
const cp = require('child_process');
import path from "path";
import pkgDir from "pkg-dir";

const packageFolder = `${pkgDir.sync()}/`;

// TODO: Read json file src/resources/settings/locales.json
const languages = ["da", "de", "fi", "fr", "it", "nl"];

let tasks: string[] = [];

// First run pull phrase translations
const pullPhraseTask = "pull-phrase";
gulp.task(pullPhraseTask, () =>
{
    cp.exec('phrase pull');
});
tasks.push(pullPhraseTask);

// Transform the translations - one task for each
for (const language of languages)
{
    const taskName = convertLanguageTask(language);
    console.info(`Will convert language ${language} with taskName ${taskName}`);
    tasks.push(taskName);
}

// Run tasks
gulp.series(...tasks)();

// Read  the files and convert them
function convertLanguageTask(fileName: string): string
{
    const currentPath = resolve(`artifacts/translation/phrase/${fileName}.xlf`);
    const outputPath = resolve(`src/resources/translations/${fileName}.json`);
    const taskName = `localize-xliff-${fileName}`;

    gulp.task(taskName, () =>
    {
        return gulp

            .src(currentPath)
            .pipe(through.obj((file: any, encoding: any, callback: any) =>
            {
                const json = importXliffToJson(file.contents.toString());
                file.contents = new Buffer(JSON.stringify(json));

                callback(null, file);
            }))

            // Rename the destination file.
            .pipe(rename(
            {
                extname: ".json"
            }))

            // Write the destination file.
            .pipe(gulp.dest(path.posix.dirname(outputPath)));
    });

    return taskName;
}

/**
 * Converts the specified XLIFF string, representing a translation import file, to a JSON object.
 * @param xliff The XLIFF string representing the import file.
 * @returns The JSON object representing the import file.
 */
function importXliffToJson(xliff: any): string
{

    const json: any = { };

    const unitRegexp = /<trans-unit id="([^"]*?)">([\s\S]*?)<\/trans-unit>/g;

    // NOTE: When importing, the language being imported must be manually specified here.
    const targetRegexp = /<target xml:lang="fi">([\s\S]*)<\/target>|$/;

    let unitMatch;

    while (unitMatch = unitRegexp.exec(xliff))
    {
        const result = targetRegexp.exec(unitMatch[2]);

        if (result != null && result[1] != null) {
            json[decodeXmlEntities(unitMatch[1], true)] = decodeXmlEntities(result[1], false);
        }
    }

    return json;
}

/**
 * Decodes any XML character entities in the specified text.
 * @param text The text to decode.
 * @returns The the decoded text.
 */
function decodeXmlEntities(text: any, isAttributeContent: any): string
{
    text = text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

    if (isAttributeContent)
    {
        text = text
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, "\"");
    }

    return text;
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
