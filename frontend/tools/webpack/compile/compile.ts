import webpack from "webpack";
import { logTaskInfo } from "../helpers";
import { ICompilerOptions } from "./compiler-options";
import { getCompilerConfig } from "./compiler-config";
import { compilerCallback } from "./compiler-callback";

/**
 * Runs the Webpack compiler.
 * @param compilerConfig The compiler options.
 * @returns A promise that will be resolved when the compilation completes or the watch ends,
 * or rejected if an error occurs, or in build mode, if the compilation fails.
 */
export async function compile(compilerOptions: ICompilerOptions): Promise<void>
{
    logTaskInfo(compilerOptions);

    return new Promise<void>((resolve, reject) =>
    {
        // Get the Webpack compiler config.
        const compilerConfig = getCompilerConfig(compilerOptions);

        // Create the Webpack compiler.
        const compiler = webpack(compilerConfig);

        if (compilerOptions.watch)
        {
            // Run the compiler in watch mode.
            compiler.watch({}, (error, stats) => compilerCallback(error, stats, compilerOptions));
            compiler.hooks.watchClose.tap("watchClose", () => resolve());
        }
        else
        {
            // Run the compiler in build mode.
            compiler.run((error, stats) => compilerCallback(error, stats, compilerOptions));
            compiler.hooks.done.tap("done", () => resolve());
            compiler.hooks.failed.tap("failed", error => reject(error));
        }
    });
}
