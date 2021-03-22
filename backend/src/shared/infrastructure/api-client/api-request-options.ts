// tslint:disable-next-line: no-submodule-imports
import { AbortSignal } from "abort-controller";
import { BodyInit } from "node-fetch";
import { MapObject } from "../../types";
import { IApiRequestSettings } from "./api-request-settings";

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
     * The body associated with the request, which if represented as an object, and the content type is a JSON
     * variant, will be serialized as JSON. Note that `HEAD`, `GET` and `DELETE` requests cannot have a body.
     * The default is undefined.
     */
    body?: object | BodyInit;

    /**
     * The signal associated with the request, which is an `AbortSignal` object indicating
     * whether or not the request has been aborted, and its abort event handler.
     * The default is undefined.
     */
    signal?: AbortSignal;
}
