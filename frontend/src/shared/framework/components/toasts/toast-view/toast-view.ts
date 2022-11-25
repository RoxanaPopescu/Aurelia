import { autoinject } from "aurelia-framework";
import { Compose } from "aurelia-templating-resources";
import { ToastService, Toast } from "../../../services/toast";

/**
 * Represents the stack of toast view currently being presented.
 *
 * ### How to use:
 * Place directly within the root view of the app, after the root `router-view` element.
 * Inject the `ToastService` instance where needed, and use it to open toasts.
 */
@autoinject
export class ToastViewCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param toastService The `ToastService` instance.
     */
    public constructor(toastService: ToastService)
    {
        this.toastService = toastService;
    }

    private hoverTimeoutHandle: any;

    /**
     * The toast service, managing the stack of toasts currently being presented.
     */
    protected toastService: ToastService;

    protected enablePointerEvents = false;

    /**
     * Called for each toast, to get the model to pass to the `activate` method of the toast component,
     * to enrich the toast with a reference to the `compose` element, and to register the toast in the
     * container associated with the `compose` element.
     * @param toast The toast being presented.
     * @param compose The `compose` component presenting the toast.
     * @returns The model to pass to the `activate` method of the toast component.
     */
    protected getModel(toast: Toast, compose: Compose): Toast
    {
        // Store a reference to the `compose` element on the toast.
        // This allows the toast to access the life cycle methods on the component being presented.
        toast.compose = compose;

        // Register the toast in the container associated with the `compose` element.
        // This allows the toast to be injected into the component being presented.
        (compose as any).container.registerInstance(Toast, toast);

        return toast.model;
    }

    /**
     * Called when the mouse enters an element within the scroll view.
     * Enables pointer events for the `toast-view` element, to enable scrolling.
     * This is needed because a wide toast causes the scroll container to expand
     * and, if pointer events were always enabled, block pointer interaction with
     * the content on the page.
     */
    protected onMouseEnter()
    {
        clearTimeout(this.hoverTimeoutHandle);

        this.enablePointerEvents = true;
    }

    /**
     * Called when the mouse leaves an element within the scroll view.
     * Schedules pointer events for the `toast-view` element to be disabled,
     * to disable scrolling when no compose element is hovered.
     */
    protected onMouseLeave()
    {
        this.hoverTimeoutHandle = setTimeout(() => this.enablePointerEvents = false);
    }
}
