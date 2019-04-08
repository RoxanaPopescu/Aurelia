import path from "path";
import autoprefixer from "autoprefixer";
import HtmlWebpackPlugin from "html-webpack-plugin";
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
    const autoprefixerOptions: autoprefixer.Options =
    {
        browsers: compilerOptions.environment.name === "development"
            ? ["last 1 version"]
            : ["last 2 version"]
    };

    const config: Configuration =
    {
        mode: compilerOptions.environment.optimize ? "production" : "development",
        resolve:
        {
            extensions: [".ts", ".js", ".jsx", ".tsx"],
            modules: [paths.srcFolder, path.join(paths.srcFolder, "mover"), paths.nodeModulesFolder, path.join(paths.srcFolder, "mover/node_modules")]
        },
        entry:
        {
            app: ["aurelia-bootstrapper"]
        },
        output:
        {
            path: buildFolder,
            publicPath: compilerOptions.environment.appBaseUrl,
            filename: compilerOptions.environment.optimize ? "[name].[chunkhash].bundle.js" : "[name].[hash].bundle.js",
            sourceMapFilename: compilerOptions.environment.optimize ? "[name].[chunkhash].bundle.map" : "[name].[hash].bundle.map",
            chunkFilename: compilerOptions.environment.optimize ? "[name].[chunkhash].chunk.js" : "[name].[hash].chunk.js",

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
                        test: /[\\/]node_modules[\\/]|svg/,
                        chunks: "all",
                        priority: 1
                    }
                }
            }
        },
        performance:
        {
            hints: false
        },
        devtool: compilerOptions.environment.optimize ? "nosources-source-map" : "cheap-module-eval-source-map",
        module:
        {
            rules:
            [
                // Loader for `.scss` files defining themes, one of which will be loaded during app start.
                // Note that we need `style-loader` to inject the these.
                {
                    test: /\/themes\/.+\.scss$/,
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
                            options: { sourceMap: true, includePaths: paths.styleFolders }
                        }
                    ]
                },

                // Loader for `.scss` files required in `.ts` or `.tsx` files.
                // Note that we need `style-loader` to inject the these.
                {
                    test: /\.scss$/,
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
                            options: { sourceMap: true, includePaths: paths.styleFolders }
                        }
                    ],
                    issuer: /\.tsx?$/i
                },

                // Loader for `.css` files required in `.ts` files.
                // Note that we need `style-loader` to inject the these.
                {
                    test: /\.css$/,
                    use:
                    [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: true, plugins: () => [autoprefixer(autoprefixerOptions)] }
                        }
                    ],
                    issuer: /\.tsx?$/i
                },

                // Loader for `.scss` files required in `.html` files.
                // Note that we do not need `style-loader` to inject the these, as Aurelia handles that itself.
                {
                    test: /\.scss$/,
                    use:
                    [
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: true, plugins: () => [autoprefixer(autoprefixerOptions)] }
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: true, includePaths: paths.styleFolders }
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
                    test: /\/resources\/strings\/.*\.json$/,
                    use:
                    [
                        { loader: "translation-loader", options: translateConfig }
                    ]
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

                // Loaders that embed small files as Data URLs and larger ones as files.
                {
                    test: /\.(png|gif|jpg|cur|svg)$/i,
                    exclude: paths.iconFolders,
                    loader: "url-loader",
                    options: { limit: 10000 }
                },
                {
                    test: /\.woff2(\?v=[^&]*)?$/i,
                    loader: "url-loader",
                    options: { limit: 10000, mimetype: "application/font-woff2" }
                },
                {
                    test: /\.woff(\?v=[^&]*)?$/i,
                    loader: "url-loader",
                    options: { limit: 10000, mimetype: "application/font-woff" }
                },

                // Loader for files that should be fetched separately.
                {
                    test: /\.(ttf|eot|svg|otf)(\?v=[^&]*)?$/i,
                    exclude: paths.iconFolders,
                    loader: "file-loader"
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
                    reportFilename: "bundle-analysis.html",
                    defaultSizes: "parsed",
                    openAnalyzer: false,
                    generateStatsFile: false
                })
            ] : []
        ]
    };

    return config;
}
