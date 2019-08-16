import webpack from "webpack";
import { Format } from "../helpers";
import { ICompilerOptions } from "./compiler-options";

/**
 * Called every time a compilation ends.
 * Note that if not in watch more, this will kill the process if any
 * errors occurred, or if compilation failed.
 * @param compilerOptions The compiler options.
 * @param stats The compilation stats, if the compilation succeeded.
 * @param error The error that occurred, if the compilation failed.
 */
export function compilerCallback(compilerOptions: ICompilerOptions, stats: webpack.Stats, error?: Error & { details?: any }): void
{
    // Note: In watch mode, the development server is responsible for logging errors.

    // Are we building for deployment?
    if (!compilerOptions.watch)
    {
        // Did the build crash?
        if (error)
        {
            // Log the error.
            console.error(error);

            // Log error details, if available.
            if (error.details)
            {
                console.error(error.details);
            }

            // Indicate that the process failed.
            process.exitCode = 1;
        }
        else
        {
            // Log the compilation stats.
            console.log(`${stats.toString(
            {
                entrypoints: false,
                modules: false,
                children: false,

                colors: Format.supportsColor
            })}\n`);

            // Did the build fail?
            if (stats.hasErrors())
            {
                // Indicate that the process failed.
                process.exitCode = 1;
            }
        }
    }

    // Log the build status, making sure it appears after any other build messages.
    if (!error && !stats.hasErrors())
    {
        setTimeout(() => console.info(`${Format.positive("Build succeeded")}`), 0);
    }
    else
    {
        setTimeout(() => console.error(`\n${Format.negative("Build failed")}`), 0);
    }
}
