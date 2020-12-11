import { autoinject, noView, ObserverLocator, InternalPropertyObserver } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Wrapper } from "../wrapper";

// Import the component that should be wrapped.
import Component from "shared/src/components/login/index";
import { Profile } from "shared/src/model/profile";
import { IdentityService } from "app/services/identity";
import { ThemeService } from "shared/framework";

@noView
@autoinject
export class LoginCustomElement extends Wrapper
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param router The `Router` instance.
     * @param themeService The `ThemeService` instance.
     * @param observerLocator The `ObserverLocator` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(element: Element, router: Router, themeService: ThemeService, observerLocator: ObserverLocator, identityService: IdentityService)
    {
        super(element);
        this._router = router;
        this._observerLocator = observerLocator;
        this._themeService = themeService;
        this._identityService = identityService;
    }

    private readonly _router: Router;
    private readonly _observerLocator: ObserverLocator;
    private readonly _identityService: IdentityService;
    private _isAuthenticatedObserver: InternalPropertyObserver;
    protected readonly _themeService: ThemeService;

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component,
        {
            theme: this._themeService.theme
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
            // TODO: what was the side effects of accessign the authenticated property?
            this._identityService.identity;
            this._router.navigate("/");
        }
    }
}
