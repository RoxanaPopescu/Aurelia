import chalk from "chalk";
import { environment } from "../env";
import { ICompilerOptions } from "./compile/compiler-options";

export function logTaskInfo(compilerOptions: ICompilerOptions): void
{
    // tslint:disable: prefer-template

    console.info(Format.info("i") +
        ` Running task in environment '${Format.info(environment.name)}'`);

    console.info(Format.info("i") +
        " Building for" +
        ` platform '${Format.info(compilerOptions.environment.platform)}',` +
        ` locale '${Format.info(compilerOptions.environment.locale)}',` +
        ` environment '${Format.info(compilerOptions.environment.name)}'...\n`);

    // tslint: enable
}
/**
 * Namespace providing functions for formatting text in console messages.
 */
export namespace Format
{
    /**
     * True if the console supports color, otherwise false.
     */
    export const supportsColor = chalk.supportsColor.hasBasic;

    /**
     * Formats the specified text using the info style, which is bold and blue.
     * @param text The text to format.
     * @returns The formatted text.
     */
    export function info(text: string): string
    {
        return chalk.bold(chalk.blue(text));
    }

    /**
     * Formats the specified text using the warning style, which is bold and yellow.
     * @param text The text to format.
     * @returns The formatted text.
     */
    export function warn(text: string): string
    {
        return chalk.bold(chalk.yellow(text));
    }

    /**
     * Formats the specified text using the error style, which is bold and red.
     * @param text The text to format.
     * @returns The formatted text.
     */
    export function error(text: string): string
    {
        return chalk.bold(chalk.red(text));
    }
}
