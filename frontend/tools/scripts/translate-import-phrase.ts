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

const sharedFilePath = resolve(`artifacts/translation/shared.xliff`);
const appFilePath = resolve(`artifacts/translation/app.xliff`);


/**
* Converts the specified XLIFF string, representing a translation import file, to a JSON object.
* @param xliff The XLIFF string representing the import file.
* @returns The JSON object representing the import file.
*/
function importXliffToJson(xliff)
{
    const json = { "./": {} };

    const unitRegexp = /<trans-unit id="([^"]*?)">([\s\S]*?)<\/trans-unit>/g;
    const targetRegexp = /<target>([\s\S]*)<\/target>|$/;

    let unitMatch;

    while (unitMatch = unitRegexp.exec(xliff))
    {
        json["./"][decodeXmlEntities(unitMatch[1], true)] = decodeXmlEntities(targetRegexp.exec(unitMatch[2])[1]);
    }

    return json;
}

/**
 * Decodes any XML character entities in the specified text.
 * @param text The text to decode.
 * @returns The the decoded text.
 */
function decodeXmlEntities(text, isAttributeContent)
{
    text = text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

    if (isAttributeContent)
    {
        text = text
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, "\"")
    }

    return text;
}
