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
     * The paths for the folders the SCSS transpiler should look in when resolving imports.
     */
    styleFolders:
    [
        resolve("src/"),
        resolve("src/resources/styles/")
    ],

    /**
     * The resources that should be copied to the `build` artifact.
     */
    resources:
    {
        /**
         * The include globs.
         */
        includeGlobs:
        [
            resolve("src/**/resources/fonts/**"),
            resolve("src/**/resources/images/**"),
            resolve("src/resources/themes/*/fonts/**"),
            resolve("src/resources/themes/*/images/**"),
            resolve("src/resources/themes/*/integration/**")
        ],

        /**
         * The exclude globs.
         * BUG: Note that these apparently won't work if resolved.
         */
        excludeGlobs:
        [
            "**/.*",
            "**/~*",
            "**/Thumbs.db",
            "**/*.psd"
        ],

        /**
         * The path for the files containing the translations for the app,
         * where `{locale}` will be replaced with the locale code for the built.
         */
        translations: resolve("src/resources/translations/{locale}.json")
    },

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
        translatables: resolve("artifacts/translation/export.json"),

        /**
         * The path for the folder representing the `bundle-analysis` artifact.
         */
        bundleAnalysis: resolve("artifacts/build/{locale}/bundle-analysis.html"),

        /**
         * The path for the folder in the `frontend-desktop` package,
         * representing the copy of the `build` artifact from the `frontend` package.
         */
        desktopClientBuildFolder: resolve("packages/desktop/artifacts/client/")
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
