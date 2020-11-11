import path from "path";
import pkgDir from "pkg-dir";

// Get the path for the root of the package.
const packageFolder = `${pkgDir.sync()}/`;

/**
 * The paths and globs used by the tasks.
 */
export const paths =
{
    /**
     * The path for the package folder.
     */
    packageFolder: packageFolder,

    /**
     * The path for the `node_modules` folder.
     */
    nodeModulesFolder: resolve("node_modules/"),

    /**
     * The path for the `src` folder.
     */
    srcFolder: resolve("src/"),

    /**
     * The globs matching the paths for the files that should be translated.
     */
    translationSources:
    {
        /**
         * The globs matching the paths for the files to include.
         * This should match the tests for the `translation-loader` plugin in the Webpack build config.
         */
        includedFileGlobs:
        [
            resolve("src/**/resources/strings/**/*.json")
        ],

        /**
         * The globs matching the paths for the files to exclude.
         * Use this to e.g. exclude features that are not yet ready for translation.
         */
        excludedFileGlobs:
        [
            resolve("**/.*"),
            resolve("**/~*")
        ]
    },

    /**
     * The path for the files containing the translations for the app,
     * where `{locale}` is a placeholder for the locale code.
     */
    translationImportFile: resolve("src/resources/translations/{locale}.json"),

    /**
     * The artifacts that may be produced.
     */
    artifacts:
    {
        /**
         * The path for the folder representing the `build` artifact.
         */
        buildFolder: resolve("artifacts/build/"),

        /**
         * The path for the file to which translatable strings will be exported.
         */
        translationExportFile: resolve("artifacts/translation/export.json")
    }
};

/**
 * Appends the specified path or glob to the absolute package folder path.
 * @param pathOrGlob The path or glob to append.
 * @returns The absolute path or glob.
 */
function resolve(pathOrGlob: string): string
{
    return path.join(packageFolder, pathOrGlob);
}
