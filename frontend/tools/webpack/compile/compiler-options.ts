// tslint:disable-next-line: no-reference
/// <reference path="../../../src/typings/globals/env.d.ts" />

/**
 * Represents the compiler options.
 */
export interface ICompilerOptions
{
    /**
     * True to watch the files for changes, otherwise false.
     */
    watch: boolean;

    /**
     * True top enable the bundle analyzer, otherwise false.
     */
    analyze: boolean;

    /**
     * The environment for which to compile.
     * Note that this will be available in the client.
     */
    environment: IClientEnvironment;
}
