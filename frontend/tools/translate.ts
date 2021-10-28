// tslint:disable: no-submodule-imports

import { paths } from "./paths";
import { ILoaderOptions } from "translation-loader/lib/loader-options";

/**
 * Represents the configuration for the translation tooling.
 * Note how the plugin, command and export options are all in the same object,
 * instead of being separated as in the `gulp-translate` documentation.
 */
export type TranslateOptions = ILoaderOptions &
{
    /**
     * An array of glob patterns matching files from which translation should be exported.
     */
    includedFilePaths: string[];
};

/**
 * The configuration used during content export and translation import.
 * Note that paths must be absolute or relative to the current working directory.
 */
export const translateConfig: TranslateOptions =
{
    // Translation options.
    templateLanguage: "aurelia",
    allowDirectAnnotation: true,
    prefixIdsInContentFiles: true,
    baseFilePath: paths.srcFolder,

    // Export options.
    exportFilePath: paths.artifacts.translationExportFile,
    normalizeContent: true,

    // Import options.
    importFilePath: paths.translationFile,
    missingContentHandling: "warn",

    // File paths.
    includedFilePaths: paths.translatables.includedFileGlobs,
    excludedFilePaths: paths.translatables.excludedFileGlobs
};
