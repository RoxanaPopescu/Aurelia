import { ProxyConfigMap, ProxyConfigArray } from "webpack-dev-server";

/**
 * Represents the server options.
 */
export interface IServerOptions
{
    /**
     * The port on whihc the server should listen.
     */
    port: number;

    /**
     * True to enable hot module reload, otherwise false.
     */
    hmr: boolean;

    /**
     * True to open the browser, otherwise false.
     */
    open: boolean;

    /**
     * The proxy config to use, or undefined to use no proxy.
     */
    proxy: ProxyConfigMap | ProxyConfigArray;
}
