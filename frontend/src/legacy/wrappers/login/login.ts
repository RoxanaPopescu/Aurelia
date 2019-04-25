import { autoinject, noView, ObserverLocator, InternalPropertyObserver } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Wrapper } from "../wrapper";

// Import the component that should be wrapped.
import Component from "shared/src/components/login/index";
import Localization from "shared/src/localization";
import { Profile } from "shared/src/model/profile";

@noView
@autoinject
export class LoginCustomElement extends Wrapper
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element, router: Router, observerLocator: ObserverLocator)
    {
        super(element);
        this._router = router;
        this._observerLocator = observerLocator;
    }

    private readonly _router: Router;
    private readonly _observerLocator: ObserverLocator;
    private _isAuthenticatedObserver: InternalPropertyObserver;

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component,
        {
            description: Localization.operationsValue("Login_Info_Description")
        });

        this._isAuthenticatedObserver = this._observerLocator.getObserver(Profile, "isAuthenticated");
        this._isAuthenticatedObserver.subscribe(this.onIsAuthenticatedChanged);
    }

    /**
     * Called by the framework when the component is dettached from the DOM.
     */
    public dettached(): void
    {
        this._isAuthenticatedObserver.unsubscribe(this.onIsAuthenticatedChanged);
    }

    /**
     * Called when the `isAuthenticated` property on the `Profile` changes.
     */
    private onIsAuthenticatedChanged = (newValue: boolean) =>
    {
        if (newValue)
        {
            this._router.navigate("/");
        }
    }
}
