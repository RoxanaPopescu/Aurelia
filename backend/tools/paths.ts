import path from "path";
import pkgDir from "pkg-dir";

// Get the path for the root of the package.
const packageFolderPath = `${pkgDir.sync()}/`;

/**
 * The paths and globs used by the tasks.
 */
export const paths =
{
    /**
     * The path for the package folder.
     */
    packageFolder: packageFolderPath,

    /**
     * The path for the `src` folder.
     */
    srcFolder: resolve("src/"),

    /**
     * The paths for the files that should be translated.
     */
    translatables:
    {
        /**
         * The glob patterns matching files that should be translated.
         */
        includedGlobs:
        [
            resolve("src/**/resources/strings/**/*.json")
        ],

        /**
         * The glob patterns matching files that should not be translated.
         * Use this to e.g. exclude features that are not yet ready for translation.
         * BUG: Note that these apparently won't work if resolved.
         */
        excludedGlobs:
        [
            "**/.*",
            "**/~*"
        ]
    },

    /**
     * The path for the files containing the translations for the app,
     * where `{locale}` is a placeholder for the locale code.
     */
    translations: resolve("src/resources/translations/{locale}.json"),

    /**
     * The artifacts that may be produced.
     */
    artifacts:
    {
        /**
         * The path for the file to which translatable strings will be exported.
         */
        translatables: resolve("artifacts/translation/export.json")
    }
};

/**
 * Appends the specified path or glob to the absolute package folder path.
 * @param pathOrGlob The path or glob to append.
 * @returns The absolute path or glob.
 */
function resolve(pathOrGlob: string): string
{
    return path.join(packageFolderPath, pathOrGlob);
}
