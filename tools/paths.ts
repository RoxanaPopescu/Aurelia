import path from "path";
import pkgDir from "pkg-dir";

// Get the path for the root of the package.
const packageFolder = `${pkgDir.sync()}/`;

/**
 * The paths and globs that should be ignored by the tasks.
 */
export const excludedFileGlobs =
[
    resolve("**/.*"),
    resolve("**/.*/**"),
    resolve("**/~*"),
    resolve("**/~*/**"),
    resolve("**/Thumbs.db")
];

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
     * The path for the folder containing the legacy code,
     * that does not play well with hot module replacement.
     */
    legacyFolder: resolve("src/legacy/"),

    /**
     * The path for the `static` folder.
     */
    staticFolder: resolve("static/"),

    /**
     * The paths for the folders containing bundled icons.
     */
    iconFolders:
    [
        resolve("src/resources/icons/")
    ],

    /**
     * The paths for the root folders to use when resolving imports in `.scss` files.
     */
    styleFolders:
    [
        resolve("src/"),
        resolve("src/resources/styles/")
    ],

    /**
     * The globs matching the paths for the resources that should be copied to the `build` artifact.
     */
    resources:
    {
        /**
         * The globs matching the paths to include.
         */
        includedFileGlobs:
        [
            resolve("src/worker.js"),
            resolve("src/**/resources/fonts/**"),
            resolve("src/**/resources/images/**"),
            resolve("src/**/resources/files/**"),
            resolve("src/resources/themes/*/images/**"),
            resolve("src/resources/themes/*/integration/**")
        ],

        /**
         * The globs matching the paths to exclude.
         */
        excludedFileGlobs:
        [
            ...excludedFileGlobs,
            resolve("**/*.psd")
        ]
    },

    /**
     * The globs matching the paths for the files that contain translatable strings.
     */
    translatables:
    {
        /**
         * The globs matching the paths for the files to include.
         * This should match the tests for the `translation-loader` plugin in the Webpack build config.
         */
        includedFileGlobs:
        [
            resolve("src/**/*.html"),
            resolve("src/**/resources/strings/**/*.json")
        ],

        /**
         * The globs matching the paths for the files to exclude.
         * Use this to e.g. exclude features that are not yet ready for translation.
         */
        excludedFileGlobs:
        [
            ...excludedFileGlobs
        ]
    },

    /**
     * The path for the file that contains the translated strings,
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
         * The path for the folder representing the `bundle-analysis` artifact,
         * where `{locale}` is a placeholder for the locale code.
         */
        bundleAnalysisFile: resolve("artifacts/build/{locale}/bundle-analysis.html"),

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
