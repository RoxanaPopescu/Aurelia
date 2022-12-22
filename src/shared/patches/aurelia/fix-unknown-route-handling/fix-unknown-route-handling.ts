// tslint:disable: no-invalid-this no-unbound-method typedef

import { Router, NavigationInstruction, RouteConfig } from "aurelia-router";
import { TemplatingRouteLoader } from "aurelia-templating-router";
import { RouteRecognizer } from "aurelia-route-recognizer";

/**
 * HACK:
 * Due to bugs in the way Aurelia recognizes and loads child routes, an unknown route may not always be detected.
 * To work around this, we hook into the route loading, and check for any mismatch between the route being loaded,
 * and the existence of a child router. If the route has a `*childRoute` segment, indicating the existence of
 * more path segments, but the component being loaded does not have a child router to consume them, we trigger
 * a navigation to a non-existing route, which results in the the unknown route handler being invoked.
 *
 * NOTE:
 * As a consequence of this hack, a wildcard segment in a route pattern must use a name other than `*childRoute`.
 */
const loadRouteFunc = TemplatingRouteLoader.prototype.loadRoute;
TemplatingRouteLoader.prototype.loadRoute = async function(router: Router, config: RouteConfig, navigationInstruction: NavigationInstruction)
{
    const component = await loadRouteFunc.apply(this, arguments as any);
    const hasChildRoute = navigationInstruction.config.route.includes("*childRoute");
    const hasChildRouter = "configureRouter" in component.viewModel;

    if (hasChildRoute && !hasChildRouter)
    {
        console.error("Unknown route detected in TemplatingRouteLoader.loadRoute", component, navigationInstruction);

        // Trigger the unknown route handler by navigating to an invalid route, then restore URL.
        const href = location.href;
        router.navigate("/_invalid_route_", { replace: true, trigger: true });
        history.replaceState(history.state, "", href);
    }

    return component;
};

/**
 * HACK:
 * Due to bugs in the way Aurelia recognizes and loads child routes, an unknown route may not always be detected.
 * To work around this, we hook into the route recognition, and check for any mismatch between the route being recognized,
 * and the existence of redirect in the matched config. If the route has a `*childRoute` segment, indicating the existence
 * of more path segments, but the matched config specifies a redirect, we return an empty recognition result, which will
 * result in the unknown route handler being invoked.
 *
 * NOTE:
 * As a consequence of this hack, a wildcard segment in a route pattern must use a name other than `*childRoute`.
 */
const recognizeFunc = RouteRecognizer.prototype.recognize;
RouteRecognizer.prototype.recognize = function(path: string)
{
    const result = recognizeFunc.apply(this, arguments as any) as any;
    const firstResult = result?.[0];

    if (firstResult != null)
    {
        const hasChildRoute = firstResult.handler.route.includes("*childRoute");
        const isRedirect = firstResult.handler.redirect;

        if (hasChildRoute && isRedirect)
        {
            console.error("Unknown route detected in RouteRecognizer.recognize", firstResult);

            return [];
        }
    }

    return result;
};
