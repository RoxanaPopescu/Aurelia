import { inject, bindable, Optional } from "aurelia-framework";
import { AccentColor } from "resources/styles";
import { Toast } from "../../../services/toast";

/**
 * Represents a toast to be presented in the `toast-view`.
 *
 * ### How to use:
 * Place directly within the `template` element for the toast view.
 * When scoping styles, use a selector such as `toast[name="example"]`.
 */
@inject(Element, Optional.of(Toast, true))
export class ToastCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param toast The `Toast` instance representing the toast.
     */
    public constructor(element: Element, toast?: Toast)
    {
        this.element = element as HTMLElement;
        this.toast = toast;
    }

    private _closeTimeoutHandle: any;

    /**
     * The element representing the component.
     */
    protected readonly element: HTMLElement;

    /**
     * The `Toast` instance representing the toast.
     */
    protected readonly toast: Toast | undefined;

    /**
     * The name of the dialog.
     * Note that this should be unique among the dialogs in the app.
     */
    @bindable
    public name: string;

    /**
     * True to show a close button and close on outside click, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeButton: boolean;

    /**
     * The time in milliseconds before the toast will automatically close,
     * or undefined to not close automatically.
     * Note that this must be set at the time the toast is attached, and that
     * only undefined may be assigned thereafter, to cancel the timeout.
     * Note that if closed automatically, the close reason is `close-timeout`.
     */
    @bindable
    public closeTimeout: number | undefined;

    /**
     * True to close when the `Escape` key is pressed, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeShortcut: boolean;

    /**
     * The accent of the dialog, or undefined to apply no accent.
     * The default is undefined.
     */
    @bindable
    public accent?: AccentColor;

    /**
     * Called by the framework when the toast is activated.
     * @param model The model to use for the toast.
     */
    public attached(): void
    {
        if (this.closeTimeout != null)
        {
            // Schedule the toast to close.
            this._closeTimeoutHandle = setTimeout(() => this.toast?.close("close-timeout"), this.closeTimeout);
        }
    }

    /**
     * Called when the close button is clicked.
     */
    protected onCloseClick(): void
    {
        if (this.toast != null)
        {
            // tslint:disable-next-line: no-floating-promises
            this.toast.close();
        }
    }

    /**
     * Called when a key is pressed.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        if (event.key === "Escape" && !event.defaultPrevented && this.closeShortcut && this.toast != null)
        {
            // tslint:disable-next-line: no-floating-promises
            this.toast.close();

            return false;
        }

        return true;
    }

    /**
     * Called by the framework when the `closeTimeout` property changes.
     */
    protected closeTimeoutChanged(): void
    {
        if (this.closeTimeout == null)
        {
            // Cancel any scheduled closing.
            clearTimeout(this._closeTimeoutHandle);
        }
    }
}
