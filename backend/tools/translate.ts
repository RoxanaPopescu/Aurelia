// tslint:disable: no-submodule-imports

import { paths } from "./paths";
import { IPluginConfig } from "gulp-translate/lib/plugin/plugin-config";
import { IExportTaskConfig } from "gulp-translate/lib/plugin/export/export-task-config";

/**
 * Represents the configuration for the translation tooling.
 * Note how the plugin, command and export options are all in the same object,
 * instead of being separated as in the `gulp-translate` documentation.
 */
export type TranslateOptions = IPluginConfig & IExportTaskConfig &
{
    /**
     * An array of glob patterns matching files from which translation should be exported.
     */
    includedFilePaths: string[];

    /**
     * An array of glob patterns matching files from which translation should not be exported.
     */
    excludedFilePaths?: string[];
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

    // File paths.
    includedFilePaths: paths.translationSources.includedFileGlobs,
    excludedFilePaths: paths.translationSources.excludedFileGlobs
};
