/**
 * Represents a Web Worker, loaded by Webpack.
 * See: https://github.com/webpack-contrib/worker-loader
 */
declare type WebpackWorker = Worker & (new() => Worker);

declare module "worker-loader!*"
{
    export default {} as WebpackWorker;
}

declare module "*.worker.ts"
{
    export default {} as WebpackWorker;
}
