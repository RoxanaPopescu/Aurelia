import React from "react";
import ReactDom from "react-dom";
import { Router as ReactRouter } from "react-router";
import { autoinject, noView, Container } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Type } from "shared/types";
import { GoogleMapsService } from "shared/google-maps";

const history =
{
    push: async (path: string, state?: any) => Container.instance.get(Router).navigate(path),
    go: (delta: number) => window.history.go(delta),
    goBack: () => window.history.back(),
    goForward: () => window.history.forward(),
    location: window.location,
    listen: (...args) => () => undefined,
    replace: (...args) => { throw new Error("router.history.replace is not implemented") },
    createHref: (l: { pathname: string, search: any }) => l.pathname + (l.search ? "?" + l.search : "")

} as any;

@noView
@autoinject
export class Wrapper
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element;
        this._element.classList.add("react-component");

        // Ensure Google Maps is loaded, as legacy code may depend on it.
        Container.instance.get(GoogleMapsService).load();
    }

    private readonly _element: Element;

    /**
     * Called by the component implementation when the component is attached to the DOM.
     */
    public attached(component: Type, params?: any, props?: any): void
    {
        ReactDom.render(React.createElement(ReactRouter, { history }, React.createElement(component,
        {
            location: window.location,
            history,
            match:
            {
                params: params || {}
            },
            ...props
        })),
        this._element);
    }

    /**
     * Called by the component implementation when the component is detached from the DOM.
     */
    public detached(): void
    {
        ReactDom.unmountComponentAtNode(this._element);
    }
}
