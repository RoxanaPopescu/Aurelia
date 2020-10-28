// tslint:disable: no-submodule-imports

import path from "path";
import { paths } from "./paths";
import { ILoaderOptions } from "translation-loader/lib/loader-options";

/**
 * Represents the configuration for the translation tooling.
 * Note how the plugin, command and export options are all in the same object,
 * instead of being separated as in the `gulp-translate` documentation.
 */
export type TranslateOptions = ILoaderOptions &
{
    includedFilePaths: string[];
    importFilePath: string;
};

/**
 * The configuration used during content export and translation import.
 * Note that paths must be absolute or relative to the current working directory.
 */
export const translateConfig: TranslateOptions =
{
    // Options for `gulp-translate`.

    templateLanguage: "aurelia",
    normalizeContent: true,
    allowDirectAnnotation: true,
    prefixIdsInContentFiles: true,
    baseFilePath: paths.srcFolder,
    missingContentHandling: "warn",

    // The path to the export file to which content should be exported.
    exportFilePath: paths.artifacts.translatables,

    // The path to the import file from which content should be imported,
    // where `{locale}` should be replaced with the locale code.
    importFilePath: paths.resources.translations,

    // Options for the `translate-export` script.

    /**
     * An array of glob patterns matching files that should be included in the export.
     * Make sure this matches the tests guarding the use of the `translation-loader` in your
     * Webpack configuration.
     */
    includedFilePaths:
    [
        path.join(paths.srcFolder, "**/*.html"),
        path.join(paths.srcFolder, "**/resources/strings/**/*.json")
    ],

    // Options for `translation-loader`.

    /**
     * An array of glob patterns matching files that should be excluded from import and export.
     * Use this to exclude files related to features that are not yet ready for translation.
     */
    excludedFilePaths:
    [
        "**/~*"
    ]
};
