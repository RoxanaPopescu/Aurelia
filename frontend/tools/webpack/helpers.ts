import chalk from "chalk";
import { environment } from "../env";
import { ICompilerOptions } from "./compile/compiler-options";

export function logTaskInfo(compilerOptions: ICompilerOptions): void
{
    // tslint:disable: prefer-template

    console.info(Format.info("i") +
        ` Building in environment '${Format.info(environment.name)}'\n`);

    console.info(Format.info("i") +
        " Building for" +
        ` environment '${Format.info(compilerOptions.environment.name)}',` +
        ` platform '${Format.info(compilerOptions.environment.platform)}',` +
        ` locale '${Format.info(compilerOptions.environment.locale)}'\n`);

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
     * Formats the specified text using the `info` style, which is bold and blue.
     * @param text The text to format.
     * @returns The formatted text.
     */
    export function info(text: string): string
    {
        return chalk.bold(chalk.blue(text));
    }

    /**
     * Formats the specified text using the `positive` style, which is bold and green.
     * @param text The text to format.
     * @returns The formatted text.
     */
    export function positive(text: string): string
    {
        return chalk.bold(chalk.green(text));
    }

    /**
     * Formats the specified text using the `attention` style, which is bold and yellow.
     * @param text The text to format.
     * @returns The formatted text.
     */
    export function attention(text: string): string
    {
        return chalk.bold(chalk.yellow(text));
    }

    /**
     * Formats the specified text using the `negative` style, which is bold and red.
     * @param text The text to format.
     * @returns The formatted text.
     */
    export function negative(text: string): string
    {
        return chalk.bold(chalk.red(text));
    }
}
