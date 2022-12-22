/**
 * The environment for which the build was compiled.
 *
 * Note that the environment exsists in multiple forms, with different use cases:
 *
 * - The global `ENVIRONMENT` variable, which will be replaced with the serialized environment during build.
 *   This variable do not exist at runtime, and should never be used alone, except to initialize the exported
 *   `environment` constant.
 *
 * - The properties of the global `ENVIRONMENT` variable, e.g. `ENVIRONMENT.debug`, which will be replaced
 *   with their values during build. Use those to conditionally include/exclude code based on the environment.
 *
 * - The exported `environment` constant, which is initialized with the serialized environment.
 *   Use this to get an object representation of the environment at runtime.
 */
export const environment = ENVIRONMENT;
