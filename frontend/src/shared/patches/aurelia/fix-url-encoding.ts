// tslint:disable: no-invalid-this no-unbound-method

import { RouteRecognizer } from "aurelia-route-recognizer";

/**
 * HACK:
 * Fix a route generation bug causing the characters `/` and `?` to be unnessesarily encoded within the query and fragment part of the URL.
 * This should ideally be fixed in the `aurelia-path` module, as that's where the bug originates, but we can't patch that.
 */
const generateFunc = RouteRecognizer.prototype.generate;
RouteRecognizer.prototype.generate = function(): string
{
    const url = generateFunc.apply(this, arguments as any);

    return url.replace(/^(.*?)([?#])(.*)$/, ($0: string, $1: string, $2: string, $3: string) =>
    {
        return $1 + ($3 ? ($2 + $3.replace(/%2F/g, "/").replace(/%3F/g, "?")) : "");
    });
};
