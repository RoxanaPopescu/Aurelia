import { MapObject } from "../types";
import { IApiRequestSettings } from "./api-request-settings";
// tslint:disable-next-line: no-submodule-imports
import { AbortSignal } from "node-fetch/externals";

/**
 * Represents the options to use for an HTTP request.
 */
export interface IApiRequestOptions extends IApiRequestSettings
{
    /**
     * The query parameters associated with the request, represented as an object
     * in which the keys are the parameter names. Note that values will be encoded
     * according to the configured query value format.
     * The default is undefined.
     */
    query?: MapObject;

    /**
     * The body associated with the request, represented as an object that will be
     * serialized to JSON. Note that `HEAD`, `GET` and `DELETE` requests cannot
     * have a body.
     * The default is undefined.
     */
    body?: object;

    /**
     * The signal associated with the request, which is an `AbortSignal` object indicating
     * whether or not the request has been aborted, and its abort event handler.
     * The default is undefined.
     */
    signal?: AbortSignal;

    /**
     * The subresource integrity metadata for the request, which is a cryptographic
     * hash of the resource being fetched. Its value consists of multiple hashes
     * separated by whitespace.
     * The default is undefined.
     */
    integrity?: string;

    /**
     * True to indicate that the request can outlive the global in which it was
     * created, otherwise false.
     * Default is false, or the configured default value.
     */
    keepalive?: boolean;
}
