import path from "path";
import autoprefixer from "autoprefixer";
import htmlMinifierTerser from "html-minifier-terser";
import HtmlWebpackPlugin from "html-webpack-plugin";
import PreloadWebpackPlugin from "@vue/preload-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import DuplicatePackageCheckerPlugin from "@cerner/duplicate-package-checker-webpack-plugin";
import { AureliaPlugin } from "aurelia-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { Configuration, DefinePlugin } from "webpack";
import { ICompilerOptions } from "./compiler-options";
import { translateConfig } from "../../translate";
import { paths } from "../../paths";
import themeSettings from "../../../src/resources/settings/themes.json";

/**
 * Creates a Webpack compiler config based on the specified options.
 * @param compilerOptions The compiler options.
 * @param serverOptions The server options.
 * @returns The compiler config.
 */
export function getCompilerConfig(compilerOptions: ICompilerOptions): Configuration
{
    const localeCode = compilerOptions.environment.locale;
    const buildFolder = path.join(paths.artifacts.buildFolder, localeCode);

    if (localeCode !== "en-US")
    {
        // To build for the specified locale, set the import file path.
        translateConfig.importFilePath = translateConfig.importFilePath instanceof Array
            ? translateConfig.importFilePath?.map(p => p.replace("{locale}", localeCode))
            : translateConfig.importFilePath?.replace("{locale}", localeCode);
    }
    else
    {
        // To build for the base locale without an import file, exclude all files.
        translateConfig.excludedFilePaths = ["**"];
    }

    // The options for the `autoprefixer` plugin.
    // When building for the `development` environment, we override the browser list
    // specified in `package.json`, to reducing the clutter caused by prefixes.
    const autoprefixerOptions: autoprefixer.Options & { overrideBrowserslist?: string[] | string } =
    {
        overrideBrowserslist: compilerOptions.environment.name === "development" ?
        [
            "last 1 version",
            "not dead"
        ]
        :
        undefined
    };

    // The options for the `autoprefixer` plugin.
    // When building for the `development` environment, we override the browser list
    // specified in `package.json`, to reducing the clutter caused by prefixes.
    const htmlMinifierTerserOptions: htmlMinifierTerser.Options =
    {
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: false,
        ignoreCustomFragments:
        [
            // HACK:
            //
            // Ignore binding expressions, as they may contain strings in which whitespace should not
            // be collapsed, or may contain character sequences that would cause parse errors.
            //
            // Note that this only matches up to 5 levels of nested brace pairs, and will fail if a brace
            // appears within a string literal, or if text nodes or attribute values contain a character
            // sequence that could be mistaken for the beginning of an interpolation or binding command.

            // Ignore EJS fragments, i.e. `<%...%>`.
            /<%[\s\S]*?%>/,

            // Ignore Auralia string interpolations, i.e. `${...}`.
            new RegExp(`\\$\\{${"[^{]*?(\\{[^{]*?".repeat(5)}${"\\}[^{]*?)*".repeat(5)}\\}`, "s"),

            // Ignore Auralia binding commands, i.e. `attribute.command="..."`.
            /[\w-]+\.([\w-]+)\s*=\s*("[^"]*"|'[^']*'|`[^`]*`)/s
        ]
    };

    // The options for the `file-loader` loader.
    const fileLoaderOptions =
    {
        esModule: false,
        context: paths.srcFolder,
        name: compilerOptions.environment.optimize ? "[path][name].[ext]?[contenthash]" : "[path][name].[ext]"
    };

    const config: Configuration =
    {
        infrastructureLogging:
        {
            level: "warn"
        },
        mode: compilerOptions.environment.optimize ? "production" : "development",
        resolve:
        {
            extensions: [".ts", ".js", ".jsx", ".tsx"],
            modules: [paths.srcFolder, path.join(paths.srcFolder, "legacy/packages"), paths.nodeModulesFolder, path.join(paths.srcFolder, "legacy/node_modules")]
        },
        entry:
        {
            app:
            [
                path.join(paths.srcFolder, "sentry.ts"),
                "aurelia-bootstrapper"
            ]
        },
        output:
        {
            path: buildFolder,
            publicPath: compilerOptions.environment.publicPath,
            filename: compilerOptions.environment.optimize ? "[name].entry.js?[contenthash]" : "[name].entry.js",
            chunkFilename: compilerOptions.environment.optimize ? "[name].chunk.js?[contenthash]" : "[name].chunk.js",
            sourceMapFilename: "[file].map",

            // Only apply hashes to source file names if needed.
            // See: https://www.mistergoodcat.com/post/the-joy-that-is-source-maps-with-vuejs-and-typescript
            devtoolModuleFilenameTemplate: "webpack:///[resource-path]",
            devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]"
        },
        optimization:
        {
            splitChunks:
            {
                cacheGroups:
                {
                    node_modules:
                    {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: "all",
                        priority: 1
                    }
                }
            },

            // TODO: Find a solution that does not require this optimization to be disabled.
            // Needed to avoid a `Cannot determine default view strategy for object` error
            // when opening a modal referenced by class.
            concatenateModules: false
        },
        performance:
        {
            hints: false
        },
        devtool: compilerOptions.environment.optimize ? "source-map" : "eval-source-map",
        module:
        {
            rules:
            [
                // Loader for `.ts` and `.tsx` files.
                {
                    test: /\.(ts|tsx)$/,
                    use:
                    {
                        loader: "ts-loader"
                    }
                },

                // Loader for `.worker.ts` files, representing modules that should be executed in a Web Worker.
                {
                    test: /\.worker\.ts$/,
                    use:
                    {
                        loader: "worker-loader"
                    }
                },

                // Loader for `.json` files containing translatable strings.
                {
                    test: /[\\/]resources[\\/]strings[\\/].*\.json$/,
                    use:
                    {
                        loader: "translation-loader",
                        options: translateConfig
                    }
                },

                // Loader for `.html` files.
                {
                    test: /\.html$/i,
                    use:
                    [
                        {
                            loader: "html-loader",
                            options: { minimize: htmlMinifierTerserOptions }
                        },
                        {
                            loader: "translation-loader",
                            options: translateConfig
                        }
                    ]
                },

                // Loader for `.css` and `.scss` files required in `.html` files.
                {
                    test: /\.(css|scss)$/,
                    issuer: /\.html$/i,
                    exclude: [path.join(paths.srcFolder, "resources/themes")],
                    use:
                    [
                        {
                            loader: "css-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize, esModule: false }
                        },
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize, postcssOptions: { plugins: [autoprefixer(autoprefixerOptions)] } }
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize, sassOptions: { includePaths: paths.styleFolders } }
                        }
                    ]
                },

                // Loader for `.css` and `.scss` files required in `.ts` or `.tsx` files.
                {
                    test: /\.(css|scss)$/,
                    issuer: /\.(ts|tsx)$/i,
                    exclude: [path.join(paths.srcFolder, "resources/themes")],
                    use:
                    [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize }
                        },
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize, postcssOptions: { plugins: [autoprefixer(autoprefixerOptions)] } }
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize, sassOptions: { includePaths: paths.styleFolders } }
                        }
                    ]
                },

                // Loader for `.css` and `.scss` files defining themes, one of which will be loaded during app start.
                {
                    test: /\.(css|scss)$/,
                    include: [path.join(paths.srcFolder, "resources/themes")],
                    use:
                    [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize }
                        },
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize, postcssOptions: { plugins: [autoprefixer(autoprefixerOptions)] } }
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: !compilerOptions.environment.optimize, sassOptions: { includePaths: paths.styleFolders } }
                        }
                    ]
                },

                // Loader for `.svg` icon files, that bundles them as symbols for use with the `icon` component.
                {
                    test: /\.svg$/,
                    include: paths.iconFolders,
                    use:
                    {
                        loader: "svg-sprite-loader",
                        options: { symbolId: "icon-[name]" }
                    }
                },

                // Loaders that embed small files as Data URLs and fetches larger files separately.
                {
                    test: /\.(svg|png|jpg|gif|cur|mp4)$/i,
                    exclude: paths.iconFolders,
                    type: "javascript/auto",
                    use:
                    {
                        loader: "url-loader",
                        options: { ...fileLoaderOptions, limit: 10000 }
                    }
                },
                {
                    test: /\.(woff|woff2)$/i,
                    type: "javascript/auto",
                    use:
                    {
                        loader: "url-loader",
                        options: { ...fileLoaderOptions, limit: 10000 }
                    }
                },

                // Loader for files that should be fetched separately.
                {
                    test: /\.(ttf|eot|otf)$/i,
                    type: "javascript/auto",
                    use:
                    {
                        loader: "file-loader",
                        options: { ...fileLoaderOptions }
                    }
                }
            ]
        },
        plugins:
        [
            new DuplicatePackageCheckerPlugin(),

            new AureliaPlugin({ aureliaApp: "index" }),

            new DefinePlugin(Object.keys(compilerOptions.environment).reduce((e: any, key: string) =>
            {
                e[`ENVIRONMENT.${key}`] = JSON.stringify((compilerOptions.environment as any)[key]);

                return e;
            },
            {
                "ENVIRONMENT": JSON.stringify(compilerOptions.environment)
            })),

            new HtmlWebpackPlugin(
            {
                template: path.join(paths.srcFolder, "index.ejs"),

                ...
                compilerOptions.environment.optimize ?
                {
                    minify: htmlMinifierTerserOptions
                }
                :
                {},

                // Variables available in `index.ejs`.
                environment: compilerOptions.environment,
                themes: themeSettings
            }),

            new PreloadWebpackPlugin(
            {
                rel: "preload",
                include: "initial",
                fileBlacklist: [/\.map$/, /\.hot-update\.js$/]
            }),

            new CopyWebpackPlugin(
            {
                patterns: paths.resources.includedFileGlobs.map(includedFileGlob =>
                ({
                    context: paths.srcFolder,
                    from: includedFileGlob,
                    to: buildFolder,
                    globOptions:
                    {
                        ignore: paths.resources.excludedFileGlobs
                    },
                    noErrorOnMissing: true
                }))
            }),

            ...
            compilerOptions.analyze ?
            [
                new BundleAnalyzerPlugin(
                {
                    analyzerMode: "static",
                    reportFilename: paths.artifacts.bundleAnalysisFile.replace("{locale}", localeCode),
                    defaultSizes: "parsed",
                    openAnalyzer: false,
                    generateStatsFile: false,
                    logLevel: "warn"
                })
            ]
            :
            []
        ]
    };

    return config;
}
