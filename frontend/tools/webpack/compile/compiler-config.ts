import path from "path";
import autoprefixer from "autoprefixer";
import HtmlWebpackPlugin from "html-webpack-plugin";
import PreloadWebpackPlugin from "preload-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import DuplicatePackageCheckerPlugin from "duplicate-package-checker-webpack-plugin";
import { AureliaPlugin, ModuleDependenciesPlugin } from "aurelia-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { Configuration, DefinePlugin } from "webpack";
import { ICompilerOptions } from "./compiler-options";
import { translateConfig } from "../../translate";
import { paths } from "../../paths";

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
        translateConfig.importFilePath =
            translateConfig.importFilePath.replace("{locale}", localeCode);
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
        ] : undefined
    };

    const config: Configuration =
    {
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
            publicPath: compilerOptions.environment.appBaseUrl,
            filename: compilerOptions.environment.optimize ? "[name].[chunkhash].bundle.js" : "[name].[hash].bundle.js",
            chunkFilename: compilerOptions.environment.optimize ? "[name].[chunkhash].chunk.js" : "[name].[hash].chunk.js",
            sourceMapFilename: compilerOptions.environment.optimize ? "[file].map" : "[file].map",

            // Only apply hashes to source file names if needed.
            // See: https://www.mistergoodcat.com/post/the-joy-that-is-source-maps-with-vuejs-and-typescript
            devtoolModuleFilenameTemplate: "webpack:///[resource-path]",
            devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]",

            // Needed to ensure web workers load correctly.
            // See: https://github.com/webpack/webpack/issues/6642#issuecomment-371087342
            globalObject: "this"
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
            // Needed to avoid an "Cannot determine default view strategy for object."
            // errors when opening modals referenced by class.
            concatenateModules: false
        },
        performance:
        {
            hints: false
        },
        devtool: compilerOptions.environment.optimize ? "source-map" : "eval-source-map",
        target: compilerOptions.environment.platform === "cloud" ? "web" : "electron-renderer",
        externals: compilerOptions.environment.platform === "cloud" ? [ "electron" ] : undefined,
        module:
        {
            rules:
            [
                // Loader for `.scss` files defining themes, one of which will be loaded during app start.
                // Note that we need `style-loader` to inject the these.
                {
                    test: /\.s?css$/,
                    include: [path.join(paths.srcFolder, "resources/themes")],
                    use:
                    [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: true, plugins: () => [autoprefixer(autoprefixerOptions)] }
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: true, sassOptions: { includePaths: paths.styleFolders } }
                        }
                    ]
                },

                // Loader for `.scss` files required in `.ts` or `.tsx` files.
                // Note that we need `style-loader` to inject the these.
                {
                    test: /\.s?css$/,
                    exclude: [path.join(paths.srcFolder, "resources/themes")],
                    use:
                    [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: true, plugins: () => [autoprefixer(autoprefixerOptions)] }
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: true, sassOptions: { includePaths: paths.styleFolders } }
                        }
                    ],
                    issuer: /\.tsx?$/i
                },

                // Loader for `.scss` files required in `.html` files.
                // Note that we do not need `style-loader` to inject the these, as Aurelia handles that itself.
                {
                    test: /\.s?css$/,
                    exclude: [path.join(paths.srcFolder, "resources/themes")],
                    use:
                    [
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: true, plugins: () => [autoprefixer(autoprefixerOptions)] }
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: true, sassOptions: { includePaths: paths.styleFolders } }
                        }
                    ],
                    issuer: /\.html$/i
                },

                // Loader for `.html` files.
                {
                    test: /\.html$/i,
                    use:
                    [
                        { loader: "html-loader" },
                        { loader: "translation-loader", options: translateConfig }
                    ]
                },

                // Loader for `.json` files containing translatable strings.
                {
                    test: /[\\/]resources[\\/]strings[\\/].*\.json$/,
                    use:
                    [
                        { loader: "translation-loader", options: translateConfig }
                    ]
                },

                // Loader for `.worker.ts` files, representing modules that should executed in a Web Worker.
                {
                    test: /\.worker\.ts$/,
                    use:
                    {
                        loader: "worker-loader"
                    }
                },

                // Loader for `.ts` and `.tsx` files.
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                },

                // Loader for `.svg` icon files, which bundles them as symbols
                // for use with the `icon` component in our framework.
                {
                    test: /\.svg$/,
                    include: paths.iconFolders,
                    loader: "svg-sprite-loader",
                    options: { symbolId: "icon-[name]" }
                },

                // Loaders that embed small files as Data URLs and fetches larger files separately.
                {
                    test: /\.(png|gif|jpg|cur|svg)$/i,
                    exclude: paths.iconFolders,
                    loader: "url-loader",
                    options: { esModule: false, limit: 10000 }
                },
                {
                    test: /\.woff2$/i,
                    loader: "url-loader",
                    options: { esModule: false, limit: 10000 }
                },
                {
                    test: /\.woff$/i,
                    loader: "url-loader",
                    options: { esModule: false, limit: 10000 }
                },

                // Loader for files that should be fetched separately.
                {
                    test: /\.(ttf|eot|otf)$/i,
                    exclude: paths.iconFolders,
                    loader: "file-loader",
                    options: { esModule: false }
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

            new ModuleDependenciesPlugin(
            {
                "aurelia-testing": ["./compile-spy", "./view-spy"]
            }),

            new HtmlWebpackPlugin(
            {
                template: path.join(paths.srcFolder, "index.ejs"),

                // Variables available in `index.ejs`.
                environment: compilerOptions.environment,

                ...
                compilerOptions.environment.optimize ?
                {
                    minify:
                    {
                        removeComments: true,
                        collapseWhitespace: true
                    }
                } : {}
            }),

            new PreloadWebpackPlugin(
            {
                rel: "preload",
                include: "initial",
                fileBlacklist: [/\.map$/, /\.hot-update\.js$/]
            }),

            new CopyWebpackPlugin(paths.resources.includeGlobs.map(includeGlob =>
            ({
                context: paths.srcFolder,
                from: includeGlob,
                to: buildFolder,
                ignore: paths.resources.excludeGlobs
            }))),

            ...
            compilerOptions.analyze ?
            [
                new BundleAnalyzerPlugin(
                {
                    analyzerMode: "static",
                    reportFilename: paths.artifacts.bundleAnalysis.replace("{locale}", localeCode),
                    defaultSizes: "parsed",
                    openAnalyzer: false,
                    generateStatsFile: false,
                    logLevel: "warn"
                })
            ] : []
        ]
    };

    return config;
}
