import { ProxyConfigMap, ProxyConfigArray } from "webpack-dev-server";

/**
 * Represents the server options.
 */
export interface IServerOptions
{
    /**
     * The port on which the server should listen.
     */
    port: number;

    /**
     * True to enable hot module reload, otherwise false.
     */
    hot: boolean;

    /**
     * True to open the browser, otherwise false.
     */
    open: boolean;

    /**
     * The proxy config to use, or undefined to use no proxy.
     */
    proxy?: ProxyConfigMap | ProxyConfigArray;

    /**
     * True to allow connections from any host and any device on the network, otherwise false.
     * Note that this is a major security risk, exposing you to CSRF and DNS Rebinding attacks.
     * See: https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
     */
    public?: boolean;
}
