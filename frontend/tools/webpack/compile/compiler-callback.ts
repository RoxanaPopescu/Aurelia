import webpack from "webpack";
import { ICompilerOptions } from "./compiler-options";
import { Format } from "../helpers";

/**
 * Called every time a compilation ends.
 * Note that if not in watch more, this will kill the process if any
 * errors occurred, or if compilation failed.
 * @param error The error that occurred, if the compilation failed.
 * @param stats The compilaiton stats, if the compilation succeeded.
 * @param compilerOptions The compiler options.
 */
export function compilerCallback(error: Error & { details?: any }, stats: webpack.Stats, compilerOptions: ICompilerOptions): void
{
    if (!compilerOptions.watch && error)
    {
        // Log the error.
        console.error(error);

        // Log error details, if available.
        if (error.details)
        {
            console.error(error.details);
        }

        // Kill the process.
        process.exit(1);
    }
    else
    {
        // Log the compilation stats.
        // tslint:disable-next-line:prefer-template
        console.log(stats.toString(
        {
            entrypoints: false,
            modules: false,
            children: false,

            // tslint:disable-next-line:no-require-imports
            colors: Format.supportsColor
        }) + "\n");

        if (!compilerOptions.watch && stats.hasErrors())
        {
            // Kill the process.
            process.exit(1);
        }
    }
}
